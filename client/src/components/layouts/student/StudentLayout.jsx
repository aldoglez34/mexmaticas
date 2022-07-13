import React, { memo } from "react";
import { node } from "prop-types";
import { NavBar, ScrollButton, StudentNav } from "../components";
import { Container } from "react-bootstrap";
import cn from "classnames";

import styles from "./studentlayout.module.scss";

export const StudentLayout = memo(
  ({ children, expanded = false, hasScrollButton = false }) => (
    <>
      <NavBar />
      <div className={styles.marginTop} />
      <StudentNav />
      <Container fluid={expanded} className={cn(expanded ? "p-0" : "py-4")}>
        {children}
      </Container>
      {hasScrollButton && (
        <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
      )}
    </>
  )
);

StudentLayout.propTypes = {
  children: node.isRequired,
};

StudentLayout.displayName = "StudentLayout";
