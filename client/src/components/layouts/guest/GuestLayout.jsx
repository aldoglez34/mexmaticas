import React from "react";
import { bool, node, string } from "prop-types";
import { Footer, NavBar, ScrollButton } from "../components";
import cn from "classnames";

import styles from "./guestlayout.module.scss";

export const GuestLayout = React.memo(
  ({ children, backgroundColor = "white", showScrollButton = false }) => {
    return (
      <>
        <NavBar />
        <div
          className={cn("d-flex flex-column h-100", styles.marginTop)}
          style={{ backgroundColor }}
        >
          {children}
          <Footer />
        </div>
        {showScrollButton ? (
          <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
        ) : null}
      </>
    );
  }
);

GuestLayout.propTypes = {
  backgroundColor: string,
  children: node.isRequired,
  showScrollButton: bool,
};

GuestLayout.displayName = "GuestLayout";
