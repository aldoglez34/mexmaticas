import React from "react";
import { Button, Nav } from "react-bootstrap";
import { firebaseAuth } from "../../../../firebase/firebase";
import "./leftnav.scss";

export const LeftNav = React.memo(({ leftBarActive }) => {
  const logout = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        alert("Hasta pronto.");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Nav className="d-flex flex-column h-100" id="leftnavstyle">
      {/* logo */}
      <div className="d-flex flex-column text-center" id="adminlogoContainer">
        <span id="adminlogo">MeXmáticas</span>
        <span id="adminlogo2">[ admin ]</span>
      </div>
      {/* menu */}
      <Nav.Link
        className="navLinkStyle"
        href="/admin/courses"
        active={leftBarActive === "Cursos" ? true : false}
      >
        <i
          className="fas fa-graduation-cap"
          style={{ width: "26px", textAlign: "center" }}
        />
        <span className="ml-1">Cursos</span>
      </Nav.Link>
      <Nav.Link
        className="navLinkStyle"
        href="/admin/students"
        active={leftBarActive === "Alumnos" ? true : false}
      >
        <i
          className="fas fa-user-graduate"
          style={{ width: "26px", textAlign: "center" }}
        />
        <span className="ml-1">Alumnos</span>
      </Nav.Link>
      <Nav.Link
        className="navLinkStyle"
        href="/admin/messages"
        active={leftBarActive === "Mensajes" ? true : false}
      >
        <i
          className="fas fa-envelope-open-text"
          style={{ width: "26px", textAlign: "center" }}
        />
        <span className="ml-1">Mensajes</span>
      </Nav.Link>
      <div className="mt-auto">
        <Button
          variant="transparent"
          className="mb-3 text-danger text-left"
          onClick={logout}
          style={{ boxShadow: "none" }}
        >
          <i
            className="fas fa-arrow-circle-left"
            style={{ width: "26px", textAlign: "center" }}
          />
          <strong className="ml-1">Salir</strong>
        </Button>
      </div>
    </Nav>
  );
});
