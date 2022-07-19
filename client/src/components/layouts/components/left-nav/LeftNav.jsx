import React from "react";
import { array, func, string } from "prop-types";
import { Button, Nav } from "react-bootstrap";
import { firebaseAuth } from "../../../../firebase/firebase";
import { isEqual } from "lodash";
import cn from "classnames";
import { errorLogger } from "../../../../errors/errorLogger";

import styles from "./leftnav.module.scss";

export const LeftNav = React.memo(
  ({ leftBarActive, navItems, onLogoutCallback, type, userName }) => {
    const handleLogout = () =>
      firebaseAuth
        .signOut()
        .then(() => onLogoutCallback && onLogoutCallback())
        .catch((error) => errorLogger(error));

    const RedDot = () => (
      <small>
        <i
          className="fas fa-circle ml-1"
          style={{ color: "#dc3545", textAlign: "center" }}
        />
      </small>
    );

    return (
      <Nav className={cn("d-flex flex-column h-100", styles.leftnavstyle)}>
        <div
          className={cn(
            "d-flex flex-column text-center",
            styles.adminlogoContainer
          )}
        >
          <span className={styles.adminlogo}>MeXmáticas</span>
          <span className={styles.adminlogo2}>{type}</span>
        </div>
        {navItems.map(({ hasPendingMessages, icon, label, link }) => {
          const navLinkStyle = cn(
            isEqual(leftBarActive, label)
              ? styles.navLinkStyleActive
              : styles.navLinkStyle
          );
          return (
            <Nav.Link className={navLinkStyle} href={link} key={label}>
              <i
                className={icon}
                style={{ width: "26px", textAlign: "center" }}
              />
              <span className="ml-1">
                {label}
                {hasPendingMessages && <RedDot />}
              </span>
            </Nav.Link>
          );
        })}
        <div className="mt-auto">
          {userName && <p className={cn("d-block mb-1 ml-3")}>{userName}</p>}
          <Button
            variant="transparent"
            className="mb-3 text-danger text-left"
            onClick={handleLogout}
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
  }
);

LeftNav.propTypes = {
  leftBarActive: string.isRequired,
  navItems: array.isRequired,
  onLogoutCallback: func,
  type: string.isRequired,
  userName: string,
};

LeftNav.displayName = "LeftNav";
