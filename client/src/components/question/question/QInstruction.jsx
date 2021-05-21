import React from "react";
import { string } from "prop-types";

export const QInstruction = React.memo(({ qInstruction }) => {
  return (
    <h4 className="mb-1 mt-2">
      <span className="text-break">{qInstruction}</span>
    </h4>
  );
});

QInstruction.propTypes = {
  qInstruction: string.isRequired,
};

QInstruction.displayName = "QInstruction";
