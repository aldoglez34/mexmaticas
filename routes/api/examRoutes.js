const router = require("express").Router();
const model = require("../../models");
const { getNextDifficulty } = require("../utils/utils");

// fetchExamInfo()
// matches with /api/exam/info/:examId
router.get("/info/:examId", function (req, res) {
  const examId = req.params.examId;

  model.Exam.findById(examId)
    .select("name questions duration qCounter")
    .then((data) => {
      const totalQuestions = data.questions.length;
      const qCounter =
        totalQuestions < data.qCounter ? totalQuestions : data.qCounter;

      // generate random numbers
      const uniqueNumbers = [];
      while (uniqueNumbers.length <= qCounter) {
        let n = Math.floor(Math.random() * totalQuestions);
        if (!uniqueNumbers.includes(n)) uniqueNumbers.push(n);
        // ...
        if (uniqueNumbers.length === qCounter) {
          break;
        }
      }

      // extract the questions
      const randomQuestions = uniqueNumbers.reduce((acc, cv) => {
        acc.push(data.questions[cv]);
        return acc;
      }, []);

      // add the qNumber field and return it
      return {
        _id: data._id,
        name: data.name,
        duration: data.duration,
        questions: randomQuestions.reduce((acc, cv, idx) => {
          acc.push({
            _id: cv._id,
            qNumber: idx + 1,
            qInstruction: cv.qInstruction,
            qTechnicalInstruction: cv.qTechnicalInstruction.type
              ? cv.qTechnicalInstruction
              : null,
            qMultipleChoice:
              cv.qMultipleChoice.textChoices.length ||
              cv.qMultipleChoice.imageChoices.length
                ? cv.qMultipleChoice
                : null,
            qCorrectAnswers: cv.qCorrectAnswers,
            qComment: cv.qComment ? cv.qComment : null,
          });
          return acc;
        }, []),
      };
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error");
    });
});

// registerAttempt()
// matches with /api/exam/registerAttempt
router.put("/registerAttempt", async (req, res) => {
  const {
    courseId,
    examDifficulty,
    examId,
    examLink,
    examName,
    grade,
    studentId,
    topicId,
  } = req.body;

  const isExamApproved = grade >= 8;
  const isLastExam = examDifficulty === "Advanced";
  let unlockedExam = undefined;
  let hasExamBeenApprovedBefore = undefined;

  try {
    // CHECK IF THIS EXAM HAS BEEN APPROVED PREVIOUSLY
    hasExamBeenApprovedBefore = await model.Student.findById(studentId).then(
      ({ attempts }) => {
        const bestGradeObj = attempts
          .filter((a) => String(a.exam) === String(examId))
          .sort((a, b) => Number(b.grade) + Number(a.grade))[0];
        const bestGrade = bestGradeObj && bestGradeObj.grade;
        return bestGrade >= 8;
      }
    );

    // REGISTER ATTEMPT (regardless if it's approved or not)
    await model.Student.findOneAndUpdate(
      { _id: studentId },
      {
        $push: {
          attempts: { course: courseId, topicId, exam: examId, grade: grade },
        },
      }
    );

    // REGISTER PERFECT GRADE (only if it doesn't exist)
    const isPerfectGrade = grade === 10;
    if (isPerfectGrade) {
      await model.Student.findOneAndUpdate(
        { _id: studentId },
        { $addToSet: { perfectGrades: examId } } // addToSet will push it only if it doesn't exist
      );
    }

    // REGISTER REWARD/CROWN (only for last exam)
    if (isLastExam && isExamApproved) {
      // check if the student already has the a reward for this topic
      const hasReward = await model.Student.findById(studentId).then(
        ({ rewards }) =>
          rewards.filter((r) => String(r.topicId) === String(topicId)).length >
          0
            ? true
            : false
      );

      if (!hasReward) {
        // push the reward -- "$ne" won't push it if it's there already
        await model.Student.findOneAndUpdate(
          { _id: studentId, "rewards.topicId": { $ne: topicId } },
          {
            $addToSet: { rewards: { link: examLink, name: examName, topicId } },
          }
        );
      }
    }

    // UNLOCK NEW EXAM
    if (isExamApproved && !isLastExam && !hasExamBeenApprovedBefore) {
      // get the data of the new exam from the database
      const nextExam = await model.Course.findOne({ _id: courseId })
        .select("topics")
        .populate("topics.exams", "_id name difficulty")
        .then(({ topics }) => {
          const thisTopic = topics.filter(
            (t) => String(t._id) === String(topicId)
          )[0];
          const nextDifficulty = getNextDifficulty(examDifficulty);
          return thisTopic.exams.filter(
            (e) => String(e.difficulty) === String(nextDifficulty)
          )[0];
        });

      // push exam into Student's exams
      const studentNewExams = await model.Student.findOneAndUpdate(
        { _id: studentId, exams: { $ne: nextExam._id } },
        { $addToSet: { exams: nextExam._id } },
        { new: true }
      );

      // double check if the new exam was added to the student's exams
      const wasTheExamAdded =
        studentNewExams.exams.filter((e) => String(e) === String(nextExam._id))
          .length > 0
          ? true
          : false;

      // sending error
      if (!wasTheExamAdded)
        return res
          .status(422)
          .send("Ocurrió un error, no se pudo desbloquear examen.");

      // get the unlocked exam's info
      unlockedExam = wasTheExamAdded && {
        name: nextExam.name,
        difficulty: nextExam.difficulty,
      };
    }

    res.json({
      hasExamBeenApprovedBefore,
      isFreestyleUnlocked:
        isLastExam && isExamApproved && !hasExamBeenApprovedBefore,
      unlockedExam,
    });
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

module.exports = router;
