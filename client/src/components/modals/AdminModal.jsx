import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { bool, node, number, oneOfType, string } from "prop-types";
import cn from "classnames";

import styles from "./adminmodal.module.scss";

export const AdminModal = React.memo(
  ({ Form, formInitialText, formLabel, icon }) => {
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
          {icon}
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Body className="bg-light rounded">
            <div className="d-flex">
              <h3 className="mb-0 text-dark">Editar</h3>
              <Button
                variant="link"
                className="text-dark ml-auto"
                onClick={handleClose}
              >
                <i className="fas fa-times" />
              </Button>
            </div>
            <div className="my-3">
              <Form formLabel={formLabel} formInitialText={formInitialText} />
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
);

AdminModal.propTypes = {
  formInitialText: oneOfType([bool, number, string]),
  formLabel: string,
  icon: node,
};

AdminModal.displayName = "AdminModal";
