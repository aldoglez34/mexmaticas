import React from "react";
import { Button } from "react-bootstrap";
import { string } from "prop-types";

import styles from "./backbutton.module.scss";

export const BackButton = ({ to }) => {
  return (
    <Button className={styles.button} href={to}>
      <i className="fas fa-long-arrow-alt-left mr-2" />
      <span>Regresar</span>
    </Button>
  );
};

BackButton.propTypes = {
  to: string.isRequired,
};
