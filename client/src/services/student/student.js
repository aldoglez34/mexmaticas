import axios from "axios";

export const buyCourse = (data) =>
  axios.put("/studentapi/student/buyCourse", data);

export const fetchStudentByUID = (uid) =>
  axios.get(`/studentapi/student/fetchByUID/${uid}`);

export const registerNewStudent = (data) =>
  axios.post("/studentapi/student/new", data);

export const fetchDashboard = (studentId) =>
  axios.get(`/studentapi/student/fetchDashboard/${studentId}`);

export const fetchMessages = (username) =>
  axios.get(`/studentapi/messages/${username}`);

export const fetchUnseeenMessages = (studentId) =>
  axios.get(`/studentapi/messages/unseen/${studentId}`);

export const markAllMessagesSeen = (studentId) =>
  axios.put(`/studentapi/messages/markAllSeen/${studentId}`);

export const fetchCourseInfo = (courseId, studentId) =>
  axios.get(`/studentapi/course/info/${courseId}/${studentId}`);

export const fetchTop10 = (courseId, studentId) =>
  axios.get(`/studentapi/course/top10/${courseId}/${studentId}`);

export const fetchExamInfo = (examId) =>
  axios.get(`/studentapi/exam/info/${examId}`);

export const registerAttempt = (data) =>
  axios.put("/studentapi/exam/registerAttempt", data);

export const fetchFreestyle = (courseId, topicId) =>
  axios.get(`/studentapi/freestyle/${courseId}/${topicId}`);

export const registerFreestyleAttempt = (data) =>
  axios.put("/studentapi/freestyle/registerAttempt", data);
