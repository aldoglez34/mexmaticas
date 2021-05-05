export const setCourse = (data) => {
  return {
    type: "course/set",
    data,
  };
};

export const clearCourse = () => {
  return {
    type: "course/clear",
  };
};
