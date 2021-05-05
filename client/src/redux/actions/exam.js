export const setExam = (data) => {
  return {
    type: "exam/set",
    data,
  };
};

export const setResults = (data) => {
  return {
    type: "exam/setResults",
    data,
  };
};

export const clearExam = () => {
  return {
    type: "exam/clear",
  };
};
