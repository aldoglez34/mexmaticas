import { isEqual } from "lodash";
import moment from "moment";
import "moment/locale/es";

export const getForwardUrl = (purchase) => {
  const isDev = isEqual(process.env.NODE_ENV, "development");

  let url;

  if (isDev) {
    url = purchase
      ? `http://localhost:3000/payment/${purchase.school}/${purchase.courseId}`
      : "http://localhost:3000/dashboard";
  } else {
    url = purchase
      ? `https://www.mexmaticas.com.mx/${purchase.school}/${purchase.courseId}`
      : "https://www.mexmaticas.com.mx/dashboard";
  }

  return url;
};

export const formatDate = (str, format) => moment(str).format(format);
