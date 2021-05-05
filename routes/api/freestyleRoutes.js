const router = require("express").Router();
const model = require("../../models");

// fetchFreestyle()
// matches with /api/freestyle/:courseId/:topicId
router.get("/:courseId/:topicId", function (req, res) {
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
// matches with /api/freestyle/registerAttempt
router.put("/registerAttempt", function (req, res) {
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

module.exports = router;
