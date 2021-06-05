import React from "react";
import { ListGroup } from "react-bootstrap";
import { bool, string } from "prop-types";
import cn from "classnames";

import styles from "./classroomitem.module.scss";

export const ClassroomItem = React.memo(({ _id, name, school }) => {
  return (
    <ListGroup.Item
      action
      className={cn(
        "text-left",
        "d-flex",
        "flex-column",
        "py-4",
        styles.courseitemstyle
      )}
      href={`/admin/courses/edit/${_id}`}
    >
      <span className={styles.courseitemtext}>{name}</span>
      <span>
        <i className="fas fa-chalkboard mr-1" />
        {school}
      </span>
    </ListGroup.Item>
  );
});

ClassroomItem.propTypes = {
  _id: string.isRequired,
  name: string.isRequired,
  school: string.isRequired,
};

ClassroomItem.displayName = "ClassroomItem";
