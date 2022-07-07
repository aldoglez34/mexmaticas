import { get, isEqual } from "lodash";
import moment from "moment";
import "moment/locale/es";

export const askUserToConfirm = (message, callback) =>
  isEqual(window.confirm(message), true) && callback();

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

export const convertToUpperCase = (str) =>
  String(str).toLocaleUpperCase().trim();

export const sortArrayOfObjects = (arr = [], key = "") =>
  arr.sort((a, b) =>
    convertToUpperCase(get(a, key, "")) < convertToUpperCase(get(b, key, ""))
      ? -1
      : 1
  );

export const isObject = (obj) =>
  Object.prototype.toString.call(obj) === "[object Object]";

export const isArray = (arr) => Array.isArray(arr);

export const isString = (str) => isEqual(typeof str, "string");

export const getFullName = (name, firstSurname, secondSurname) =>
  `${name ?? ""} ${firstSurname ?? ""} ${secondSurname ?? ""}`.trim();

export const getAccessorValue = (object, accessor) => {
  const accessorArr = isArray(accessor) ? accessor : [accessor];
  return accessorArr
    .reduce((acc, cv) => acc.concat(`${get(object, cv, "")} `), "")
    .trim();
};

export const getDifficultyNameInSpanish = (difficulty) => {
  switch (difficulty) {
    case "Basic":
      return "Básico";
    case "Basic-Intermediate":
      return "Básico-Intermedio";
    case "Intermediate":
      return "Intermedio";
    case "Intermediate-Advanced":
      return "Intermedio-Avanzado";
    case "Advanced":
      return "Avanzado";
    default:
      return difficulty;
  }
};
