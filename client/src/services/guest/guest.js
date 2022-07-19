import axios from "axios";

export const fetchSchoolDropdownItems = () =>
  axios.get("/guestapi/fetchSchoolDropdownItems");

export const fetchCoursesBySchool = (school, studentId) =>
  axios.get(`/guestapi/fetchCoursesBySchool/${school}/${studentId}`);

export const fetchLandingPageCourses = () =>
  axios.get("/guestapi/fetchLandingPageCourses");
