import React from "react";
import { string, array } from "prop-types";
import { Button, Nav } from "react-bootstrap";
import { firebaseAuth } from "../../../../firebase/firebase";
import { isEqual } from "lodash";
import cn from "classnames";

import styles from "./leftnav.module.scss";

export const LeftNav = React.memo(({ leftBarActive, navItems, type }) => {
  const handleLogout = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        alert("Hasta pronto.");
      })
      .catch((error) => console.log(error));
  };

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
      {navItems.map(({ label, link, icon }) => {
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
            <span className="ml-1">{label}</span>
          </Nav.Link>
        );
      })}
      <div className="mt-auto">
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
});

LeftNav.propTypes = {
  leftBarActive: string.isRequired,
  navItems: array.isRequired,
  type: string.isRequired,
};

LeftNav.displayName = "LeftNav";
