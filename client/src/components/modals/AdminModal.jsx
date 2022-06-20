import React, { memo } from "react";
import { Modal } from "react-bootstrap";
import { any, bool, func, oneOf, string } from "prop-types";

export const AdminModal = memo(
  ({
    children,
    handleClose,
    isCentered = false,
    isLocked = true,
    show,
    size = "md",
    title,
  }) => (
    <Modal
      centered={isCentered}
      onHide={() => handleClose(false)}
      show={show}
      size={size}
      {...(isLocked ? { backdrop: "static", keyboard: false } : {})}
    >
      <Modal.Header className="bg-light" closeButton>
        {title && (
          <Modal.Title>
            <strong style={{ color: "#343a40" }}>{title.toUpperCase()}</strong>
          </Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body className="bg-light rounded shadow">{children}</Modal.Body>
    </Modal>
  )
);

AdminModal.propTypes = {
  children: any.isRequired,
  handleClose: func.isRequired,
  isCentered: bool,
  isLocked: bool,
  show: bool.isRequired,
  size: oneOf(["sm", "md", "lg", "xl"]),
  title: string,
};

AdminModal.displayName = "AdminModal";
