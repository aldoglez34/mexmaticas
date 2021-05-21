import React from "react";
import { ProgressBar } from "react-bootstrap";
import { number } from "prop-types";

export const Progress = React.memo(({ current, total }) => {
  return (
    <ProgressBar
      animated
      min="1"
      max={total}
      variant="success"
      style={{ height: "1.7rem" }}
      now={current}
      title="Avance"
      className="w-100 rounded-0"
      // label={`${(current / total) * 100}%`}
    />
  );
});

Progress.propTypes = {
  current: number.isRequired,
  total: number.isRequired,
};

Progress.displayName = "Progress";
