const exam = (state = null, action) => {
  switch (action.type) {
    case "exam/set":
      return action.data;
    case "exam/unlock":
      return {
        ...state,
        unlocked: action.data,
      };
    case "exam/setResults":
      return {
        ...state,
        results: action.data,
      };
    case "exam/clear":
      return null;
    default:
      return state;
  }
};

export default exam;
