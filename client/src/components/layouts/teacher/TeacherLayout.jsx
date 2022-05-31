import React from "react";
import { array, node, string } from "prop-types";
import { LeftNav, ScrollButton, TopNav } from "../components";

export const TeacherLayout = React.memo(
  ({ backBttn, buttons, children, leftBarActive, optionsDropdown }) => {
    const navItems = [
      {
        label: "Alumnos",
        link: "/teachers/students",
        icon: "fas fa-user-graduate",
      },
      {
        label: "Mensajes",
        link: "/teachers/messages",
        icon: "fas fa-envelope",
      },
      { label: "Salones", link: "/teachers/classrooms", icon: "fas fa-users" },
    ];

    return (
      <div className="d-flex h-100">
        <LeftNav {...{ leftBarActive, navItems, type: "[ MAESTRO ]" }} />
        <div style={{ marginLeft: "15rem" }} className="h-100 w-100">
          <TopNav
            buttons={buttons}
            backBttn={backBttn}
            optionsDropdown={optionsDropdown}
          />
          <div style={{ padding: "35px 28px" }}>{children}</div>
        </div>
        <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
      </div>
    );
  }
);

TeacherLayout.propTypes = {
  backBttn: string,
  buttons: node,
  children: node.isRequired,
  leftBarActive: string.isRequired,
  optionsDropdown: array,
};

TeacherLayout.displayName = "TeacherLayout";
