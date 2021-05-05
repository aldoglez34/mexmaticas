import React from "react";
import { Badge, ListGroup } from "react-bootstrap";
import { bool, string } from "prop-types";
import "./courseitem.scss";

export const CourseItem = React.memo(({ name, school, _id, isActive }) => {
  return (
    <ListGroup.Item
      action
      className="text-left d-flex flex-column py-4 courseitemstyle"
      href={"/admin/courses/edit/" + _id}
    >
      <span className="courseitemtext">{name}</span>
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
  );
});

CourseItem.propTypes = {
  name: string.isRequired,
  school: string.isRequired,
  _id: string.isRequired,
  isActive: bool.isRequired,
};
