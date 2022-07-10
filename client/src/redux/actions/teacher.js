export const loginTeacher = (data) => ({
  type: "teacher/login",
  data,
});

export const logoutTeacher = () => ({
  type: "teacher/logout",
});
