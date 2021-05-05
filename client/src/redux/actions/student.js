export const loginStudent = (data) => {
  return {
    type: "student/login",
    data,
  };
};

export const logoutStudent = () => {
  return {
    type: "student/logout",
  };
};
