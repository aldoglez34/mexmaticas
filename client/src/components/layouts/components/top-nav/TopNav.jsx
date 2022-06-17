import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { array, node, string } from "prop-types";
import { useSelector } from "react-redux";
import cn from "classnames";

import styles from "./topnav.module.scss";

export const TopNav = React.memo(({ backBttn, buttons, optionsDropdown }) => {
  const title = useSelector((state) => state.admin?.title);

  return (
    <div style={{ backgroundColor: "#0f5257" }}>
      <div style={{ padding: "0px 39px" }}>
        <div className="d-flex align-items-center" style={{ height: "63px" }}>
          {/* back button */}
          {backBttn ? (
            <Button
              variant="transparent"
              className="p-0 text-light"
              href={backBttn}
              style={{ boxShadow: "none" }}
            >
              <i className="fas fa-chevron-left mr-1" />
              Atrás
            </Button>
          ) : null}
          {/* options dropdown */}
          {optionsDropdown?.length && (
            <Dropdown className={cn("ml-auto")}>
              <Dropdown.Toggle
                variant="transparent"
                className={cn(
                  styles.optionsDropdown,
                  "bg-transparent",
                  "p-0",
                  "text-light",
                  "border-0"
                )}
              >
                <i className="fas fa-ellipsis-h text-light" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {optionsDropdown.map((o) => (
                  <Dropdown.Item
                    key={o.text}
                    className="dropdownStyle"
                    onClick={() => o.fn()}
                  >
                    {o.text}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div
          className="d-flex align-items-center"
          style={{
            paddingBottom: "20px",
          }}
        >
          {/* title */}
          <div>
            <h2 className="mb-0 text-light">
              {String(title).toLocaleUpperCase()}
            </h2>
          </div>
        </div>
        {buttons ? (
          <div
            className="d-flex flex-row align-items-center"
            style={{
              paddingBottom: "15px",
            }}
          >
            {buttons}
          </div>
        ) : null}
      </div>
    </div>
  );
});

TopNav.propTypes = {
  backBttn: string,
  buttons: node,
  optionsDropdown: array,
};

TopNav.displayName = "TopNav";
