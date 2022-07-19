import React, { memo } from "react";
import { Button as BootstrapButton, Spinner } from "react-bootstrap";
import { any, bool, func, oneOf, string } from "prop-types";
import cn from "classnames";

import styles from "./button.module.scss";

export const Button = memo(
  ({
    children,
    className = "",
    hasShadow = true,
    hoverText,
    isActive = false,
    isAnchor = false,
    isBlock = false,
    isDisabled = false,
    isLoading = false,
    isSubmit = false,
    onClick,
    size = "md",
    variant = "dark",
  }) => {
    const getClassName = () => {
      if (isAnchor) {
        if (!isActive) return cn(styles.anchor, className);
        if (isActive) return cn(styles.activeAnchor, className);
      }
      return cn(className, { shadow: hasShadow });
    };

    return (
      <BootstrapButton
        {...{
          block: isBlock,
          className: getClassName(),
          disabled: isDisabled,
          size,
          variant,
          ...(hoverText && { title: hoverText }),
          ...(isSubmit && { type: "submit" }),
          ...(onClick && { onClick: onClick }),
        }}
      >
        {children}
        {isSubmit && !children && "Guardar"}
        {isLoading && (
          <Spinner
            animation="border"
            className="ml-2"
            size="sm"
            variant="light"
          />
        )}
      </BootstrapButton>
    );
  }
);

Button.propTypes = {
  children: any,
  className: string,
  disabled: bool,
  hasShadow: bool,
  hoverText: string,
  isActive: bool,
  isAnchor: bool,
  isBlock: bool,
  isDisabled: bool,
  isLoading: bool,
  isSubmit: bool,
  onClick: func,
  size: oneOf(["sm", "md", "lg"]),
  variant: oneOf(["danger", "primary", "dark", "mexmaticas"]),
};

Button.displayName = "Button";
