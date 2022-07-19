import React, { memo, useRef } from "react";
import { bool, func, object, string } from "prop-types";
import { Col, Form, Row } from "react-bootstrap";
import { formatDate } from "../../utils/helpers";
import { Button, Toast } from "../";
import { ScrollableDiv } from "../divs/ScrollableDiv";
import { ImageFromFirebase } from "../images/ImageFromFirebase";
import { AdminModal } from "./AdminModal";
import { deleteConversation, newMessage } from "../../services";
import { isEmpty, isEqual } from "lodash";
import { errorLogger } from "../../errors/errorLogger";
import { useState } from "react";

export const ConversationModal = memo(
  ({
    activeConversation,
    canDelete = false,
    handleClose,
    myId,
    receiver,
    sender,
    show,
    title = "Mensaje",
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const messageBox = useRef(null);

    const ModalRow = ({ title, text }) => (
      <div className="mb-2">
        {title && <strong className="text-dark d-block">{title}</strong>}
        {text}
      </div>
    );

    const UserRows = ({ user }) => {
      if (!user) return null;
      return (
        <div className="d-flex flex-column">
          <span>{user.name ?? ""}</span>
          <i>{user.email ?? ""}</i>
        </div>
      );
    };

    const handleSend = () => {
      setIsLoading(true);
      if (isEmpty(messageBox.current.value)) return null;
      newMessage({
        conversationId: activeConversation?._id,
        sentBy: myId,
        text: messageBox.current.value,
      })
        .then(() => window.location.reload())
        .catch((err) => errorLogger(err));
    };

    const handleOnDelete = async (conversationId) => {
      setIsDeleting(true);
      try {
        await deleteConversation(conversationId);
        window.location.reload();
      } catch (err) {
        errorLogger(err);
      }
    };

    if (!activeConversation) return null;

    return (
      <AdminModal handleClose={handleClose} show={show} size="lg" title={title}>
        <Row>
          <Col md={5}>
            {sender && (
              <ModalRow title="Remitente" text={<UserRows user={sender} />} />
            )}
            {receiver && (
              <ModalRow
                title="Destinatario"
                text={<UserRows user={receiver} />}
              />
            )}
            {activeConversation?.origin && (
              <ModalRow title="Origen" text={activeConversation?.origin} />
            )}
            {activeConversation?.image && (
              <ImageFromFirebase
                className="my-1 pb-2 rounded"
                height="250"
                path={activeConversation?.image}
                rounded
                width="250"
              />
            )}
            {activeConversation?.createdAt && (
              <ModalRow
                title="Fecha"
                text={formatDate(activeConversation?.createdAt, "LLLL")}
              />
            )}
            {canDelete && (
              <Button
                className="mt-auto"
                isDisabled={isDeleting}
                isLoading={isDeleting}
                variant="danger"
                onClick={() =>
                  isEqual(
                    window.confirm(
                      "¿Estás seguro que quieres eliminar este mensaje?"
                    ),
                    true
                  ) && handleOnDelete(activeConversation?._id)
                }
              >
                Borrar
              </Button>
            )}
          </Col>
          <Col md={7}>
            <ScrollableDiv className="p-0">
              {(activeConversation?.messages || [])
                .sort((a, b) => a.orderNumber - b.orderNumber)
                .map((msg, idx) => (
                  <Toast
                    author={msg.author?.name}
                    date={msg.sentAt}
                    isOwnMessage={msg.isOwnMessage}
                    key={idx}
                    text={msg.text}
                  />
                ))}
            </ScrollableDiv>
            <Form.Control
              as="textarea"
              className="mt-3"
              ref={messageBox}
              type="text"
            />
            <Button
              className="mt-3"
              isDisabled={isLoading}
              isLoading={isLoading}
              onClick={handleSend}
              title="Enviar"
            >
              Enviar
            </Button>
          </Col>
        </Row>
      </AdminModal>
    );
  }
);

ConversationModal.propTypes = {
  activeConversation: object,
  canDelete: bool,
  handleClose: func,
  myId: string,
  receiver: object,
  sender: object,
  show: bool,
  title: string,
};

ConversationModal.displayName = "ConversationModal";
