import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";
import { any, bool, func, string } from "prop-types";
import cn from "classnames";

import styles from "./listgroupitem.module.scss";

export const ListGroupItem = memo(
  ({ content, handleOnClick, hasRedDot, link, title }) => (
    <ListGroup.Item
      action
      className={cn("d-flex flex-column py-2 px-3", styles.itemstyle)}
      {...(link && { href: link })}
      {...(handleOnClick && { onClick: handleOnClick })}
    >
      {title && (
        <strong className="d-block mb-1">
          {title}
          {hasRedDot && (
            <small>
              <i
                className="fas fa-circle ml-1"
                style={{ color: "#dc3545", textAlign: "center" }}
              />
            </small>
          )}
        </strong>
      )}
      {content && <small>{content}</small>}
    </ListGroup.Item>
  )
);

ListGroupItem.propTypes = {
  content: any,
  handleOnClick: func,
  hasRedDot: bool,
  link: string,
  title: string,
};

ListGroupItem.displayName = "ListGroupItem";
