import React, { memo } from "react";
import { Button } from "react-bootstrap";
import { any, oneOf, string } from "prop-types";
import cn from "classnames";

import styles from "./adminbutton.module.scss";

export const AdminButton = memo(
  ({ className = "", href, icon, size = "md", text }) => {
    return (
      <Button
        {...{
          className: cn(styles.button, className),
          size,
          ...(href ? { onClick: () => (window.location.href = href) } : {}),
        }}
      >
        {icon}
        {text}
      </Button>
    );
  }
);

AdminButton.propTypes = {
  className: string,
  children: any,
  href: string,
  icon: any,
  size: oneOf(["sm", "md", "lg"]),
};

AdminButton.displayName = "AdminButton";
