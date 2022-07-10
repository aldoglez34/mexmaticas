import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";
import { any, func, string } from "prop-types";
import cn from "classnames";

import styles from "./listgroupitem.module.scss";

export const ListGroupItem = memo(({ content, handleOnClick, link, title }) => (
  <ListGroup.Item
    action
    className={cn("d-flex flex-column py-2 px-3", styles.itemstyle)}
    {...(link && { href: link })}
    {...(handleOnClick && { onClick: handleOnClick })}
  >
    {title && <strong className="d-block mb-1">{title}</strong>}
    {content && <small>{content}</small>}
  </ListGroup.Item>
));

ListGroupItem.propTypes = {
  content: any,
  handleOnClick: func,
  link: string,
  title: string,
};

ListGroupItem.displayName = "ListGroupItem";
