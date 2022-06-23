import React, { memo } from "react";
import { Button } from "./Button";
import { any, bool, func, oneOf, string } from "prop-types";
import cn from "classnames";

import styles from "./iconbutton.module.scss";

export const IconButton = memo(
  ({
    className = "",
    hoverText,
    href,
    icon,
    isDisabled = false,
    onClick,
    text,
  }) => {
    return (
      <Button
        {...{
          className: cn(styles.button, className),
          hasShadow: false,
          isDisabled,
          ...(hoverText ? { hoverText } : {}),
          ...(href ? { onClick: () => (window.location.href = href) } : {}),
          ...(onClick ? { onClick: () => onClick() } : {}),
        }}
      >
        {icon}
        {text}
      </Button>
    );
  }
);

IconButton.propTypes = {
  children: any,
  className: string,
  hoverText: string,
  href: string,
  icon: any,
  isDisabled: bool,
  onClick: func,
  size: oneOf(["sm", "md", "lg"]),
};

IconButton.displayName = "IconButton";
