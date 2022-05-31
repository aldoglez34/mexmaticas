import React from "react";
import { ListGroup } from "react-bootstrap";
import { string } from "prop-types";
import cn from "classnames";

import styles from "./studentitem.module.scss";

export const StudentItem = React.memo(
  ({ name, email, _id, comesFrom = "" }) => {
    return (
      <ListGroup.Item
        action
        className={cn(
          "text-left d-flex flex-column py-4",
          styles.studentitemstyle
        )}
        href={`/admin/students/${_id}${comesFrom}`}
      >
        <span className={cn(styles.studentitemtext)}>{name}</span>
        <span>
          <i className="fas fa-user-graduate mr-2" />
          {email}
        </span>
      </ListGroup.Item>
    );
  }
);

StudentItem.propTypes = {
  _id: string.isRequired,
  comesFrom: string,
  email: string.isRequired,
  name: string.isRequired,
};

StudentItem.displayName = "StudentItem";
