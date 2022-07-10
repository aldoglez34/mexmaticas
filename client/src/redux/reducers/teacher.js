const teacher = (state = null, action) => {
  switch (action.type) {
    case "teacher/login":
      return {
        _id: action.data._id,
        email: action.data.email,
        firebaseUID: action.data.firebaseUID,
        name: action.data.name,
        fullName: action.data.fullName,
      };
    case "teacher/logout":
      return null;
    default:
      return state;
  }
};

export default teacher;
