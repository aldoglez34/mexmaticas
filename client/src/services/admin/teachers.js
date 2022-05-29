import axios from "axios";

export const fetchTeachers = () => axios.get("/adminapi/teachers/all");

export const registerNewTeacher = (data) =>
  axios.post("/adminapi/teachers/new", data);
