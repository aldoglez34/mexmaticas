import { useMemo } from "react";
import { isEqual } from "lodash";
import {
  DichotomousQuestion,
  DichotomousQuestionWithImage,
  ImageWithTwoAnswers,
  MultipleOptionForm,
  MultipleOptionWithImage,
  SimpleQuestionForm,
  SimpleWithImageForm,
  SimpleWithTwoAnswersForm,
} from "../questions-forms";
import {
  DichotomousQuestionTable,
  DichotomousQuestionWithImageTable,
  ImageWithTwoAnswersTable,
  MultipleOptionQuestionsTable,
  MultipleOptionWithImageTable,
  SimpleQuestionTable,
  SimpleWithImageQuestionsTable,
  SimpleWithTwoAnswersTable,
} from "../questions-tables";
import { deleteQuestion } from "../../../../services";

export const useExamsData = (questions = [], courseId, examId) => {
  const handleDeleteQuestion = (questionId) =>
    deleteQuestion({ courseId, examId, questionId })
      .then(() => window.location.reload())
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });

  const questionTypes = [
    {
      Form: SimpleQuestionForm,
      name: "Sencilla",
      Table: SimpleQuestionTable,
      type: "simple",
      table: {
        headers: ["Instrucción", "I. Técnica", "Respuesta", "Comentario"],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: SimpleQuestionForm,
      },
      rows: {
        accessors: [
          "qInstruction",
          "qTechnicalInstruction.text",
          [
            "qCorrectAnswers[0].complementLeft",
            "qCorrectAnswers[0].answer",
            "qCorrectAnswers[0].complementRight",
          ],
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: SimpleWithImageForm,
      name: "Sencilla con imagen",
      Table: SimpleWithImageQuestionsTable,
      type: "simpleWithPic",
      table: {
        headers: ["Instrucción", "Imagen", "Respuesta", "Comentario"],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: SimpleWithImageForm,
      },
      rows: {
        accessors: [
          "qInstruction",
          { image: "qTechnicalInstruction.imageLink" },
          [
            "qCorrectAnswers[0].complementLeft",
            "qCorrectAnswers[0].answer",
            "qCorrectAnswers[0].complementRight",
          ],
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: SimpleWithTwoAnswersForm,
      name: "Sencilla con 2 respuestas",
      Table: SimpleWithTwoAnswersTable,
      type: "twoAnswers",
      table: {
        headers: ["Instrucción", "I. Técnica", "Respuestas", "Comentario"],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: SimpleWithTwoAnswersForm,
      },
      rows: {
        accessors: [
          "qInstruction",
          "qTechnicalInstruction.text",
          {
            acc: "qCorrectAnswers",
            list: ["complementLeft", "answer", "complementRight"],
          },
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: ImageWithTwoAnswers,
      name: "Imagen con 2 respuestas",
      Table: ImageWithTwoAnswersTable,
      type: "imageWithTwoAnswers",
      table: {
        headers: ["Instrucción", "Imagen", "Respuestas", "Comentario"],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: ImageWithTwoAnswers,
      },
      rows: {
        accessors: [
          "qInstruction",
          { image: "qTechnicalInstruction.imageLink" },
          {
            acc: "qCorrectAnswers",
            list: ["complementLeft", "answer", "complementRight"],
          },
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: MultipleOptionForm,
      name: "Opción múltiple",
      Table: MultipleOptionQuestionsTable,
      type: "multipleOption",
      table: {
        headers: [
          "Instrucción",
          "I. Técnica",
          "Opciones",
          "Respuesta",
          "Comentario",
        ],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: MultipleOptionForm,
      },
      rows: {
        accessors: [
          "qInstruction",
          "qTechnicalInstruction.text",
          {
            acc: "qMultipleChoice.textChoices",
            list: true,
          },
          "qCorrectAnswers[0].answer",
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: MultipleOptionWithImage,
      name: "Opción múltiple con imagen",
      Table: MultipleOptionWithImageTable,
      type: "multipleOptionWithPic",
      table: {
        headers: [
          "Instrucción",
          "Imagen",
          "Opciones",
          "Respuesta",
          "Comentario",
        ],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: MultipleOptionWithImage,
      },
      rows: {
        accessors: [
          "qInstruction",
          { image: "qTechnicalInstruction.imageLink" },
          {
            acc: "qMultipleChoice.textChoices",
            list: true,
          },
          "qCorrectAnswers[0].answer",
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: DichotomousQuestion,
      name: "Dicotómica",
      Table: DichotomousQuestionTable,
      type: "dichotomous",
      table: {
        headers: [
          "Instrucción",
          "I. Técnica",
          "Opciones",
          "Respuesta",
          "Comentario",
        ],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: DichotomousQuestion,
      },
      rows: {
        accessors: [
          "qInstruction",
          "qTechnicalInstruction.text",
          {
            acc: "qMultipleChoice.textChoices",
            list: true,
          },
          "qCorrectAnswers[0].answer",
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
    {
      Form: DichotomousQuestionWithImage,
      name: "Dicotómica con imagen",
      Table: DichotomousQuestionWithImageTable,
      type: "dichotomousWithPic",
      table: {
        headers: [
          "Instrucción",
          "Imagen",
          "Opciones",
          "Respuesta",
          "Comentario",
        ],
        onDeleteFunc: (item) => handleDeleteQuestion(item._id),
        onEditForm: DichotomousQuestionWithImage,
      },
      rows: {
        accessors: [
          "qInstruction",
          { image: "qTechnicalInstruction.imageLink" },
          {
            acc: "qMultipleChoice.textChoices",
            list: true,
          },
          "qCorrectAnswers[0].answer",
          {
            acc: "qComment",
            breakLine: "\\n",
          },
        ],
      },
    },
  ];

  const questionTypesData = useMemo(
    () =>
      questionTypes.map((q) => {
        const questionData = questions.filter(({ qType }) =>
          isEqual(qType, q.type)
        );
        return {
          ...q,
          rows: {
            ...q.rows,
            data: questionData,
          },
          hasQuestions: Boolean(questionData.length),
          nameWithCounter: `[${questionData.length}] ${q.name}`,
        };
      }),
    [questions]
  );

  return { questionTypesData };
};
