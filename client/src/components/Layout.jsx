import React from "react";
import { node, string } from "prop-types";
import { MyFooter, MyNavbar, ScrollButton, StudentNav } from "./";
import "./layout.scss";

// for public routes
export const Layout = React.memo(({ children, backgroundColor = "white" }) => {
  return (
    <>
      <MyNavbar />
      <div
        className="d-flex flex-column marginTop h-100"
        style={{ backgroundColor }}
      >
        {children}
        <MyFooter />
      </div>
    </>
  );
});

Layout.propTypes = {
  children: node.isRequired,
  backgroundColor: string,
};

// for protected routes
export const StudentLayout = React.memo(({ children }) => {
  return (
    <>
      <MyNavbar />
      <div className="marginTop" />
      <StudentNav />
      {children}
      <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
    </>
  );
});

StudentLayout.propTypes = {
  children: node.isRequired,
};

Layout.displayName = "Layout";
StudentLayout.displayName = "StudentLayout";
