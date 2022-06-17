import React, { useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { object } from "prop-types";
import { markSeen } from "../../../../services";
import { formatDate } from "../../../../utils/helpers";

export const ItemModal = React.memo(({ message }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const handleShow = () => {
    markSeen(message._id).catch((err) => {
      console.log(err.response);
      err.response.data.msg
        ? alert(err.response.data.msg)
        : alert("Ocurrió un error al marcar mensaje como leído.");
    });
    setShow(true);
  };

  const ModalRow = ({ title, text }) => (
    <div className="mb-2">
      <h5 className="text-dark">{title}</h5>
      <span>{text}</span>
    </div>
  );

  return (
    <>
      <ListGroup.Item
        className="d-flex py-4 courseitemstyle"
        action
        onClick={handleShow}
      >
        <div className="d-flex flex-column ml-3">
          <strong>Remitente</strong>
          <p className="m-0">{message.email}</p>
          <small>{formatDate(message.sentAt, "L")}</small>
        </div>
        <div className="d-flex flex-column ml-3">
          <strong>Mensaje</strong>
          {message.body}
        </div>
        {!message.seen && (
          <i
            className="fas fa-certificate text-warning ml-auto"
            style={{ fontSize: "22px" }}
            title="Nuevo"
          />
        )}
      </ListGroup.Item>

      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Body className="bg-light rounded shadow">
          <div className="d-flex">
            <h3 className="mb-3">Mensaje</h3>
            <Button
              className="ml-auto text-dark"
              variant="link"
              size="sm"
              title="Cerrar"
              onClick={handleClose}
            >
              <i className="fas fa-times" style={{ fontSize: "22px" }} />
            </Button>
          </div>
          <ModalRow title="Remitente" text={message.username || message.name} />
          <ModalRow title="Fecha" text={formatDate(message.sentAt, "L")} />
          <ModalRow title="Tema" text={message.subject} />
          <ModalRow title="Correo" text={message.email} />
          <ModalRow title="Mensaje" text={message.body} />
        </Modal.Body>
      </Modal>
    </>
  );
});

ItemModal.propTypes = {
  message: object.isRequired,
};

ItemModal.displayName = "ItemModal";
