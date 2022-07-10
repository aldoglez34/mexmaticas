import { combineReducers } from "redux";
import admin from "./admin";
import course from "./course";
import exam from "./exam";
import purchase from "./purchase";
import student from "./student";
import teacher from "./teacher";
import zenMode from "./zen";

const rootReducer = combineReducers({
  admin,
  course,
  exam,
  purchase,
  student,
  teacher,
  zenMode,
});

export default rootReducer;
