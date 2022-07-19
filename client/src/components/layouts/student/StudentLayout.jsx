import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { bool, node } from "prop-types";
import { Footer, NavBar, ScrollButton, StudentNav } from "../components";
import { Container } from "react-bootstrap";
import cn from "classnames";
import {
  fetchPendingMessages,
  fetchSchoolDropdownItems,
} from "../../../services";
import { errorLogger } from "../../../errors/errorLogger";
import { isEmpty } from "lodash";

import styles from "./studentlayout.module.scss";

export const StudentLayout = memo(
  ({
    children,
    expanded = false,
    hasScrollButton = false,
    isContainer = true,
    isZen = false,
  }) => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const [hasPendingMessages, setHasPendingMessages] = useState(false);

    const student = useSelector((state) => state.student);

    useEffect(() => {
      try {
        if (student) {
          fetchPendingMessages("student", student._id).then((res) => {
            if (!isEmpty(res.data)) setHasPendingMessages(true);
          });
        }

        if (isEmpty(availableCourses)) {
          fetchSchoolDropdownItems().then((res) =>
            setAvailableCourses(res.data)
          );
        }
      } catch (err) {
        errorLogger(err);
      }
    }, [availableCourses, student]);

    return (
      <>
        <NavBar {...{ availableCourses, hasPendingMessages, isZen, student }} />
        {student && <StudentNav {...{ student }} />}
        {isContainer && (
          <Container fluid={expanded} className={cn(expanded ? "p-0" : "py-4")}>
            {children}
          </Container>
        )}
        {!isContainer && (
          <div
            className={cn("d-flex flex-column h-100", styles.marginTop)}
            // style={{ backgroundColor }}
          >
            {children}
            <Footer />
          </div>
        )}
        {hasScrollButton && (
          <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
        )}
      </>
    );
  }
);

StudentLayout.propTypes = {
  children: node.isRequired,
  expanded: bool,
  hasScrollButton: bool,
  isZen: bool,
};

StudentLayout.displayName = "StudentLayout";
