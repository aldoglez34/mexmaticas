import React from "react";
import { ListGroup } from "react-bootstrap";
import { string } from "prop-types";
import "./studentitem.scss";

export const StudentItem = React.memo(({ name, email, _id }) => {
  return (
    <ListGroup.Item
      action
      className="text-left d-flex flex-column py-4 studentitemstyle"
      href={"/admin/students/" + _id}
    >
      <span className="studentitemtext">{name}</span>
      <span>
        <i className="fas fa-at mr-1" />
        {email}
      </span>
    </ListGroup.Item>
  );
});

StudentItem.propTypes = {
  name: string.isRequired,
  email: string.isRequired,
  _id: string.isRequired,
};
