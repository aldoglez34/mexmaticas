const router = require("express").Router();
const model = require("../../models");

// newSimpleQuestion()
// matches with /adminapi/questions/simpleQuestion/new
router.post("/simpleQuestion/new", async (req, res) => {
  const { isEdition, oldQuestionId, questionId } = req.body;

  const newQuestion = {
    qType: "simple",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: req.body.qTechnicalInstruction
      ? {
          type: "text",
          text: req.body.qTechnicalInstruction,
        }
      : null,
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswers,
        complementLeft: req.body.qCALeft,
        complementRight: req.body.qCARight,
      },
    ],
    qComment: req.body.qComment,
    ...(!isEdition ? {} : { _id: oldQuestionId }),
  };

  try {
    if (!isEdition) {
      await model.Exam.findOneAndUpdate(
        { _id: req.body.examId },
        {
          $push: {
            questions: newQuestion,
          },
        }
      );

      res.send("La pregunta fue agregada con éxito.");
    }

    if (isEdition && questionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": questionId },
        {
          $set: {
            "questions.$": newQuestion,
          },
        }
      );

      res.send("La pregunta fue editada con éxito.");
    }
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// newSimpleWithImageQuestion()
// matches with /adminapi/questions/simpleWithImage/new
router.post("/simpleWithImage/new", async (req, res) => {
  const { courseId, examId, isEdition, oldQuestionId, topicId } = req.body;

  const newQuestion = {
    qType: "simpleWithPic",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: {
      type: "image",
      ...(!isEdition ? {} : { imageLink: req.body.firebasePath }),
    },
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswers,
        complementLeft: req.body.qCALeft,
        complementRight: req.body.qCARight,
      },
    ],
    qComment: req.body.qComment,
    ...(!isEdition ? {} : { _id: oldQuestionId }),
  };

  try {
    let newQuestionId = undefined;

    if (!isEdition) {
      // push the new question and get the latest question _id from the exam document
      newQuestionId = await model.Exam.findOneAndUpdate(
        { _id: examId },
        { $push: { questions: newQuestion } },
        { new: true } // returns the updated object
      ).then(({ questions }) => questions[questions.length - 1]._id);

      // build the firebase path and then update the question with it
      const firebasePath = `${courseId}/${topicId}/exams/${examId}/${newQuestionId}/imagen`;
      await model.Exam.findOneAndUpdate(
        { _id: examId, "questions._id": newQuestionId },
        {
          $set: { "questions.$.qTechnicalInstruction.imageLink": firebasePath },
        }
      );
    }

    if (isEdition && oldQuestionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": oldQuestionId },
        { $set: { "questions.$": newQuestion } },
        { new: true } // returns the updated object
      );
    }

    res.send(newQuestionId || oldQuestionId);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// newImageWithTwoAnswersQuestion()
// matches with /adminapi/questions/imageWithTwoAnswers/new
router.post("/imageWithTwoAnswers/new", async (req, res) => {
  const { courseId, examId, isEdition, oldQuestionId, topicId } = req.body;

  const newQuestion = {
    qType: "imageWithTwoAnswers",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: {
      type: "image",
      ...(!isEdition ? {} : { imageLink: req.body.firebasePath }),
    },
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswer1,
        complementLeft: req.body.qCALeft1,
        complementRight: req.body.qCARight1,
      },
      {
        answer: req.body.qCorrectAnswer2,
        complementLeft: req.body.qCALeft2,
        complementRight: req.body.qCARight2,
      },
    ],
    qComment: req.body.qComment,
    ...(!isEdition ? {} : { _id: oldQuestionId }),
  };

  try {
    let newQuestionId = undefined;

    if (!isEdition) {
      // push the new question and get the latest question _id from the exam document
      newQuestionId = await model.Exam.findOneAndUpdate(
        { _id: examId },
        { $push: { questions: newQuestion } },
        { new: true } // returns the updated object
      ).then(({ questions }) => questions[questions.length - 1]._id);

      // build the firebase path and then update the question with it
      const firebasePath = `${courseId}/${topicId}/exams/${examId}/${newQuestionId}/imagen`;
      await model.Exam.findOneAndUpdate(
        { _id: examId, "questions._id": newQuestionId },
        {
          $set: { "questions.$.qTechnicalInstruction.imageLink": firebasePath },
        }
      );
    }

    if (isEdition && oldQuestionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": oldQuestionId },
        { $set: { "questions.$": newQuestion } },
        { new: true } // returns the updated object
      );
    }

    res.send(newQuestionId || oldQuestionId);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// newSimpleWithTwoAnswersQuestion()
// matches with /adminapi/questions/simpleWithTwoAnswers/new
router.post("/simpleWithTwoAnswers/new", async (req, res) => {
  const { isEdition, questionId } = req.body;

  const newQuestion = {
    qType: "twoAnswers",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: req.body.qTechnicalInstruction
      ? {
          type: "text",
          text: req.body.qTechnicalInstruction,
        }
      : null,
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswer1,
        complementLeft: req.body.qCALeft1,
        complementRight: req.body.qCARight1,
      },
      {
        answer: req.body.qCorrectAnswer2,
        complementLeft: req.body.qCALeft2,
        complementRight: req.body.qCARight2,
      },
    ],
    qComment: req.body.qComment,
  };

  try {
    if (!isEdition) {
      await model.Exam.findOneAndUpdate(
        { _id: req.body.examId },
        { $push: { questions: newQuestion } }
      );

      res.send("La pregunta fue agregada con éxito.");
    }

    if (isEdition && questionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": questionId },
        {
          $set: {
            "questions.$": newQuestion,
          },
        }
      );

      res.send("La pregunta fue editada con éxito.");
    }
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// newMultipleOptionQuestion()
// matches with /adminapi/questions/multipleOption/new
router.post("/multipleOption/new", async (req, res) => {
  const { isEdition, questionId } = req.body;

  const newQuestion = {
    qType: "multipleOption",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: req.body.qTechnicalInstruction
      ? {
          type: "text",
          text: req.body.qTechnicalInstruction,
        }
      : null,
    qMultipleChoice: {
      type: "text",
      textChoices: [
        req.body.qOption1,
        req.body.qOption2,
        req.body.qOption3,
        req.body.qOption4,
      ],
    },
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswers,
      },
    ],
    qComment: req.body.qComment,
  };

  try {
    if (!isEdition) {
      await model.Exam.findOneAndUpdate(
        { _id: req.body.examId },
        { $push: { questions: newQuestion } }
      );

      res.send("La pregunta fue agregada con éxito.");
    }

    if (isEdition && questionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": questionId },
        {
          $set: {
            "questions.$": newQuestion,
          },
        }
      );

      res.send("La pregunta fue editada con éxito.");
    }
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// newMultipleOptionWithImage()
// matches with /adminapi/questions/multipleOptionWithImage/new
router.post("/multipleOptionWithImage/new", async (req, res) => {
  const { courseId, examId, isEdition, oldQuestionId, topicId } = req.body;

  const newQuestion = {
    qType: "multipleOptionWithPic",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: {
      type: "image",
      ...(!isEdition ? {} : { imageLink: req.body.firebasePath }),
    },
    qMultipleChoice: {
      type: "text",
      textChoices: [
        req.body.qOption1,
        req.body.qOption2,
        req.body.qOption3,
        req.body.qOption4,
      ],
    },
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswers,
        complementLeft: req.body.qCALeft,
        complementRight: req.body.qCARight,
      },
    ],
    qComment: req.body.qComment,
    ...(!isEdition ? {} : { _id: oldQuestionId }),
  };
  try {
    let newQuestionId = undefined;

    if (!isEdition) {
      // push the new question and get the latest question _id from the exam document
      newQuestionId = await model.Exam.findOneAndUpdate(
        { _id: examId },
        { $push: { questions: newQuestion } },
        { new: true } // returns the updated object
      ).then(({ questions }) => questions[questions.length - 1]._id);

      // build the firebase path and then update the question with it
      const firebasePath = `${courseId}/${topicId}/exams/${examId}/${newQuestionId}/imagen`;
      await model.Exam.findOneAndUpdate(
        { _id: examId, "questions._id": newQuestionId },
        {
          $set: { "questions.$.qTechnicalInstruction.imageLink": firebasePath },
        }
      );
    }

    if (isEdition && oldQuestionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": oldQuestionId },
        { $set: { "questions.$": newQuestion } },
        { new: true } // returns the updated object
      );
    }

    res.send(newQuestionId || oldQuestionId);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// newDichotomousQuestion()
// matches with /adminapi/questions/dichotomousQuestion/new
router.post("/dichotomousQuestion/new", async (req, res) => {
  const { isEdition, questionId } = req.body;

  const newQuestion = {
    qType: "dichotomous",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: req.body.qTechnicalInstruction
      ? {
          type: "text",
          text: req.body.qTechnicalInstruction,
        }
      : null,
    qMultipleChoice: {
      type: "text",
      textChoices: [req.body.qOption1, req.body.qOption2],
    },
    qCorrectAnswers: [
      {
        answer: req.body.qCorrectAnswers,
      },
    ],
    qComment: req.body.qComment,
  };

  try {
    if (!isEdition) {
      await model.Exam.findOneAndUpdate(
        { _id: req.body.examId },
        { $push: { questions: newQuestion } }
      );

      res.send("La pregunta fue agregada con éxito.");
    }

    if (isEdition && questionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": questionId },
        {
          $set: {
            "questions.$": newQuestion,
          },
        }
      );

      res.send("La pregunta fue editada con éxito.");
    }
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// newDichotomousQuestionWithImage()
// matches with /adminapi/questions/dichotomousQuestionWithImage/new
router.post("/dichotomousQuestionWithImage/new", async (req, res) => {
  const { courseId, examId, isEdition, oldQuestionId, topicId } = req.body;

  const newQuestion = {
    qType: "dichotomousWithPic",
    qInstruction: req.body.qInstruction,
    qTechnicalInstruction: {
      type: "image",
      ...(!isEdition ? {} : { imageLink: req.body.firebasePath }),
    },
    qMultipleChoice: {
      type: "text",
      textChoices: [req.body.qOption1, req.body.qOption2],
    },
    qCorrectAnswers: [{ answer: req.body.qCorrectAnswers }],
    qComment: req.body.qComment,
    ...(!isEdition ? {} : { _id: oldQuestionId }),
  };

  try {
    let newQuestionId = undefined;

    if (!isEdition) {
      // push the new question and get the latest question _id from the exam document
      newQuestionId = await model.Exam.findOneAndUpdate(
        { _id: examId },
        { $push: { questions: newQuestion } },
        { new: true } // returns the updated object
      ).then(({ questions }) => questions[questions.length - 1]._id);

      // build the firebase path and then update the question with it
      const firebasePath = `${courseId}/${topicId}/exams/${examId}/${newQuestionId}/imagen`;
      await model.Exam.findOneAndUpdate(
        { _id: examId, "questions._id": newQuestionId },
        {
          $set: { "questions.$.qTechnicalInstruction.imageLink": firebasePath },
        }
      );
    }

    if (isEdition && oldQuestionId) {
      await model.Exam.update(
        { _id: req.body.examId, "questions._id": oldQuestionId },
        { $set: { "questions.$": newQuestion } },
        { new: true } // returns the updated object
      );
    }

    res.send(newQuestionId || oldQuestionId);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// deleteQuestion()
// matches with /adminapi/questions/delete
router.put("/delete", function (req, res) {
  const { examId, questionId } = req.body;

  model.Exam.updateOne(
    { _id: examId },
    { $pull: { questions: { _id: questionId } } }
  )
    .then(() => res.send("La pregunta ha sido eliminada con éxito."))
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
