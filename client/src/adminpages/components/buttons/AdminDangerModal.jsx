import React, { useState } from "react";
import { Button, Image, Modal, Spinner } from "react-bootstrap";
import { func, node, oneOf, string } from "prop-types";
import cn from "classnames";

import styles from "./admindangermodal.module.scss";

export const AdminDangerModal = React.memo(
  ({ deleteFn, icon, modalText, variant, ...props }) => {
    const [show, setShow] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = () => {
      setIsDeleting(true);
      deleteFn();
    };

    return (
      <>
        {variant === "transparent" && (
          <Button
            {...props}
            className={cn("ml-1", styles.transparent)}
            onClick={handleShow}
            size="sm"
          >
            {icon}
          </Button>
        )}
        {variant === "filled" && (
          <Button className="ml-1" variant="danger" onClick={handleShow}>
            <i className="fas fa-trash-alt mr-2" />
            Eliminar
          </Button>
        )}

        <Modal centered onHide={handleClose} show={show}>
          <Modal.Body className="bg-light rounded shadow text-center py-4">
            {isDeleting ? (
              <div className="py-4">
                <strong className="mb-2">Borrando...</strong>
                <br />
                <br />
                <Spinner variant="danger" animation="border" role="status">
                  <span className="sr-only">Borrando...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <Image
                  className="mb-3"
                  height="130"
                  src="/images/trash.png"
                  width="130"
                />
                <div className="lead text-center mt-2">{modalText}</div>
                <div className="d-flex flex-row justify-content-center mt-4">
                  <Button variant="dark" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={handleDelete}
                  >
                    Borrar
                    <i className="fas fa-trash-alt ml-2" />
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }
);

AdminDangerModal.propTypes = {
  deleteFn: func,
  icon: node.isRequired,
  modalText: string.isRequired,
  variant: oneOf(["transparent", "filled"]),
};
