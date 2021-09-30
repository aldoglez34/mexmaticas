import { isEqual } from "lodash";

export const getForwardUrl = (purchase) => {
  const isDev = isEqual(process.env.NODE_ENV, "development");

  let url;

  if (isDev) {
    url = purchase
      ? `http://localhost:3000/payment/${purchase.school}/${purchase.courseId}`
      : "http://localhost:3000/dashboard";
  } else {
    url = purchase
      ? `https://mexmaticas.herokuapp.com/${purchase.school}/${purchase.courseId}`
      : "https://mexmaticas.herokuapp.com/dashboard";
  }

  return url;
};
