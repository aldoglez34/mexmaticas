import React, { memo } from "react";
import { string, bool } from "prop-types";
import { Toast as BoostrapToast } from "react-bootstrap";
import { formatDate } from "../../utils/helpers";
import cn from "classnames";

import styles from "./toast.module.scss";

export const Toast = memo(({ author, className, date, isOwnMessage, text }) => (
  <BoostrapToast
    className={cn(isOwnMessage ? styles.ownToast : styles.toast, className)}
    show={true}
  >
    <BoostrapToast.Header closeButton={false}>
      <strong>{author}</strong>
      <small className="ml-auto">{formatDate(date, "L")}</small>
    </BoostrapToast.Header>
    <BoostrapToast.Body>{text}</BoostrapToast.Body>
  </BoostrapToast>
));

Toast.propTypes = {
  author: string.isRequired,
  className: string,
  date: string.isRequired,
  isOwnMessage: bool,
  text: string.isRequired,
};

Toast.displayName = "Toast";
