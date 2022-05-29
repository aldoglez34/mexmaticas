import axios from "axios";

export const fetchExam = (examId) =>
  axios.get(`/adminapi/exam/fetch/${examId}`);

export const updateExamName = (data) =>
  axios.put("/adminapi/exam/update/name", data);

export const updateExamDuration = (data) =>
  axios.put("/adminapi/exam/update/duration", data);

export const updateExamQCounter = (data) =>
  axios.put("/adminapi/exam/update/qCounter", data);

export const updateExamDescription = (data) =>
  axios.put("/adminapi/exam/update/description", data);
