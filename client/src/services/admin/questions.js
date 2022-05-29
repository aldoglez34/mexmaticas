import axios from "axios";

export const newSimpleQuestion = (data) =>
  axios.post("/adminapi/questions/simpleQuestion/new", data);

export const newSimpleWithImageQuestion = (data) =>
  axios.post("/adminapi/questions/simpleWithImage/new", data);

export const newImageWithTwoAnswersQuestion = (data) =>
  axios.post("/adminapi/questions/imageWithTwoAnswers/new", data);

export const newSimpleWithTwoAnswersQuestion = (data) =>
  axios.post("/adminapi/questions/simpleWithTwoAnswers/new", data);

export const newMultipleOptionQuestion = (data) =>
  axios.post("/adminapi/questions/multipleOption/new", data);

export const newMultipleOptionWithImage = (data) =>
  axios.post("/adminapi/questions/multipleOptionWithImage/new", data);

export const newDichotomousQuestion = (data) =>
  axios.post("/adminapi/questions/dichotomousQuestion/new", data);

export const newDichotomousQuestionWithImage = (data) =>
  axios.post("/adminapi/questions/dichotomousQuestionWithImage/new", data);

export const deleteQuestion = (data) =>
  axios.put("/adminapi/questions/delete", data);
