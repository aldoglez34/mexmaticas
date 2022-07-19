import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromEmail } from "../../../utils/helpers";
import { Dashboard, DashboardType } from "../dashboard/Dashboard";
import { logoutTeacher } from "../../../redux/actions/teacher";
import { useEffect } from "react";
import { isEmpty } from "lodash";
import { errorLogger } from "../../../errors/errorLogger";
import { fetchPendingMessages } from "../../../services";

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
    const [hasPendingMessages, setHasPendingMessages] = useState(false);

    const dispatch = useDispatch();

    const teacher = useSelector((state) => state.teacher);

    const navItems = [
      { label: "Salones", link: "/teacher/classrooms", icon: "fas fa-users" },
      {
        label: "Exámenes",
        link: "/teacher/exams",
        icon: "fas fa-file-alt",
      },
      {
        hasPendingMessages,
        icon: "fas fa-comments",
        label: "Mensajes",
        link: "/teacher/messages",
      },
    ];

    const onLogoutCallback = () => dispatch(logoutTeacher());

    useEffect(() => {
      if (!teacher?._id) return;
      fetchPendingMessages("teacher", teacher._id)
        .then((res) => {
          if (!isEmpty(res.data)) setHasPendingMessages(true);
        })
        .catch((err) => errorLogger(err));
    }, [teacher]);

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
          userName: getUserFromEmail(teacher?.email),
        }}
      >
        {children}
      </Dashboard>
    );
  }
);

TeacherLayout.propTypes = DashboardType;

TeacherLayout.displayName = "TeacherLayout";
