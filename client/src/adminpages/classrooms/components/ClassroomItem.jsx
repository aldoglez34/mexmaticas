import React from "react";
import { ListGroup } from "react-bootstrap";
import { number, string } from "prop-types";
import cn from "classnames";

import styles from "./classroomitem.module.scss";

export const ClassroomItem = React.memo(
  ({ _id, description, institution, membersCounter, name, school }) => {
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
        href={`/admin/classroom/edit/${_id}`}
      >
        <span className={styles.itemtext}>{name}</span>
        <div>
          <span>
            <i className="fas fa-user-graduate mr-1" />
            {membersCounter}
          </span>
          {institution && (
            <span className="ml-2">
              |
              <i className="fas fa-school mr-1 ml-2" />
              {institution}
            </span>
          )}
        </div>
        {school && <strong className="mt-1">{school}</strong>}
        {description && <span>{description}</span>}
      </ListGroup.Item>
    );
  }
);

ClassroomItem.propTypes = {
  _id: string.isRequired,
  description: string,
  institution: string,
  membersCounter: number.isRequired,
  name: string.isRequired,
  school: string,
};

ClassroomItem.displayName = "ClassroomItem";
