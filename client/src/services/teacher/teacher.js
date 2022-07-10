import axios from "axios";

export const fetchTeacherInfo = (email) =>
  axios.get(`/teacherapi/teacher/${email}`);
