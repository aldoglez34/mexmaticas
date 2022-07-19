import React, { memo } from "react";
import { isEmpty } from "lodash";
import { NavDropdown } from "react-bootstrap";
import { array, bool } from "prop-types";

import styles from "./navbar.module.scss";

export const CoursesDropdown = memo(({ availableCourses, isZen }) => (
  <NavDropdown
    className={styles.navDropdownToggle}
    disabled={isZen}
    title={
      <span id="navDropdownText" className="px-0">
        {isZen ? <s>Cursos</s> : <span>Cursos</span>}
        <i className="fas fa-chevron-down ml-1" style={{ fontSize: "13px" }} />
      </span>
    }
  >
    {!isEmpty(availableCourses) &&
      availableCourses.map((c) => (
        <NavDropdown.Item
          className="dropdownItem"
          href={`/courses/${c}`}
          key={c}
        >
          {c}
        </NavDropdown.Item>
      ))}
  </NavDropdown>
));

CoursesDropdown.propTypes = {
  availableCourses: array,
  isZen: bool,
};

CoursesDropdown.displayName = "CoursesDropdown";
