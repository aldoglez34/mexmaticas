import { combineReducers } from "redux";
import admin from "./admin";
import course from "./course";
import exam from "./exam";
import purchase from "./purchase";
import student from "./student";
import teacher from "./teacher";

const rootReducer = combineReducers({
  admin,
  course,
  exam,
  purchase,
  student,
  teacher,
});

export default rootReducer;
