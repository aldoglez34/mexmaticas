import React, { memo } from "react";
import { Col, Container, Nav, Navbar } from "react-bootstrap";
import { CoursesDropdown, StudentDropdown } from "./components";
import { array, bool, object } from "prop-types";
import cn from "classnames";

import styles from "./navbar.module.scss";

export const NavBar = memo(
  ({ availableCourses, hasPendingMessages, isZen, student }) => {
    const Logo = () => (
      <a
        {...{
          className: cn(styles.logo, isZen && styles.zen),
          href: "/",
        }}
      >
        {!isZen && "MeXmáticas"}
        {isZen && <s>MeXmáticas</s>}
      </a>
    );

    const SmallScreenDiv = () => {
      const Header = ({ text }) => (
        <h6 className="dropdown-header px-0 pb-0" style={{ color: "#3d4d53" }}>
          {text}
        </h6>
      );

      return (
        <div className="d-block d-lg-none">
          <Header text="CURSOS" />
          <CoursesDropdown {...{ availableCourses, isZen }} />
          <Header text="MI USUARIO" />
          <StudentDropdown {...{ hasPendingMessages, isZen, student }} />
        </div>
      );
    };

    const LargeScreenDiv = () => (
      <div className="d-none d-lg-block">
        <StudentDropdown {...{ hasPendingMessages, isZen, student }} />
      </div>
    );

    return (
      <Navbar
        className={cn("shadow", styles.container)}
        collapseOnSelect
        expand="lg"
        fixed="top"
        variant="dark"
      >
        <Navbar.Brand className="d-block d-lg-none">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Container className="px-0 px-lg-3">
            <Nav as={Col} className="d-none d-lg-block pr-0">
              <CoursesDropdown {...{ availableCourses, isZen }} />
            </Nav>
            <Nav as={Col} className="d-none d-lg-block text-center pr-0">
              <Navbar.Brand>
                <Logo />
              </Navbar.Brand>
            </Nav>
            <Nav
              as={Col}
              className="justify-content-end align-items-lg-end mt-2 mt-lg-0 pr-0"
            >
              {student && (
                <>
                  <SmallScreenDiv />
                  <LargeScreenDiv />
                </>
              )}
              {!student && (
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
                    <CoursesDropdown {...{ availableCourses, isZen }} />
                  </Nav>
                </>
              )}
            </Nav>
          </Container>
        </Navbar.Collapse>
      </Navbar>
    );
  }
);

NavBar.propTypes = {
  availableCourses: array,
  hasPendingMessages: bool,
  isZen: bool,
  student: object,
};

NavBar.displayName = "NavBar";
