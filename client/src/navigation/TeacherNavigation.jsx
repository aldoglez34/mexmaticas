import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import {
  TeacherClassroomDetail,
  TeacherClassroomsPage,
  TeacherMessagesPage,
} from "../teacher-pages";

export const TeacherNavigation = () => (
  <BrowserRouter>
    <Switch>
      {/* ================= classrooms ================= */}
      <Route
        exact
        path="/teacher/classrooms"
        component={TeacherClassroomsPage}
      />
      <Route
        exact
        path="/teacher/classrooms/:classroomId"
        render={(props) => <TeacherClassroomDetail routeProps={props} />}
      />
      {/* ================= messages ================= */}
      <Route exact path="/teacher/messages" component={TeacherMessagesPage} />
      {/* ================= redirect to teacher navigation ================= */}
      <Redirect from="*" to="/teacher/classrooms" />
    </Switch>
  </BrowserRouter>
);
