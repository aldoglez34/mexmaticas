import axios from "axios";

export const fetchTeachers = () => axios.get("/adminapi/teachers/all");

export const registerNewTeacher = (data) =>
  axios.post("/adminapi/teachers/new", data);

export const assignTeacher = (data) =>
  axios.put("/adminapi/teachers/assign", data);

export const fetchOneTeacher = (teacherId) =>
  axios.get(`/adminapi/teachers/${teacherId}`);
