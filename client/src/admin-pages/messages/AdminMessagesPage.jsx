import React, { useState, useEffect } from "react";
import {
  AdminDataTemplate,
  AdminLayout,
  AdminModal,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { deleteMessage, fetchMessages } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import { markSeen } from "../../services";
import { isEmpty, isEqual } from "lodash";
import { Button } from "react-bootstrap";

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
    data: { activePage, filtered, limit, offset, pages, searchRef },
    functions: { clearFilters, handleChangePage, handleFilterData },
  } = useDataUtils({
    data: messages,
    pageSize: PAGE_SIZE,
    searchBarAccessor: "email",
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
      {text}
    </div>
  );

  const mapItemFunc = (item) => (
    <ListGroupItem key={item._id} handleOnClick={() => handleShow(item)}>
      <div className="d-flex flex-row">
        <div>
          <strong>Remitente</strong>
          <p className="m-0">{item.email}</p>
          <small>{formatDate(item.sentAt, "L")}</small>
        </div>
        <div className="d-flex flex-column ml-3">
          <strong>Mensaje</strong>
          {item.body}
        </div>
        {!item.seen && (
          <i
            className="fas fa-certificate text-warning ml-auto"
            style={{ fontSize: "22px" }}
            title="Nuevo"
          />
        )}
      </div>
    </ListGroupItem>
  );

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);

      setActiveMessage(null);
      // this state change will trigger the effect
      setReadCount((prevState) => prevState + 1);
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error, vuelve a intentarlo.");
    }
  };

  return (
    <AdminLayout expanded leftBarActive="Mensajes" topNavTitle="Mensajes">
      <SearchForm
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        isDataEmpty={isEmpty(messages)}
        ref={searchRef}
        searchBarPlaceholder="Buscar por remitente..."
      />
      <AdminDataTemplate
        {...{
          activePage,
          data: filtered,
          emptyMessage: "Lista de mensajes vacía.",
          handleChangePage,
          limit,
          mapItemFunc,
          offset,
          pages,
          pageSize: PAGE_SIZE,
        }}
      />
      {/* show modal if there's an active message */}
      <AdminModal
        handleClose={handleClose}
        show={!!activeMessage}
        size="lg"
        title="Mensaje"
      >
        <ModalRow
          title="Remitente"
          text={
            <div className="d-flex flex-column">
              <span>{`Nombre: ${activeMessage?.name ?? ""}`}</span>
              <span>{`Correo: ${activeMessage?.email ?? ""}`}</span>
            </div>
          }
        />
        <ModalRow
          title="Fecha"
          text={formatDate(activeMessage?.sentAt, "LLLL")}
        />
        <ModalRow
          title="Mensaje"
          text={
            <div className="d-flex flex-column">
              <span>{`Tema: ${activeMessage?.subject ?? ""}`}</span>
              <span>{`Mensaje: ${activeMessage?.body ?? ""}`}</span>
            </div>
          }
        />
        <Button
          className="shadow-sm mt-2"
          onClick={() =>
            isEqual(
              window.confirm("¿Estás seguro que quieres borrar este mensaje?"),
              true
            ) && handleDeleteMessage(activeMessage._id)
          }
          variant="danger"
        >
          Eliminar
        </Button>
      </AdminModal>
    </AdminLayout>
  );
};
