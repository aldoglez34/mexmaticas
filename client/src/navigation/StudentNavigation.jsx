import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import {
  CourseInfoPage,
  CoursePage,
  DashboardPage,
  ExamPage,
  FreestylePage,
  MessagesPage,
  NoMatchPage,
  PaymentPage,
  ResultsPage,
} from "../pages";

export default () => {
  return (
    <Switch>
      {/* ================= PUBLIC ROUTES ================= */}
      {/* student dashboard */}
      <Route exact path="/dashboard" component={DashboardPage} />

      {/* courses info */}
      <Route
        exact
        path="/courses/:school"
        render={(props) => <CourseInfoPage routeProps={props} />}
      />

      {/* payment */}
      <Route
        exact
        path="/payment/:school/:courseId"
        render={(props) => <PaymentPage routeProps={props} />}
      />

      {/* ================= STUDENT ROUTES ================= */}
      {/* messages */}
      <Route exact path="/messages" component={MessagesPage} />

      {/* courses main */}
      <Route
        exact
        path="/course"
        render={(props) => <CoursePage routeProps={props} />}
      />

      {/* exam */}
      <Route exact path="/course/exam" component={ExamPage} />
      <Route exact path="/course/exam/results" component={ResultsPage} />

      {/* freestyle */}
      <Route exact path="/course/freestyle" component={FreestylePage} />

      {/* <Redirect from="/signup" to="/dashboard" /> */}
      <Redirect from="/" to="/dashboard" />

      {/* 404 not found */}
      <Route component={NoMatchPage} />
    </Switch>
  );
};
