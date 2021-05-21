import React, { useState } from "react";
import { Modal, ListGroup, Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import "moment/locale/es";
import { object } from "prop-types";
import TeacherAPI from "../../../utils/TeacherAPI";
import { ResponseForm } from "./";
import { ImageFromFirebase } from "../../components";

export const ItemModal = React.memo(({ message }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleShow = () => {
    TeacherAPI.t_markSeen(message._id)
      .then(() => console.log("marked seen."))
      .catch((err) => {
        console.log(err.response);
        err.response.data.msg
          ? alert(err.response.data.msg)
          : alert("Ocurrió un error al marcar mensaje como leído.");
      });
    setShow(true);
  };

  return (
    <>
      <ListGroup.Item
        className="d-flex py-4 courseitemstyle"
        action
        onClick={handleShow}
      >
        <div className="d-flex flex-column">
          <strong>Fecha</strong>
          {moment(message.sentAt).format("L")}
        </div>
        <div className="d-flex flex-column ml-3">
          <strong>Origen</strong>
          {message.source}
        </div>
        <div className="d-flex flex-column ml-3">
          <strong>Correo</strong>
          {message.email}
        </div>
        <div className="d-flex flex-column ml-3">
          <strong>Descripción</strong>
          {message.subject.indexOf(">") === -1 ? (
            message.subject
          ) : (
            <div>
              <span className="d-block">
                {message.subject.substr(0, message.subject.indexOf(">"))}
              </span>
              {console.log(
                message.subject.substr(message.subject.indexOf(">") + 1, 999)
              )}
              <ImageFromFirebase
                path={String(
                  message.subject
                    .substr(message.subject.indexOf(">") + 1, 9999)
                    .trim(9)
                )}
                width="70"
                height="100"
                className="mt-3 mb-3"
              />
            </div>
          )}
        </div>
        {message.seen ? null : (
          <i
            className="fas fa-certificate text-warning ml-auto"
            style={{ fontSize: "22px" }}
            title="Nuevo"
          />
        )}
        {message.answered ? (
          <i
            className="fas fa-check-circle text-primary ml-auto"
            style={{ fontSize: "22px" }}
            title="Respondido"
          />
        ) : null}
      </ListGroup.Item>

      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Body className="bg-light rounded shadow">
          {/* top */}
          <div className="d-flex">
            <h3 className="mb-3">Mensaje...</h3>
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
          <Row>
            <Col>
              <h5 className="text-dark">Origen</h5>
              {message.source}
            </Col>
            <Col>
              {message.type === "Student" ? (
                <div className="d-flex flex-column">
                  <h5 className="text-dark">Usuario</h5>
                  {message.username}
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <h5 className="text-dark">Nombre</h5>
                  {message.name}
                </div>
              )}
            </Col>
            <Col>
              <h5 className="text-dark">Fecha</h5>
              {moment(message.sentAt).format("L")}
            </Col>
          </Row>
          <div>
            {message.type === "Student" ? (
              <div className="d-flex flex-column mt-3">
                <h5 className="text-dark">Nombre</h5>
                {message.name}
              </div>
            ) : null}
            <div className="d-flex flex-column mt-3">
              <h5 className="text-dark">Descripción</h5>
              {message.subject.indexOf(">") === -1 ? (
                message.subject
              ) : (
                <div>
                  <span className="d-block">
                    {message.subject.substr(0, message.subject.indexOf(">"))}
                  </span>
                  <ImageFromFirebase
                    path={String(
                      message.subject.substr(
                        message.subject.indexOf(">") + 1,
                        9999
                      )
                    ).trim()}
                    width="70"
                    height="100"
                    className="mt-3 mb-3"
                  />
                </div>
              )}
            </div>
            <div className="d-flex flex-column mt-3">
              <h5 className="text-dark">Correo</h5>
              {message.email}
            </div>
            <h5 className="mt-3 text-dark">Mensaje</h5>
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows="5"
                  placeholder={message.body}
                  disabled
                />
              </Form.Group>
            </Form>
            {/* response */}
            {message.source === "Inicio" ? null : !message.answered ? (
              <ResponseForm msgId={message._id} email={message.email} />
            ) : (
              <>
                <h5 className="mt-3 text-dark">Respuesta</h5>
                <Form>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows="5"
                      placeholder={message.response}
                      disabled
                    />
                  </Form.Group>
                </Form>
                <small className="text-muted">
                  Respondido el {moment(message.respondedAt).format("LLL")}
                </small>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

ItemModal.propTypes = {
  message: object.isRequired,
};

ItemModal.displayName = "ItemModal";
