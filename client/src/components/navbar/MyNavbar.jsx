import React from "react";
import { Navbar, Nav, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { CoursesDropdown, StudentDropdown } from "./components";
import { APP_VERSION } from "../../constants/constants";
import cn from "classnames";

import styles from "./navbar.module.scss";

export const MyNavbar = () => {
  const student = useSelector((state) => state.student);
  const zenMode = useSelector((state) => state.zenMode);

  const Logo = () => {
    return zenMode ? (
      <h2 className={cn("mb-0", styles.logo, styles.zen)}>
        <s>MeXmáticas</s>
        <small className={styles.beta}>{APP_VERSION}</small>
      </h2>
    ) : (
      <h2
        className={cn("mb-0", styles.logo)}
        onClick={() => (window.location.href = "/")}
      >
        MeXmáticas<small className={styles.beta}>{APP_VERSION}</small>
      </h2>
    );
  };

  return (
    <Navbar
      className={cn("py-2", "shadow", styles.container)}
      collapseOnSelect
      expand="lg"
      fixed="top"
      variant="dark"
    >
      <Navbar.Brand className="d-block d-lg-none">
        <Logo />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Container className="px-0 px-lg-3">
          {/* LEFT NAV */}
          <Nav as={Col} className="d-none d-lg-block pr-0">
            <div className="d-flex flex-row">
              <CoursesDropdown />
            </div>
          </Nav>
          {/* MIDDLE NAV */}
          <Nav as={Col} className="d-none d-lg-block text-center pr-0">
            <Navbar.Brand>
              <Logo />
            </Navbar.Brand>
          </Nav>
          {/* RIGHT NAV */}
          <Nav
            as={Col}
            className="justify-content-end align-items-lg-end mt-2 mt-lg-0 pr-0"
          >
            {student ? (
              <>
                {/* small */}
                <div className="d-block d-lg-none">
                  <h6
                    className="dropdown-header px-0 pb-0"
                    style={{ color: "#3d4d53" }}
                  >
                    CURSOS
                  </h6>
                  <CoursesDropdown />
                  <h6
                    className="dropdown-header px-0 pb-0"
                    style={{ color: "#3d4d53" }}
                  >
                    MI USUARIO
                  </h6>
                  <StudentDropdown unseenMessages={student.unseenMessages} />
                </div>
                <div className="d-none d-lg-block">
                  <StudentDropdown unseenMessages={student.unseenMessages} />
                </div>
              </>
            ) : (
              <>
                <Nav.Link
                  className={cn("mr-lg-4", styles.navbarItem)}
                  href="/login"
                >
                  Inicia Sesión
                </Nav.Link>
                <Nav.Link className={styles.navbarItem} href="/signup">
                  Regístrate
                </Nav.Link>
                <Nav className="d-block d-lg-none">
                  <CoursesDropdown />
                </Nav>
              </>
            )}
          </Nav>
        </Container>
      </Navbar.Collapse>
    </Navbar>
  );
};
