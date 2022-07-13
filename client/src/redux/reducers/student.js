const student = (state = null, action) => {
  switch (action.type) {
    case "student/login":
      return {
        _id: action.data._id,
        email: action.data.email,
        firstSurname: action.data.firstSurname,
        isDeleted: action.data.isDeleted,
        name: action.data.name,
        secondSurname: action.data.secondSurname,
        username: action.data.email.split("@", 1)[0],
      };
    case "student/logout":
      return null;
    default:
      return state;
  }
};

export default student;
