import React from "react";
import { array, bool, node, string } from "prop-types";
import { LeftNav, ScrollButton, TopNav } from "../components";
import { Container, Row, Col } from "react-bootstrap";

export const AdminLayout = React.memo(
  ({
    backBttn,
    buttons,
    children,
    expanded = false,
    leftBarActive,
    optionsDropdown,
    topNavTitle,
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
        icon: "fas fa-graduation-cap",
      },
      { label: "Mensajes", link: "/admin/messages", icon: "fas fa-envelope" },
      { label: "Salones", link: "/admin/classrooms", icon: "fas fa-users" },
    ];

    return (
      <div className="d-flex h-100">
        <LeftNav {...{ leftBarActive, navItems, type: "[ ADMIN ]" }} />
        <div style={{ marginLeft: "15rem" }} className="h-100 w-100">
          <TopNav
            backBttn={backBttn}
            buttons={buttons}
            optionsDropdown={optionsDropdown}
            topNavTitle={topNavTitle ?? ""}
          />
          <div style={{ padding: "35px 28px" }}>
            <Container fluid>
              {expanded ? (
                children
              ) : (
                <Row>
                  <Col md={{ offset: 2, span: 8 }}>{children}</Col>
                </Row>
              )}
            </Container>
          </div>
        </div>
        <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
      </div>
    );
  }
);

AdminLayout.propTypes = {
  backBttn: string,
  buttons: node,
  children: node.isRequired,
  expanded: bool,
  leftBarActive: string.isRequired,
  optionsDropdown: array,
  topNavTitle: string,
};

AdminLayout.displayName = "AdminLayout";
