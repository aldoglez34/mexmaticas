import React from "react";
import { string } from "prop-types";
import { HashLink as Link } from "react-router-hash-link";

import styles from "./topicbadge.module.scss";

export const TopicBadge = ({ topicName }) => {
  return (
    <div className="mb-1">
      <Link
        className={styles.topic}
        smooth
        title={`Ir a ${topicName}`}
        to={`/course/#${topicName}`}
      >
        <strong style={{ fontSize: "17px" }}>
          <i
            className="fas fa-location-arrow mr-2"
            style={{ fontSize: "13px" }}
          />
          {topicName}
        </strong>
      </Link>
    </div>
  );
};

TopicBadge.propTypes = {
  topicName: string.isRequired,
};
