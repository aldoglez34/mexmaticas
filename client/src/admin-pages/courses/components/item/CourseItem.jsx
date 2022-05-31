import React from "react";
import { Badge, ListGroup } from "react-bootstrap";
import { bool, string } from "prop-types";
import cn from "classnames";

import styles from "./courseitem.module.scss";

export const CourseItem = React.memo(({ _id, isActive, name, school }) => (
  <ListGroup.Item
    action
    className={cn("text-left d-flex flex-column py-4", styles.courseitemstyle)}
    href={`/admin/courses/edit/${_id}`}
  >
    <span className={cn(styles.courseitemtext)}>{name}</span>
    <span>
      <i className="fas fa-graduation-cap mr-1" />
      {school}
    </span>
    <div>
      {isActive ? (
        <Badge variant="success">Activo</Badge>
      ) : (
        <Badge variant="danger">No activo</Badge>
      )}
    </div>
  </ListGroup.Item>
));

CourseItem.propTypes = {
  _id: string.isRequired,
  isActive: bool.isRequired,
  name: string.isRequired,
  school: string.isRequired,
};

CourseItem.displayName = "CourseItem";
