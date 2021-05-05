export const setPurchase = (data) => {
  return {
    type: "purchase/set",
    data,
  };
};

export const clearPurchase = () => {
  return {
    type: "purchase/clear",
  };
};
