import React, { useEffect, useState } from "react";
import {
  AdminDataTemplate,
  AdminLayout,
  AdminModal,
  Button,
  ListGroupItem,
  SearchForm,
} from "../../components";
import {
  deleteConversation,
  fetchConversations,
  setConversationSeen,
} from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import { isEmpty, isEqual } from "lodash";
import { errorLogger } from "../../errors/errorLogger";

export const AdminMessagesPage = () => {
  const [conversations, setConversations] = useState();
  const [activeConversation, setActiveConversation] = useState(null);

  const {
    MESSAGES: { PAGE_SIZE },
  } = ADMIN_PAGES;

  useEffect(() => {
    fetchConversations("admin", "admin")
      .then((res) => setConversations(res.data))
      .catch((err) => errorLogger(err));
  }, []);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef },
    functions: { clearFilters, handleChangePage, handleFilterData },
  } = useDataUtils({
    data: conversations,
    pageSize: PAGE_SIZE,
    searchBarAccessor: "email",
  });

  const handleClose = () => {
    if (!activeConversation.isSeenByAdmin) {
      window.location.reload();
      return;
    }
    setActiveConversation(null);
  };

  const handleShow = async (conversation) => {
    try {
      await setConversationSeen("admin", "admin", conversation._id);
      setActiveConversation(conversation);
    } catch (err) {
      errorLogger(err);
    }
  };

  const mapItemFunc = (item) => (
    <ListGroupItem
      handleOnClick={() => handleShow(item)}
      hasRedDot={!item.isSeenByAdmin}
      key={item._id}
      title={`[${item.sender?.email}] ${item.sender?.name}`}
      content={
        <>
          <div className="d-flex flex-column">
            <strong>Mensaje</strong>
            {item.messages[0]?.text}
          </div>
        </>
      }
    />
  );

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId);
      setActiveConversation(null);
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error, vuelve a intentarlo.");
    }
  };

  const ModalRow = ({ title, text }) => (
    <div className="mb-2">
      {title && <h5 className="text-dark">{title}</h5>}
      {text}
    </div>
  );

  return (
    <AdminLayout expanded leftBarActive="Mensajes" topNavTitle="Mensajes">
      <SearchForm
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        isDataEmpty={isEmpty(conversations)}
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
        show={!!activeConversation}
        size="lg"
        title="Mensaje"
      >
        <ModalRow
          title="Remitente"
          text={
            <div className="d-flex flex-column">
              <span>{activeConversation?.sender?.name ?? ""}</span>
              <small>{activeConversation?.sender?.email ?? ""}</small>
            </div>
          }
        />
        <ModalRow
          title="Fecha"
          text={formatDate(activeConversation?.createdAt, "LLLL")}
        />
        <ModalRow
          title="Tema"
          text={
            <div className="d-flex flex-column">
              <span>{activeConversation?.origin ?? ""}</span>
            </div>
          }
        />
        <ModalRow
          title="Mensaje"
          text={
            <div className="d-flex flex-column">
              <span>{activeConversation?.messages[0]?.text ?? ""}</span>
            </div>
          }
        />
        <Button
          className="mt-2"
          onClick={() =>
            isEqual(
              window.confirm(
                "¿Estás seguro que quieres eliminar este mensaje?"
              ),
              true
            ) && handleDeleteConversation(activeConversation._id)
          }
          variant="danger"
        >
          Eliminar
        </Button>
      </AdminModal>
    </AdminLayout>
  );
};
