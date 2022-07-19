import React, { useEffect, useState } from "react";
import { errorLogger } from "../../../errors/errorLogger";
import { fetchPendingMessages } from "../../../services";
import { Dashboard, DashboardType } from "../dashboard/Dashboard";

export const AdminLayout = React.memo(
  ({
    backBttn,
    buttons,
    children,
    expanded,
    hasScrollToTopButton,
    leftBarActive,
    optionsDropdown,
    topNavTitle,
    userName,
  }) => {
    const [hasPendingMessages, setHasPendingMessages] = useState(false);

    const navItems = [
      {
        label: "Alumnos",
        link: "/admin/students",
        icon: "fas fa-user-graduate",
      },
      { label: "Cursos", link: "/admin/courses", icon: "fa fa-terminal" },
      { label: "Escuelas", link: "/admin/institutions", icon: "fas fa-school" },
      {
        label: "Maestros",
        link: "/admin/teachers",
        icon: "fas fa-user-tie",
      },
      {
        hasPendingMessages,
        icon: "fas fa-comments",
        label: "Mensajes",
        link: "/admin/messages",
      },
      { label: "Salones", link: "/admin/classrooms", icon: "fas fa-users" },
    ];

    useEffect(() => {
      fetchPendingMessages("admin", "admin")
        .then((res) => {
          if (res.data.some((conv) => !conv.isSeenByAdmin))
            setHasPendingMessages(true);
        })
        .catch((err) => errorLogger(err));
    }, []);

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
          optionsDropdown,
          topNavTitle,
          type: "[ ADMIN ]",
          userName,
        }}
      >
        {children}
      </Dashboard>
    );
  }
);

AdminLayout.propTypes = DashboardType;

AdminLayout.displayName = "AdminLayout";
