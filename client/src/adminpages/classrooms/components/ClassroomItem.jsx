import React from "react";
import { ListGroup } from "react-bootstrap";
import { number, string } from "prop-types";
import cn from "classnames";

import styles from "./classroomitem.module.scss";

export const ClassroomItem = React.memo(
  ({ _id, institution, membersCounter, name, school }) => {
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
        href={`/admin/classrooms/edit/${_id}`}
      >
        <span className={styles.itemtext}>{name}</span>
        {school && (
          <span className="mb-1">
            <i className="fas fa-graduation-cap mr-2" />
            {school}
          </span>
        )}
        <div>
          <span>
            <i className="fas fa-user-graduate mr-2" />
            {membersCounter}
          </span>
          {institution && (
            <span className="ml-2">
              |
              <i className="fas fa-school ml-2 mr-2" />
              {institution}
            </span>
          )}
        </div>
      </ListGroup.Item>
    );
  }
);

ClassroomItem.propTypes = {
  _id: string.isRequired,
  institution: string,
  membersCounter: number.isRequired,
  name: string.isRequired,
  school: string,
};

ClassroomItem.displayName = "ClassroomItem";
