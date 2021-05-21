import React from "react";
import { oneOf, string } from "prop-types";
import { ImageFromFirebase } from "../../../adminpages/components";

export const QTechnicalInstruction = React.memo(({ type, text, imageLink }) => {
  return type === "text" ? (
    <h4>
      <span className="text-break">{text}</span>
    </h4>
  ) : type === "image" ? (
    <ImageFromFirebase
      className="mt-2 mb-3"
      height="250"
      path={imageLink}
      rounded
      width="250"
    />
  ) : null;
});

QTechnicalInstruction.propTypes = {
  type: oneOf(["text", "image"]).isRequired,
  text: string,
  imageLink: string,
};

QTechnicalInstruction.displayName = "QTechnicalInstruction";
