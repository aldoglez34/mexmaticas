import React, { useState, useEffect } from "react";
import {
  AdminDataTemplate,
  ConversationModal,
  ListGroupItem,
  SearchForm,
  TeacherLayout,
} from "../../components";
import { fetchConversations, setConversationSeen } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { errorLogger } from "../../errors/errorLogger";
import { useConversations } from "../../hooks/useConversations";

const PAGE_SIZE = 25;

export const TeacherMessagesPage = () => {
  const [conversations, setConversations] = useState();
  const [activeConversation, setActiveConversation] = useState(null);
  const [messagesWereRemoved, setMessagesWereRemoved] = useState(false);

  const teacher = useSelector((state) => state.teacher);

  const { formattedConversations } = useConversations(
    conversations,
    teacher?._id
  );

  useEffect(() => {
    if (!teacher?._id) return;
    fetchConversations("teacher", teacher._id)
      .then((res) => setConversations(res.data))
      .catch((err) => errorLogger(err));
  }, [teacher]);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef },
    functions: { clearFilters, handleChangePage, handleFilterData },
  } = useDataUtils({
    data: formattedConversations,
    pageSize: PAGE_SIZE,
    searchBarAccessor: "studentName",
  });

  const handleClose = () => {
    if (messagesWereRemoved) {
      window.location.reload();
      return;
    }
    setActiveConversation(null);
  };

  const handleShow = async (conversation) => {
    try {
      const _messagesWereRemoved = await setConversationSeen(
        "teacher",
        teacher?._id,
        conversation._id
      ).then((res) => res.data);
      setMessagesWereRemoved(_messagesWereRemoved);
      setActiveConversation(conversation);
    } catch (err) {
      errorLogger(err);
    }
  };

  const mapItemFunc = (item) => (
    <ListGroupItem
      handleOnClick={() => handleShow(item)}
      hasRedDot={item.hasPendingMessages}
      key={item._id}
      title={item.title}
      content={
        <>
          <div className="d-flex flex-column">
            <span className="mb-1"></span>
            {item.body}
          </div>
        </>
      }
    />
  );

  return (
    <TeacherLayout expanded leftBarActive="Mensajes" topNavTitle="Mensajes">
      <SearchForm
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        isDataEmpty={isEmpty(conversations)}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de alumno..."
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
      {/* show conversation modal if there's an active message */}
      <ConversationModal
        {...{
          activeConversation,
          canDelete: true,
          handleClose,
          myId: teacher?._id,
          receiver: activeConversation?.receiver,
          sender: activeConversation?.sender,
          show: !!activeConversation,
        }}
      />
    </TeacherLayout>
  );
};
