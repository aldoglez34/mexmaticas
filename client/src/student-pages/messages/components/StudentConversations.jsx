import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import { array } from "prop-types";
import "./studentconversations.scss";
import { formatDate } from "../../../utils/helpers";

export const StudentConversations = React.memo(({ messages }) => {
  return (
    <ListGroup className="mt-2">
      {messages.map((m) => (
        <ListGroup.Item
          key={m._id}
          className="py-3 d-flex flex-column shadow-sm mb-4 mt-2 border rounded bg-light"
        >
          {/* subject */}
          <div className="d-flex">
            <div className="d-flex flex-column">
              <span className="text-muted">Curso/Tema/Pregunta</span>
              <h5>{m.subject}</h5>
            </div>
            <div className="ml-auto">
              <h3>
                {m.answered ? (
                  <i
                    className="fas fa-check-double text-primary"
                    title="Respondido"
                  />
                ) : (
                  <i className="fas fa-check text-secondary" title="Enviado" />
                )}
              </h3>
            </div>
          </div>
          {/* date */}
          <span className="text-muted">Enviado</span>
          <h5>{formatDate(m.sentAt, "LLLL")}</h5>
          {/* body */}
          <span className="text-muted mb-2">Mensaje</span>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows="5"
                placeholder={m.body}
                disabled
              />
            </Form.Group>
          </Form>
          {/* response */}
          {m.answered ? (
            <>
              <span className="text-muted mb-2">Respuesta</span>
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows="5"
                    placeholder={m.response}
                    disabled
                  />
                </Form.Group>
              </Form>
              <div className="text-right">
                <em>Respondido el {formatDate(m.respondedAt, "LLLL")}</em>
              </div>
            </>
          ) : (
            <div className="text-right">
              <em>Esperando respuesta...</em>
            </div>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

StudentConversations.propTypes = {
  messages: array.isRequired,
};

StudentConversations.displayName = "StudentConversations";
