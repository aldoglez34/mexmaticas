import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  AdminClassroomDetailPage,
  AdminClassroomsPage,
  AdminCourseDetailPage,
  AdminCoursesPage,
  AdminExamDetailPage,
  AdminInstitutionDetailPage,
  AdminInstitutionsPage,
  AdminMessagesPage,
  AdminNewClassroomPage,
  AdminNewCoursePage,
  AdminNewInstitutionPage,
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
      {/* ================= CLASSROOMS ================= */}
      <Route exact path="/admin/classrooms" component={AdminClassroomsPage} />
      <Route
        exact
        path="/admin/classrooms/edit/:classroomId"
        render={(props) => <AdminClassroomDetailPage routeProps={props} />}
      />
      <Route
        exact
        path="/admin/classrooms/new"
        component={AdminNewClassroomPage}
      />

      {/* ================= INSTITUTIONS ================= */}
      <Route
        exact
        path="/admin/institutions"
        component={AdminInstitutionsPage}
      />
      <Route
        exact
        path="/admin/institutions/edit/:institutionId"
        render={(props) => <AdminInstitutionDetailPage routeProps={props} />}
      />
      <Route
        exact
        path="/admin/institutions/new"
        component={AdminNewInstitutionPage}
      />

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
