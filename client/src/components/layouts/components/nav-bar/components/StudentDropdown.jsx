import React, { memo } from "react";
import { NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as studentActions from "../../../../../redux/actions/student";
import { firebaseAuth } from "../../../../../firebase/firebase";
import { errorLogger } from "../../../../../errors/errorLogger";
import { bool, object } from "prop-types";

import styles from "./navbar.module.scss";

export const StudentDropdown = memo(
  ({ hasPendingMessages, isZen, student }) => {
    const dispatch = useDispatch();

    const logout = () => {
      firebaseAuth
        .signOut()
        .then(() => dispatch(studentActions.logoutStudent()))
        .catch((err) => errorLogger(err));
    };

    const getStudentEmail = () => {
      if (!student) return null;
      if (isZen) return <s>{student.email}</s>;
      return <span>{student.email}</span>;
    };

    const RedDot = () => (
      <small>
        <i
          className="fas fa-circle ml-1"
          style={{ color: "#dc3545", textAlign: "center" }}
        />
      </small>
    );

    return (
      <NavDropdown
        alignRight
        className={styles.navDropdownToggle}
        disabled={isZen}
        title={
          <span className={styles.navDropdownText}>
            {getStudentEmail()}
            <i
              className="fas fa-chevron-down ml-1"
              style={{ fontSize: "13px" }}
            />
          </span>
        }
      >
        <NavDropdown.Item href="/dashboard" className="dropdownItem">
          Mis cursos
        </NavDropdown.Item>
        <NavDropdown.Item href="/messages" className="dropdownItem">
          Mis mensajes{hasPendingMessages && <RedDot />}
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={logout} className="dropdownItem">
          Cerrar sesión
        </NavDropdown.Item>
      </NavDropdown>
    );
  }
);

StudentDropdown.propTypes = {
  hasPendingMessages: bool,
  isZen: bool,
  student: object,
};

StudentDropdown.displayName = "StudentDropdown";
