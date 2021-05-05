import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { string } from "prop-types";
import cn from "classnames";

import styles from "./newquestionmodal.module.scss";

export const NewQuestionModal = React.memo(({ Form, text }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        className={cn("ml-1", styles.button)}
        onClick={handleShow}
        size="sm"
      >
        <i className="fas fa-plus-circle" />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Body className="bg-light rounded">
          <div className="d-flex">
            <h3 className="mb-0 text-dark">{text}</h3>
            <Button
              variant="link"
              className="text-dark ml-auto"
              onClick={handleClose}
            >
              <i className="fas fa-times" />
            </Button>
          </div>
          <div className="my-3">
            <Form />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

NewQuestionModal.propTypes = {
  text: string.isRequired,
};
