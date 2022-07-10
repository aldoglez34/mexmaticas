import React from "react";
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
      { label: "Mensajes", link: "/admin/messages", icon: "fas fa-comments" },
      { label: "Salones", link: "/admin/classrooms", icon: "fas fa-users" },
    ];

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
