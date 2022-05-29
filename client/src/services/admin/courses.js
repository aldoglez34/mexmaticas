import axios from "axios";

export const fetchCourses = () => axios.get("/adminapi/courses/all");

export const fetchOneCourse = (courseId) =>
  axios.get(`/adminapi/courses/${courseId}`);

export const newCourse = (data) => axios.post("/adminapi/courses/new", data);

export const updateCourseName = (data) =>
  axios.put("/adminapi/courses/update/name", data);

export const updateCourseSchool = (data) =>
  axios.put("/adminapi/courses/update/school", data);

export const updateCourseStatus = (data) =>
  axios.put("/adminapi/courses/update/status", data);

export const updateCoursePrice = (data) =>
  axios.put("/adminapi/courses/update/price", data);

export const updateCourseDescription = (data) =>
  axios.put("/adminapi/courses/update/description", data);

export const updateCourseSummary = (data) =>
  axios.put("/adminapi/courses/update/summary", data);
