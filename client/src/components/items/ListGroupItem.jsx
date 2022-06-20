import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";
import { any, func, string } from "prop-types";
import cn from "classnames";

import styles from "./listgroupitem.module.scss";

export const ListGroupItem = memo(({ children, link, handleOnClick }) => (
  <ListGroup.Item
    action
    className={cn(
      "text-left",
      "d-flex",
      "flex-column",
      "py-3",
      styles.itemstyle
    )}
    {...(link ? { href: link } : {})}
    {...(handleOnClick ? { onClick: handleOnClick } : {})}
  >
    {children}
  </ListGroup.Item>
));

ListGroupItem.propTypes = {
  children: any.isRequired,
  handleOnClick: func,
  link: string,
};

ListGroupItem.displayName = "ListGroupItem";
