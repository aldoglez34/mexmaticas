import axios from "axios";

export const fetchClassrooms = () => axios.get("/adminapi/classrooms/all");

export const fetchOneClassroom = (classroomId) =>
  axios.get(`/adminapi/classrooms/${classroomId}`);

export const fetchClassroomHistory = (classroomId) =>
  axios.get(`/adminapi/classrooms/history/${classroomId}`);

export const newClassroom = (data) =>
  axios.post("/adminapi/classrooms/new", data);

export const updateClassroomName = (data) =>
  axios.put("/adminapi/classrooms/update/name", data);

export const updateClassroomDescription = (data) =>
  axios.put("/adminapi/classrooms/update/description", data);

export const updateClassroomSchool = (data) =>
  axios.put("/adminapi/classrooms/update/school", data);

export const updateClassroomInstitution = (data) =>
  axios.put("/adminapi/classrooms/update/institution", data);

export const updateClassroomMembers = (data) =>
  axios.put("/adminapi/classrooms/update/members", data);

export const updateClassroomCourses = (data) =>
  axios.put("/adminapi/classrooms/update/courses", data);

export const deleteClassroom = (data) =>
  axios.put("/adminapi/classrooms/delete", data);
