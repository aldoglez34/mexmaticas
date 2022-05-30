import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { AdminLoginPage } from "../adminpages";
import { TeacherLoginPage } from "../teacherpages";
import {
  CourseInfoPage,
  LandingPage,
  LoginPage,
  NoMatchPage,
  SignUpPage,
} from "../pages";

export const GuestNavigation = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route
        exact
        path="/courses/:school"
        render={(props) => <CourseInfoPage routeProps={props} />}
      />
      <Redirect from="/dashboard" to="/" />
      <Redirect from="/course" to="/" />
      {/* ================= admin login only ================= */}
      <Route exact path="/admin" component={AdminLoginPage} />
      <Redirect from="/admin/*" to="/admin" />
      {/* ================= teacher login only ================= */}
      <Route exact path="/teacher" component={TeacherLoginPage} />
      <Redirect from="/teacher/*" to="/teacher" />
      {/* ================= 404 ================= */}
      <Route component={NoMatchPage} />;
    </Switch>
  </BrowserRouter>
);
