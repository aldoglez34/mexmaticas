import React from "react";
import { array, func, string } from "prop-types";
import { Button, Image } from "react-bootstrap";

export const QMultipleChoice = React.memo(
  ({
    type,
    textChoices,
    imageChoices,
    getValueFromMultipleChoice,
    choiceSelected,
  }) => {
    return type === "text" ? (
      <div className="mt-3">
        {textChoices.map((c) => (
          <Button
            key={c}
            variant="outline-secondary"
            className="mr-2 mb-2 mb-md-0"
            active={choiceSelected === c ? true : false}
            onClick={() => getValueFromMultipleChoice(c)}
          >
            {c}
          </Button>
        ))}
      </div>
    ) : type === "image" ? (
      <div className="mt-3">
        {imageChoices.map((c) => (
          <Button
            key={c}
            variant="outline-secondary"
            className="m-2 mb-2 mb-md-0"
            active={choiceSelected === c ? true : false}
            onClick={() => getValueFromMultipleChoice(c)}
          >
            <Image src={c} />
          </Button>
        ))}
      </div>
    ) : null;
  }
);

QMultipleChoice.propTypes = {
  type: string.isRequired,
  textChoices: array,
  imageChoices: array,
  getValueFromMultipleChoice: func.isRequired,
  choiceSelected: string,
};
