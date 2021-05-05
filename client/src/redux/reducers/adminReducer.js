const admin = (state = null, action) => {
  switch (action.type) {
    case "admin/clear":
      return null;
    case "admin/setTitle":
      return { ...state, title: action.data };
    case "admin/setCourse":
      return {
        ...state,
        course: {
          courseId: action.data.courseId,
          courseName: action.data.courseName,
          courseSchool: action.data.courseSchool,
        },
      };
    case "admin/setTopic":
      return {
        ...state,
        topic: {
          topicId: action.data.topicId,
          topicName: action.data.topicName,
        },
      };
    case "admin/setExam":
      return {
        ...state,
        exam: {
          examId: action.data.examId,
          examName: action.data.examName,
        },
      };
    default:
      return state;
  }
};

export default admin;
