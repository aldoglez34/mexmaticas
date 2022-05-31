import React from "react";
import { node } from "prop-types";
import { NavBar, ScrollButton, StudentNav } from "../components";
import cn from "classnames";

import styles from "./studentlayout.module.scss";

export const StudentLayout = React.memo(({ children }) => {
  return (
    <>
      <NavBar />
      <div className={cn(styles.marginTop)} />
      <StudentNav />
      {children}
      <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
    </>
  );
});

StudentLayout.propTypes = {
  children: node.isRequired,
};

StudentLayout.displayName = "StudentLayout";
