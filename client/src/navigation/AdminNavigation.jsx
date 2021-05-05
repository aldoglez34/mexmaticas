import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  AdminCourseDetailPage,
  AdminCoursesPage,
  AdminExamDetailPage,
  AdminMessagesPage,
  AdminNewCoursePage,
  AdminNewTopicPage,
  AdminStudentAssignPage,
  AdminStudentDetailPage,
  AdminStudentHistoryPage,
  AdminStudentsPage,
  AdminTopicDetailPage,
} from "../adminpages";

export default () => {
  return (
    <Switch>
      {/* ================= COURSES ================= */}
      <Route exact path="/admin/courses" component={AdminCoursesPage} />
      <Route
        exact
        path="/admin/courses/edit/:courseId"
        render={(props) => <AdminCourseDetailPage routeProps={props} />}
      />
      <Route exact path="/admin/courses/new" component={AdminNewCoursePage} />

      {/* ================= TOPICS ================= */}
      <Route
        exact
        path="/admin/courses/edit/topics/:courseId/:topicId"
        render={(props) => <AdminTopicDetailPage routeProps={props} />}
      />
      <Route
        exact
        path="/admin/courses/courses/newTopic/:courseId"
        render={(props) => <AdminNewTopicPage routeProps={props} />}
      />

      {/* ================= EXAM ================= */}
      <Route
        exact
        path="/admin/courses/edit/exam/:courseId/:topicId/:examId"
        render={(props) => <AdminExamDetailPage routeProps={props} />}
      />

      {/* ================= STUDENTS ================= */}
      <Route exact path="/admin/students" component={AdminStudentsPage} />
      <Route
        exact
        path="/admin/students/:studentId"
        render={(props) => <AdminStudentDetailPage routeProps={props} />}
      />
      <Route
        exact
        path="/admin/students/unpurchased/:studentId"
        render={(props) => <AdminStudentAssignPage routeProps={props} />}
      />
      <Route
        exact
        path="/admin/students/history/:studentId"
        render={(props) => <AdminStudentHistoryPage routeProps={props} />}
      />

      {/* ================= MESSAGES ================= */}
      <Route exact path="/admin/messages" component={AdminMessagesPage} />

      {/* ================= REDIRECT ================= */}
      {/* <Redirect from="/admin" to="/admin/courses" />
      <Redirect from="/" to="/admin/courses" /> */}
      <Redirect from="*" to="/admin/courses" />

      {/* 404 not found */}
      {/* <Route component={AdminCourses} /> */}
    </Switch>
  );
};
