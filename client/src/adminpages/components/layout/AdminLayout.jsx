import React from "react";
import { array, node, string } from "prop-types";
import { LeftNav, TopNav } from "./components";
import { ScrollButton } from "../../../components";

export const AdminLayout = React.memo(
  ({ backBttn, buttons, children, leftBarActive, optionsDropdown }) => {
    return (
      <div className="d-flex h-100">
        {/* vertical navbar */}
        <LeftNav leftBarActive={leftBarActive} />
        {/* main container */}
        <div style={{ marginLeft: "15rem" }} className="h-100 w-100">
          {/* top nav */}
          <TopNav
            buttons={buttons}
            backBttn={backBttn}
            optionsDropdown={optionsDropdown}
          />
          {/* content */}
          <div
            style={{
              padding: "35px 28px",
            }}
          >
            {children}
          </div>
        </div>
        <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
      </div>
    );
  }
);

AdminLayout.propTypes = {
  backBttn: string,
  buttons: node,
  children: node.isRequired,
  leftBarActive: string.isRequired,
  optionsDropdown: array,
};

AdminLayout.displayName = "AdminLayout";
