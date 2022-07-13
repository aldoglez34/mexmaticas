import axios from "axios";

export const fetchTeacherMessages = (teacherId) =>
  axios.get(`/teacherapi/messages/all/${teacherId}`);

export const markTeacherMsgSeen = (data) =>
  axios.put("/teacherapi/messages/seen", data);

export const answerTeacherMessage = (data) =>
  axios.post("/teacherapi/messages/answer", data);
