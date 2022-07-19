import React, { memo } from "react";
import { string } from "prop-types";
import { Image } from "react-bootstrap";

export const StudentTitle = memo(({ imageName, text }) => (
  <div className="d-flex align-items-center my-4">
    <h2 className="mb-0">
      <strong>{text.toLocaleUpperCase()}</strong>
    </h2>
    {imageName && (
      <Image
        className="ml-2"
        height="40"
        src={`/images/${imageName}`}
        width="40"
      />
    )}
  </div>
));

StudentTitle.propTypes = {
  imageName: string,
  text: string,
};
