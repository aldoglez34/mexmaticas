import axios from "axios";

export const fetchStudents = () => axios.get("/adminapi/students/all");

export const fetchStudentUnpurchased = (studentId) =>
  axios.get(`/adminapi/students/unpurchased/${studentId}`);

export const fetchStudentHistory = (studentId) =>
  axios.get(`/adminapi/students/history/${studentId}`);

export const assignCourse = (data) =>
  axios.put("/adminapi/students/assignCourse", data);

export const fetchOneStudent = (studentId) =>
  axios.get(`/adminapi/students/${studentId}`);

export const updateActivityStatus = (data) =>
  axios.put("/adminapi/students/update", data);
