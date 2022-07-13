import React, { useState, useEffect } from "react";
import {
  AdminDataTemplate,
  AdminModal,
  Button,
  ImageFromFirebase,
  ListGroupItem,
  SearchForm,
  TeacherLayout,
} from "../../components";
import { fetchTeacherMessages, markTeacherMsgSeen } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { formatDate } from "../../utils/helpers";
import { isEmpty } from "lodash";
import { Badge, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { errorLogger } from "../../errors/errorLogger";

const PAGE_SIZE = 25;

export const TeacherMessagesPage = () => {
  const [messages, setMessages] = useState();
  const [activeMessage, setActiveMessage] = useState(null);
  // this state forces the effect to trigger and refetch the messages again
  const [readCount, setReadCount] = useState(0);

  const teacher = useSelector((state) => state.teacher);

  useEffect(() => {
    fetchTeacherMessages(teacher?._id)
      .then((res) => setMessages(res.data))
      .catch((err) => errorLogger(err));
  }, [readCount, teacher]);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef },
    functions: { clearFilters, handleChangePage, handleFilterData },
  } = useDataUtils({
    data: messages,
    pageSize: PAGE_SIZE,
    searchBarAccessor: "studentName",
  });

  const handleClose = () => {
    setActiveMessage(null);
    // this state change will trigger the effect
    setReadCount((prevState) => prevState + 1);
  };

  const handleShow = (message) => {
    if (!message.isSeen)
      markTeacherMsgSeen({
        messageId: message._id,
        teacherId: teacher._id,
      }).catch((err) => errorLogger(err));
    setActiveMessage(message);
  };

  const mapItemFunc = (item) => (
    <ListGroupItem
      key={item._id}
      handleOnClick={() => handleShow(item)}
      title={`[${item.studentEmail}] ${item.studentName}`}
      content={
        <>
          <div className="d-flex flex-column">
            <span>
              Mensaje
              {!item.isSeen && (
                <Badge className="ml-1" variant="danger">
                  Nuevo
                </Badge>
              )}
              {item.isResponded && (
                <Badge className="ml-1" variant="primary">
                  Respondido
                </Badge>
              )}
            </span>
            {item.body}
          </div>
        </>
      }
    />
  );

  const ModalRow = ({ title, text }) => (
    <div className="mb-2">
      {title && <h5 className="text-dark">{title}</h5>}
      {text}
    </div>
  );

  const AnswerBox = () => {
    return (
      <>
        <Form.Control
          as="textarea"
          disabled={activeMessage?.isResponded}
          style={{ height: "100px" }}
        />
        <Button className="mt-2">Contestar</Button>
      </>
    );
  };

  return (
    <TeacherLayout expanded leftBarActive="Mensajes" topNavTitle="Mensajes">
      <SearchForm
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        isDataEmpty={isEmpty(messages)}
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
              <span>{activeMessage?.studentName ?? ""}</span>
              <small>{activeMessage?.studentEmail ?? ""}</small>
            </div>
          }
        />
        <ModalRow
          title="Fecha"
          text={formatDate(activeMessage?.sentAt, "LLLL")}
        />
        <ModalRow
          title="Origen"
          text={
            <div className="d-flex flex-column">
              <span>{activeMessage?.origin ?? ""}</span>
            </div>
          }
        />
        {activeMessage?.image && (
          <ImageFromFirebase
            className="mt-2"
            height="250"
            path={activeMessage.image}
            rounded
            width="250"
          />
        )}
        <ModalRow
          title="Pregunta"
          text={
            <div className="d-flex flex-column">
              <span>{activeMessage?.text ?? ""}</span>
            </div>
          }
        />
        <ModalRow title="Respuesta" text={<AnswerBox />} />
      </AdminModal>
    </TeacherLayout>
  );
};
