import React from "react";
import { ListGroup } from "react-bootstrap";
import { string } from "prop-types";
import "./studentitem.scss";

export const StudentItem = React.memo(
  ({ name, email, _id, comesFrom = "" }) => {
    return (
      <ListGroup.Item
        action
        className="text-left d-flex flex-column py-4 studentitemstyle"
        href={`/admin/students/${_id}${comesFrom}`}
      >
        <span className="studentitemtext">{name}</span>
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
