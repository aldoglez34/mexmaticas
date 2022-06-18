import React, { useState, useEffect } from "react";
import {
  AdminLayout,
  AdminModal,
  AdminPagination,
  AdminSpinner,
} from "../../components";
import { ListGroup } from "react-bootstrap";
import { fetchMessages } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import { markSeen } from "../../services";

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState();
  const [activeMessage, setActiveMessage] = useState(null);
  // this state forces the effect to trigger and refetch the messages again
  const [readCount, setReadCount] = useState(0);

  const {
    MESSAGES: { PAGE_SIZE },
  } = ADMIN_PAGES;

  useEffect(() => {
    fetchMessages()
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [readCount]);

  const {
    data: { activePage, filtered, limit, offset, pages },
    functions: { handleChangePage },
  } = useDataUtils({
    data: messages,
    pageSize: PAGE_SIZE,
  });

  const handleClose = () => {
    setActiveMessage(null);
    // this state change will trigger the effect
    setReadCount((prevState) => prevState + 1);
  };

  const handleShow = (message) => {
    markSeen(message._id).catch((err) => {
      console.log(err.response);
      err.response.data.msg
        ? alert(err.response.data.msg)
        : alert("Ocurrió un error al marcar mensaje como leído.");
    });
    setActiveMessage(message);
  };

  const ModalRow = ({ title, text }) => (
    <div className="mb-2">
      <h5 className="text-dark">{title}</h5>
      <span>{text}</span>
    </div>
  );

  const MessageItem = ({ message }) => (
    <ListGroup.Item
      className="d-flex py-4 courseitemstyle"
      action
      onClick={() => handleShow(message)}
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
  );

  return filtered ? (
    <AdminLayout expanded leftBarActive="Mensajes" topNavTitle="Mensajes">
      {filtered.length ? (
        <>
          <ListGroup>
            {filtered.slice(offset, limit).map((m) => (
              <MessageItem key={m._id} message={m} />
            ))}
          </ListGroup>
          {filtered.length > PAGE_SIZE && (
            <div className="mt-3">
              <AdminPagination
                activePage={activePage}
                handleChangePage={(p) => handleChangePage(p)}
                pageCount={pages}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-4">No hay mensajes.</div>
      )}
      {/* show modal if there's an active message */}
      <AdminModal
        handleClose={handleClose}
        show={!!activeMessage}
        title="Mensaje"
      >
        <ModalRow
          title="Remitente"
          text={activeMessage?.username || activeMessage?.name}
        />
        <ModalRow title="Fecha" text={formatDate(activeMessage?.sentAt, "L")} />
        <ModalRow title="Tema" text={activeMessage?.subject} />
        <ModalRow title="Correo" text={activeMessage?.email} />
        <ModalRow title="Mensaje" text={activeMessage?.body} />
      </AdminModal>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
