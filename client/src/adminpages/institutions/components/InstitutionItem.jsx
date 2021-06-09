import React from "react";
import { ListGroup } from "react-bootstrap";
import { func, string } from "prop-types";
import cn from "classnames";

import styles from "./institutionitem.module.scss";

export const InstitutionItem = React.memo(({ description, name, onClick }) => {
  return (
    <ListGroup.Item
      action
      className={cn(
        "text-left",
        "d-flex",
        "flex-column",
        "py-4",
        styles.itemstyle
      )}
      onClick={onClick}
    >
      <span className={styles.itemtext}>{name}</span>
      {description && <span>{description}</span>}
    </ListGroup.Item>
  );
});

InstitutionItem.propTypes = {
  description: string.isRequired,
  name: string.isRequired,
  onClick: func.isRequired,
};

InstitutionItem.displayName = "InstitutionItem";
