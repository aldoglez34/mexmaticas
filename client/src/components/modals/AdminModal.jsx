import React, { memo } from "react";
import { Modal } from "react-bootstrap";
import { any, bool, func, oneOf, string } from "prop-types";

export const AdminModal = memo(
  ({ children, handleClose, isCentered = false, show, size = "lg", title }) => (
    <Modal
      backdrop="static"
      centered={isCentered}
      keyboard={false}
      onHide={() => handleClose(false)}
      show={show}
      size={size}
    >
      <Modal.Header className="bg-light" closeButton>
        {title && (
          <Modal.Title>
            <strong style={{ color: "#343a40" }}>{title.toUpperCase()}</strong>
          </Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body className="bg-light rounded">{children}</Modal.Body>
    </Modal>
  )
);

AdminModal.propTypes = {
  children: any.isRequired,
  handleClose: func.isRequired,
  isCentered: bool,
  show: bool.isRequired,
  size: oneOf(["sm", "lg", "xl"]),
  title: string,
};

AdminModal.displayName = "AdminModal";
