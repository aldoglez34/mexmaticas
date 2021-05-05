export const clearAdminData = () => {
  return {
    type: "admin/clear",
  };
};

export const setTitle = (data) => {
  return {
    type: "admin/setTitle",
    data,
  };
};

export const setCourse = (data) => {
  return {
    type: "admin/setCourse",
    data,
  };
};

export const setTopic = (data) => {
  return {
    type: "admin/setTopic",
    data,
  };
};

export const setExam = (data) => {
  return {
    type: "admin/setExam",
    data,
  };
};
