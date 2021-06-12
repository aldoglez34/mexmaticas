import React from "react";
import { ListGroup } from "react-bootstrap";
import { string } from "prop-types";
import cn from "classnames";

import styles from "./institutionitem.module.scss";

export const InstitutionItem = React.memo(({ _id, description, name }) => {
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
      href={`/admin/institutions/edit/${_id}`}
    >
      <span className={styles.itemtext}>{name}</span>
      {description && <span>{description}</span>}
    </ListGroup.Item>
  );
});

InstitutionItem.propTypes = {
  _id: string.isRequired,
  description: string.isRequired,
  name: string.isRequired,
};

InstitutionItem.displayName = "InstitutionItem";
