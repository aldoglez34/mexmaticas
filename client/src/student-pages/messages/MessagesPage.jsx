import React, { useState, useEffect } from "react";
import { Image, ListGroup, Spinner } from "react-bootstrap";
import {
  ConversationModal,
  ListGroupItem,
  StudentLayout,
  StudentTitle,
} from "../../components";
import { fetchConversations, setConversationSeen } from "../../services";
import { useSelector } from "react-redux";
import { errorLogger } from "../../errors/errorLogger";
import { isEmpty } from "lodash";
import { useConversations } from "../../hooks/useConversations";

export const MessagesPage = () => {
  const [conversations, setConversations] = useState();
  const [activeConversation, setActiveConversation] = useState(null);
  const [messagesWereRemoved, setMessagesWereRemoved] = useState(false);

  const student = useSelector((state) => state.student);

  const { formattedConversations } = useConversations(
    conversations,
    student?._id
  );

  useEffect(() => {
    if (!student?._id) return;
    fetchConversations("student", student?._id)
      .then((res) => setConversations(res.data))
      .catch((err) => errorLogger(err));
  }, [student]);

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
        "student",
        student?._id,
        conversation._id
      ).then((res) => res.data);
      setMessagesWereRemoved(_messagesWereRemoved);
      setActiveConversation(conversation);
    } catch (err) {
      errorLogger(err);
    }
  };

  const StudentConversation = ({ item }) => (
    <ListGroupItem
      content={<div className="d-flex flex-column">{item.body}</div>}
      handleOnClick={() => handleShow(item)}
      hasRedDot={item.hasPendingMessages}
      title={item.title}
    />
  );

  const EmptyMessages = () => (
    <div className="text-center mt-5">
      <Image
        className="mb-3"
        height="135"
        src="/images/emptybox.png"
        width="135"
      />
      <em className="d-block" style={{ color: "#b3b3b3" }}>
        Tu bandeja de mensajes está vacía.
      </em>
    </div>
  );

  return (
    <StudentLayout>
      <div className="pb-4">
        <StudentTitle text="Mensajes" imageName="messages.png" />
        {!conversations && (
          <div className="text-center mt-4 pt-4">
            <Spinner animation="border" variant="success" />
          </div>
        )}
        {!(conversations || []).length && <EmptyMessages />}
        {!isEmpty(formattedConversations) && (
          <ListGroup>
            {formattedConversations.map((conv) => (
              <StudentConversation item={conv} key={conv._id} />
            ))}
          </ListGroup>
        )}
        {/* show conversation modal if there's an active message */}
        <ConversationModal
          {...{
            activeConversation,
            handleClose,
            myId: student?._id,
            receiver: activeConversation?.receiver,
            sender: activeConversation?.sender,
            show: !!activeConversation,
          }}
        />
      </div>
    </StudentLayout>
  );
};
