import React, { useState, useEffect } from "react";
import { AdminLayout, AdminSpinner } from "../components";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { ItemModal } from "./components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminMessagesPage = () => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState();
  const [filtered, setFiltered] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    dispatch(setTitle("Mensajes"));

    TeacherAPI.t_fetchMessages()
      .then((res) => {
        setMessages(res.data);
        setFiltered(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const filterMessages = (criteria) => {
    switch (criteria) {
      case "New":
        setFilter(criteria === filter ? null : criteria);
        setFiltered(
          criteria === filter ? messages : messages.filter((msg) => !msg.seen)
        );
        break;
      default:
        setFilter(criteria === filter ? null : criteria);
        setFiltered(
          criteria === filter
            ? messages
            : messages.filter((msg) => msg.source === criteria)
        );
    }
  };

  const filters = (
    <div className="d-flex">
      <Button
        disabled={messages ? false : true}
        active={filter === "New" ? true : false}
        variant="outline-light"
        className="shadow-sm"
        onClick={() => filterMessages("New")}
      >
        Nuevos
      </Button>
      <Button
        disabled={messages ? false : true}
        active={filter === "Inicio" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterMessages("Inicio")}
      >
        Inicio
      </Button>
      <Button
        disabled={messages ? false : true}
        active={filter === "Tema" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterMessages("Tema")}
      >
        Tema
      </Button>
      <Button
        disabled={messages ? false : true}
        active={filter === "Pregunta" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterMessages("Pregunta")}
      >
        Pregunta
      </Button>
    </div>
  );

  return filtered ? (
    <AdminLayout leftBarActive="Mensajes" buttons={filters}>
      <Container fluid>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {filtered.length ? (
              <>
                <h3 className="mb-3" style={{ color: "#0f5257" }}>
                  Selecciona un mensaje para ver su contenido...
                </h3>
                <ListGroup>
                  {filtered.map((m) => (
                    <ItemModal key={m._id} message={m} />
                  ))}
                </ListGroup>
              </>
            ) : (
              <div className="text-center mt-4">No hay mensajes.</div>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
