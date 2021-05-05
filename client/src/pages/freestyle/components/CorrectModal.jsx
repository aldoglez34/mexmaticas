import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { bool, func, number } from "prop-types";

export const CorrectModal = React.memo(
  ({ showCorrect, setShowCorrect, qValue }) => {
    useEffect(() => {
      // close modal after 2 seconds
      if (showCorrect) setTimeout(() => setShowCorrect(false), 800);
    }, [showCorrect, setShowCorrect]);

    return (
      <>
        <Modal show={showCorrect} centered size="sm" onHide={() => undefined}>
          <Modal.Body className="p-1">
            <div className="text-center bg-success rounded py-4">
              <h1 className="display-3 text-light">
                <i className="fas fa-check-circle" />
              </h1>
              <h1 className="text-light">Correcto</h1>
              <h3 className="text-warning">
                {"+" + qValue}
                <span className="ml-2">{qValue > 1 ? "puntos" : "punto"}</span>
              </h3>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
);

CorrectModal.propTypes = {
  qValue: number,
  setShowCorrect: func.isRequired,
  showCorrect: bool.isRequired,
};
