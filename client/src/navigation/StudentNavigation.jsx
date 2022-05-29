import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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

export const StudentNavigation = () => (
  <BrowserRouter>
    <Switch>
      {/* ================= public ================= */}
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route
        exact
        path="/courses/:school"
        render={(props) => <CourseInfoPage routeProps={props} />}
      />
      <Route
        exact
        path="/payment/:school/:courseId"
        render={(props) => <PaymentPage routeProps={props} />}
      />
      {/* ================= student ================= */}
      <Route exact path="/messages" component={MessagesPage} />
      <Route
        exact
        path="/course"
        render={(props) => <CoursePage routeProps={props} />}
      />
      <Route exact path="/course/exam" component={ExamPage} />
      <Route exact path="/course/exam/results" component={ResultsPage} />
      <Route exact path="/course/freestyle" component={FreestylePage} />
      <Redirect from="/" to="/dashboard" />
      {/* ================= 404 ================= */}
      <Route component={NoMatchPage} />
    </Switch>
  </BrowserRouter>
);
