import React, { memo } from "react";
import { Button } from "./Button";
import { bool, func, oneOf, string } from "prop-types";
import { isEqual } from "lodash";
import cn from "classnames";

import styles from "./iconbutton.module.scss";

export const IconButton = memo(
  ({ className, hoverText, href, isDisabled = false, onClick, svg }) => {
    const getSvg = (svg) => {
      if (!svg) return;
      switch (svg) {
        case "anchor":
          return <i className="fas fa-paper-plane" />;
        case "edit":
          return <i className="fas fa-pen-alt" />;
        case "delete":
          return <i className="fas fa-times" />;
        case "add":
          return <i className="fas fa-plus-circle" />;
        default:
          return null;
      }
    };

    const getClassName = () => {
      if (isEqual(svg, "delete")) return styles.deleteButton;
      return styles.button;
    };

    return (
      <Button
        {...{
          className: cn(getClassName(), className),
          hasShadow: false,
          isDisabled,
          ...(hoverText && { hoverText }),
          ...(href && { onClick: () => (window.location.href = href) }),
          ...(onClick && { onClick }),
        }}
      >
        {getSvg(svg)}
      </Button>
    );
  }
);

IconButton.propTypes = {
  className: string,
  hoverText: string,
  href: string,
  isDisabled: bool,
  onClick: func,
  svg: oneOf(["add", "anchor", "delete", "edit"]),
};

IconButton.displayName = "IconButton";
