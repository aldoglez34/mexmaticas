const router = require("express").Router();
const errorLogger = require("../utils/errors");
const model = require("../../models");
const { getFullName, getNextDifficulty } = require("../utils/helpers");

// buyCourse()
// matches with /studentapi/student/buyCourse
router.put("/student/buyCourse", function (req, res) {
  const { courseId, studentId } = req.body;

  // get all exams from the given course
  model.Course.findById(courseId)
    .select("topics.exams")
    .lean()
    .populate("topics.exams", "difficulty")
    .then((data) => {
      const courses = data.topics.reduce((acc, cv) => {
        acc.push(...cv.exams);
        return acc;
      }, []);

      const onlyBasics = courses.reduce((acc, cv) => {
        if (cv.difficulty === "Basic") acc.push(cv._id);
        return acc;
      }, []);

      return onlyBasics;
    })
    .then((onlyBasics) => {
      // insert only basic exams into the student account
      model.Student.findOneAndUpdate(
        { _id: studentId },
        {
          $push: {
            courses: courseId,
            exams: onlyBasics,
          },
        }
      )
        .then((data) => res.json(data))
        .catch((err) => {
          console.log("@error", err);
          res.status(422).send({ msg: "Ocurrió un error" });
        });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

// fetchStudentByUID()
// matches with /studentapi/student/fetchByUID/:uid
router.get("/student/fetchByUID/:uid", function (req, res) {
  model.Student.findOne({ firebaseUID: req.params.uid })
    .select("name firstSurname secondSurname email isDeleted")
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

// fetchStudentClassrooms()
// matches with /studentapi/student/fetchClassrooms/:id
router.get("/student/fetchClassrooms/:id", (req, res) =>
  model.Student.findById(req.params.id)
    .select("classrooms")
    .populate({
      path: "classrooms",
      select: "name teacher institution courses",
      populate: {
        path: "teacher institution courses",
        select:
          "name firstSurname secondSurname topics.name topics.subject topics._id teacher._id",
      },
    })
    .then((data) => {
      const classrooms = (data.classrooms || []).map((classroom) => {
        const name = classroom.name;
        const institution = classroom.institution && classroom.institution.name;
        const teacher =
          classroom.teacher &&
          getFullName(
            classroom.teacher.name,
            classroom.teacher.firstSurname,
            classroom.teacher.secondSurname
          );
        const teacherId = classroom.teacher?._id;
        const courses = classroom.courses;

        return { courses, institution, name, teacher, teacherId };
      });

      res.json(classrooms);
    })
    .catch((err) => errorLogger(err, res, 422))
);

// registerNewStudent()
// matches with /studentapi/student/new
router.post("/student/new", function (req, res) {
  model.Student.create({
    firebaseUID: req.body.firebaseUID,
    name: req.body.name,
    firstSurname: req.body.firstSurname,
    secondSurname: req.body.secondSurname,
    email: req.body.email,
  })
    .then((newUser) => {
      // console.log(newUser);
      res.json(newUser);
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

// fetchDashboard()
// matches with /studentapi/student/fetchDashboard/:studentId
router.get("/student/fetchDashboard/:studentId", function (req, res) {
  const studentId = req.params.studentId;

  model.Student.findById(studentId)
    .select("courses attempts rewards perfectGrades")
    .lean()
    .populate(
      "courses",
      "name description topics._id topics.topicOrderNumber topics.subject topics.name"
    )
    .then((data) => {
      const myRewards = data.rewards;

      res.json({
        ...data,
        courses: data.courses.reduce((acc, cv) => {
          acc.push({
            ...cv,
            rewards: myRewards.filter((mr) =>
              cv.topics.filter((t) => t._id === mr.topicId)
            ),
            topics: cv.topics.reduce((acc, cv) => {
              acc.push({
                ...cv,
                hasReward: myRewards.filter((mr) => mr.topicId === cv._id)
                  .length
                  ? true
                  : false,
              });
              return acc;
            }, []),
          });
          return acc;
        }, []),
      });
    })
    .catch((err) => {
      console.log("error", err);
      res.send("Ocurrió un error en el servidor");
    });
});

// fetchMessages()
// matches with /studentapi/student/messages/:username
router.get("/messages/:username", function (req, res) {
  const username = req.params.username;

  model.Message.find({ username })
    .sort({ sentAt: -1 })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error");
    });
});

// fetchUnseeenMessages()
// matches with /studentapi/student/messages/unseen/:studentId
router.get("/messages/unseen/:studentId", function (req, res) {
  const studentId = req.params.studentId;

  model.Student.findById(studentId)
    .select("unseenMessages")
    .then((data) => res.json(data.unseenMessages))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

// markAllMessagesSeen()
// matches with /studentapi/student/messages/markAllSeen/:studentId
router.put("/messages/markAllSeen/:studentId", function (req, res) {
  const studentId = req.params.studentId;

  model.Student.findByIdAndUpdate(studentId, { unseenMessages: 0 })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

// fetchCourseInfo()
// matches with /studentapi/course/info/:courseId/:studentId
router.get("/course/info/:courseId/:studentId", function (req, res) {
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;

  let courseData = {};

  // 1. first get the course data
  model.Course.findById(courseId)
    .lean()
    .select(
      "name topics._id topics.subject topics.name topics.topicOrderNumber topics.description topics.freestyle topics.material topics.exams topics.reward"
    )
    .populate(
      "topics.exams",
      "_id name description duration difficulty qCounter examOrderNumber questions"
    )
    .then((data) => {
      courseData = data;

      // 2. then get the student data
      return model.Student.findById(studentId).select(
        "exams attempts rewards perfectGrades"
      );
    })
    .then((data) => {
      const studentData = data;

      courseData.rewards = courseData.topics.reduce((acc, cv) => {
        acc.push({
          medalName: `Medalla de ${cv.name}`,
          link: cv.reward.link,
          hasReward: studentData.rewards.filter(
            (r) => String(r.topicId) === String(cv._id)
          ).length
            ? true
            : false,
        });

        return acc;
      }, []);

      // 3. combine both results and send to client
      return {
        ...courseData,
        // topics reduce
        topics: courseData.topics.reduce((acc, cv) => {
          acc.push({
            ...cv,
            freestyle: {
              ...cv.freestyle,
              lastVisit: cv.freestyle.attempts
                .filter((a) => a.studentId.toString() === studentId.toString())
                .sort((a, b) => (a.date > b.date ? -1 : 1))[0]
                ? cv.freestyle.attempts
                    .filter(
                      (a) => a.studentId.toString() === studentId.toString()
                    )
                    .sort((a, b) => (a.date > b.date ? -1 : 1))[0].date
                : null,
              myHighestScore: cv.freestyle.attempts
                .filter((a) => a.studentId.toString() === studentId.toString())
                .sort((a, b) => (a.score > b.score ? -1 : 1))[0]
                ? cv.freestyle.attempts
                    .filter(
                      (a) => a.studentId.toString() === studentId.toString()
                    )
                    .sort((a, b) => (a.score > b.score ? -1 : 1))[0].score
                : 0,
              myTryouts: cv.freestyle.attempts.filter(
                (a) => a.studentId.toString() === studentId.toString()
              ).length,
            },
            hasReward: studentData.rewards.filter(
              (r) => String(r.topicId) === String(cv._id)
            ).length
              ? true
              : false,
            // exams reduce
            exams: cv.exams.reduce((acc, cv) => {
              acc.push({
                ...cv,
                questions: cv.questions.length,
                isAvailable: studentData.exams.includes(cv._id),
                hasPerfectGrade: studentData.perfectGrades.includes(cv._id),
                attemptsCounter: studentData.attempts.filter(
                  (a) => a.exam.toString() === cv._id.toString()
                ).length,
                latestAttempt: studentData.attempts
                  .filter((a) => a.exam.toString() === cv._id.toString())
                  .sort((a, b) => (a.date > b.date ? -1 : 1))[0]
                  ? studentData.attempts
                      .filter((a) => a.exam.toString() === cv._id.toString())
                      .sort((a, b) => (a.date > b.date ? -1 : 1))[0].date
                  : null,
                highestGrade: studentData.attempts
                  .filter((a) => a.exam.toString() === cv._id.toString())
                  .sort((a, b) => (a.grade > b.grade ? -1 : 1))[0]
                  ? studentData.attempts
                      .filter((a) => a.exam.toString() === cv._id.toString())
                      .sort((a, b) => (a.grade > b.grade ? -1 : 1))[0].grade
                  : 0,
              });
              return acc;
            }, []),
          });
          return acc;
        }, []),
      };
    })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error");
    });
});

// fetchTop10()
// matches with /studentapi/course/top10/:courseId/:topicId
router.get("/course/top10/:courseId/:topicId", async (req, res) => {
  const { courseId, topicId } = req.params;

  try {
    const topics = await model.Course.findById(courseId)
      .select("topics")
      .then(({ topics }) => topics);

    const thisTopic = topics.filter((t) => String(t._id) == String(topicId))[0];

    const top10 = thisTopic.freestyle.attempts
      .sort((a, b) => (a.score > b.score ? -1 : 1))
      .slice(0, 10);

    res.json(top10);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// fetchExamInfo()
// matches with /studentapi/exam/info/:examId
router.get("/exam/info/:examId", function (req, res) {
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
// matches with /studentapi/exam/registerAttempt
router.put("/exam/registerAttempt", async (req, res) => {
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

// fetchFreestyle()
// matches with /studentapi/freestyle/:courseId/:topicId
router.get("/freestyle/:courseId/:topicId", function (req, res) {
  console.log("entrando a fetch freestyle");
  const { courseId, topicId } = req.params;
  const difficulties = ["Intermediate", "Intermediate-Advanced", "Advanced"];

  model.Course.findById(courseId)
    .select("topics._id topics.name topics.difficulty topics._exams")
    .populate("topics.exams")
    .then((course) => {
      // get only this topics exams
      const thisTopicsExams = course.topics
        .filter((t) => String(t._id) === String(topicId))[0]
        .exams.filter((e) => difficulties.includes(e.difficulty));

      // mix all the questions (and set the value for each Q)
      const allQuestions = thisTopicsExams.reduce((acc, cv) => {
        const value =
          cv.difficulty === difficulties[0]
            ? 1
            : cv.difficulty === difficulties[1]
            ? 2
            : cv.difficulty === difficulties[2]
            ? 3
            : 0;

        const arr = cv.questions.reduce((acc, cv) => {
          acc.push({
            qValue: value,
            qInstruction: cv.qInstruction,
            qTechnicalInstruction: cv.qTechnicalInstruction,
            qMultipleChoice: cv.qMultipleChoice,
            qCorrectAnswers: cv.qCorrectAnswers,
            qComment: cv.qComment,
          });
          return acc;
        }, []);

        acc.push(...arr);

        return acc;
      }, []);

      const allQuestionsCounter = allQuestions.length;

      // generate random numbers
      const uniqueNumbers = [];
      while (uniqueNumbers.length <= allQuestionsCounter) {
        let n = Math.floor(Math.random() * allQuestionsCounter);
        if (!uniqueNumbers.includes(n)) uniqueNumbers.push(n);
        if (uniqueNumbers.length === allQuestionsCounter) {
          break;
        }
      }

      // extract the questions
      return uniqueNumbers.reduce((acc, cv, idx) => {
        acc.push({
          qNumber: idx + 1,
          qValue: allQuestions[cv].qValue,
          qInstruction: allQuestions[cv].qInstruction,
          qTechnicalInstruction: allQuestions[cv].qTechnicalInstruction.type
            ? allQuestions[cv].qTechnicalInstruction
            : null,
          qMultipleChoice:
            allQuestions[cv].qMultipleChoice.textChoices.length ||
            allQuestions[cv].qMultipleChoice.imageChoices.length
              ? allQuestions[cv].qMultipleChoice
              : null,
          qCorrectAnswers: allQuestions[cv].qCorrectAnswers,
          qComment: allQuestions[cv].qComment,
        });
        return acc;
      }, []);
    })
    .then((freestyleExam) => res.json(freestyleExam))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error");
    });
});

// registerFreestyleAttempt()
// matches with /studentapi/freestyle/registerAttempt
router.put("/freestyle/registerAttempt", function (req, res) {
  const { courseId, score, studentId, topicId, username } = req.body;

  const newAttempt = {
    studentId,
    username,
    score,
  };

  model.Course.update(
    { _id: courseId, "topics._id": topicId },
    {
      $push: {
        "topics.$.freestyle.attempts": newAttempt,
      },
    }
  )
    .then((data) => res.send(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error");
    });
});

// messageTeacher()
// matches with /studentapi/messageTeacher
router.put("/messageTeacher", function (req, res) {
  const { image, origin, student, teacherId, text } = req.body;

  model.Teacher.findOneAndUpdate(
    { _id: teacherId },
    {
      $push: {
        messages: { image, origin, student, text },
      },
    }
  )
    .then(() => res.json("El mensaje se ha enviado con éxito."))
    .catch((err) => errorLogger(err, res, 422));
});

module.exports = router;
