import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromEmail } from "../../../utils/helpers";
import { Dashboard, DashboardType } from "../dashboard/Dashboard";
import { logoutTeacher } from "../../../redux/actions/teacher";

export const TeacherLayout = React.memo(
  ({
    backBttn,
    buttons,
    children,
    expanded,
    hasScrollToTopButton,
    leftBarActive,
    optionsDropdown,
    topNavTitle,
  }) => {
    const dispatch = useDispatch();

    const navItems = [
      { label: "Salones", link: "/teacher/classrooms", icon: "fas fa-users" },
      {
        label: "Exámenes",
        link: "/teacher/exams",
        icon: "fas fa-file-alt",
      },
      {
        label: "Mensajes",
        link: "/teacher/messages",
        icon: "fas fa-comments",
      },
    ];

    const teacherEmail = useSelector((state) => state.teacher?.email);

    const onLogoutCallback = () => dispatch(logoutTeacher());

    return (
      <Dashboard
        {...{
          backBttn,
          buttons,
          children,
          expanded,
          hasScrollToTopButton,
          leftBarActive,
          navItems,
          onLogoutCallback,
          optionsDropdown,
          topNavTitle,
          type: "[ MAESTRO ]",
          userName: getUserFromEmail(teacherEmail),
        }}
      >
        {children}
      </Dashboard>
    );
  }
);

TeacherLayout.propTypes = DashboardType;

TeacherLayout.displayName = "TeacherLayout";
