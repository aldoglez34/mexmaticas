import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import cn from "classnames";

import styles from "./studentnav.module.scss";

export const StudentNav = () => {
  const student = useSelector((state) => state.student);

  return (
    <div className={cn(styles.studentNav)}>
      <Container>
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h2 className="mb-1 text-white">
              {student ? student.email.split("@", 1)[0] : null}
            </h2>
            <span className="text-light">
              <i className="fas fa-user mr-2" />
              {student ? student.name + " " + student.firstSurname : null}
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};
