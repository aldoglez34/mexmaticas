import axios from "axios";

export const fetchTeacherClassrooms = (teacherId) =>
  axios.get(`/teacherapi/classrooms/all/${teacherId}`);

export const fetchOneClassroom = (classroomId) =>
  axios.get(`/teacherapi/classrooms/${classroomId}`);
