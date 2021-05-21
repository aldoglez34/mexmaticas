import React from "react";
import { Button } from "react-bootstrap";
import { node } from "prop-types";
import cn from "classnames";

import styles from "./adminprimarybutton.module.scss";

export const AdminPrimaryButton = React.memo(({ icon, ...props }) => {
  return (
    <Button size="sm" className={cn("ml-1", styles.button)} {...props}>
      {icon}
    </Button>
  );
});

AdminPrimaryButton.propTypes = {
  icon: node.isRequired,
};

AdminPrimaryButton.displayName = "AdminPrimaryButton";
