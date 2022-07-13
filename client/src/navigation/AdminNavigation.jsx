import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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
  AdminNewTeacher,
  AdminNewTopicPage,
  AdminStudentAssignPage,
  AdminStudentDetailPage,
  AdminStudentHistoryPage,
  AdminStudentsPage,
  AdminTeacherDetailPage,
  AdminTeachersPage,
  AdminTopicDetailPage,
} from "../admin-pages";

export const AdminNavigation = () => (
  <BrowserRouter>
    <Switch>
      {/* ================= students ================= */}
      <Route exact path="/admin/students" component={AdminStudentsPage} />
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
      <Route
        path="/admin/students/:studentId"
        render={(props) => <AdminStudentDetailPage routeProps={props} />}
      />
      {/* ================= courses ================= */}
      <Route exact path="/admin/courses" component={AdminCoursesPage} />
      <Route
        exact
        path="/admin/courses/edit/:courseId"
        render={(props) => <AdminCourseDetailPage routeProps={props} />}
      />
      <Route exact path="/admin/courses/new" component={AdminNewCoursePage} />
      {/* ================= institutions ================= */}
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
      {/* ================= teachers ================= */}
      <Route exact path="/admin/teachers" component={AdminTeachersPage} />
      <Route exact path="/admin/teachers/new" component={AdminNewTeacher} />
      <Route
        exact
        path="/admin/teachers/edit/:teacherId"
        render={(props) => <AdminTeacherDetailPage routeProps={props} />}
      />
      {/* ================= messages ================= */}
      <Route exact path="/admin/messages" component={AdminMessagesPage} />
      {/* ================= classrooms ================= */}
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
      {/* ================= topics ================= */}
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
      {/* ================= exam ================= */}
      <Route
        exact
        path="/admin/courses/edit/exam/:courseId/:topicId/:examId"
        render={(props) => <AdminExamDetailPage routeProps={props} />}
      />
      {/* ================= messages ================= */}
      <Route exact path="/admin/messages" component={AdminMessagesPage} />
      {/* ================= redirect to admin navigation ================= */}
      <Redirect from="*" to="/admin/students" />
    </Switch>
  </BrowserRouter>
);
