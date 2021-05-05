const examReducers = (state = null, action) => {
  switch (action.type) {
    case "zenMode/on":
      return true;
    case "zenMode/off":
      return false;
    default:
      return state;
  }
};

export default examReducers;
