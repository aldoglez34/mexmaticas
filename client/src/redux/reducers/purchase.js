const purchase = (state = null, action) => {
  switch (action.type) {
    case "purchase/set":
      return action.data;
    case "purchase/clear":
      return null;
    default:
      return state;
  }
};

export default purchase;
