const course = (state = null, action) => {
  switch (action.type) {
    case "course/set":
      return {
        _id: action.data._id,
        name: action.data.name,
      };
    case "course/clear":
      return null;
    default:
      return state;
  }
};

export default course;
