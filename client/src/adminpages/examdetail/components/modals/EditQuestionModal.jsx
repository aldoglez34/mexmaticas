import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { object, string } from "prop-types";
import cn from "classnames";

import styles from "./editquestionmodal.module.scss";

export const EditQuestionModal = React.memo(({ Form, question, text }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        className={cn("mr-3", styles.button)}
        onClick={handleShow}
        size="sm"
      >
        <i className="fas fa-pen-alt" />
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
            <Form question={question} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

EditQuestionModal.propTypes = {
  question: object.isRequired,
  text: string.isRequired,
};
