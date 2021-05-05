import React from "react";
import { number } from "prop-types";
import Flash from "react-reveal/Flash";

export const FreestyleQPoints = React.memo(({ score }) => {
  return (
    <div title="Puntos" className="d-inline ml-3" style={{ color: "#0f5257" }}>
      <Flash>
        <i className="fas fa-trophy" />
        <strong className="ml-1">{score}</strong>
        <strong className="ml-1">pts.</strong>
      </Flash>
    </div>
  );
});

FreestyleQPoints.propTypes = {
  score: number.isRequired,
};
