import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { TeacherClassroomsPage } from "../teacher-pages";

export const TeacherNavigation = () => (
  <BrowserRouter>
    <Switch>
      {/* ================= redirect ================= */}
      <Route
        exact
        path="/teacher/classrooms"
        component={TeacherClassroomsPage}
      />
      {/* ================= redirect to teacher navigation ================= */}
      <Redirect from="*" to="/teacher/classrooms" />
    </Switch>
  </BrowserRouter>
);
