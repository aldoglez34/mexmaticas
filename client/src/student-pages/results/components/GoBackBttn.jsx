import React from "react";
import { Button } from "react-bootstrap";
import { string } from "prop-types";
import cn from "classnames";

import styles from "./gobackbttn.module.scss";

export const GoBackBttn = ({ topicName, ...props }) => {
  const className = cn(styles.button, props.className);

  return (
    <Button href={`/course/#${topicName}`} className={className}>
      <i className="fas fa-long-arrow-alt-left mr-2" />
      Regresar
    </Button>
  );
};

GoBackBttn.propTypes = {
  topicName: string.isRequired,
};
