import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { TeacherLoginPage } from "../teacherpages";

export const TeacherNavigation = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/teacher" component={TeacherLoginPage} />
    </Switch>
  </BrowserRouter>
);
