import React, { useEffect } from "react";
import { Card, Button, Accordion, Row, Col } from "react-bootstrap";
import { object, string } from "prop-types";
import { LastVisited } from "./";
import { useDispatch, useSelector } from "react-redux";
import * as examActions from "../../../redux/actions/exam";

export const FreestyleCard = React.memo(({ topicName, topicId, freestyle }) => {
  const dispatch = useDispatch();

  const exam = useSelector((state) => state.exam);

  const handleBeginExam = (duration, name, topicName, topicId) => {
    dispatch(
      examActions.setExam({
        duration,
        name,
        topicName,
        topicId,
      })
    );
  };

  useEffect(() => {
    if (exam && exam.name === "Modo Rápido")
      window.location.href = "/course/freestyle";
  }, [exam]);

  return (
    <Card>
      <Card.Header style={{ backgroundColor: "#e7edee" }}>
        <Accordion.Toggle
          as={Button}
          variant="link"
          eventKey="freestyle"
          className="text-danger p-0"
          style={{ boxShadow: "none", textDecoration: "none" }}
        >
          <i className="fas fa-bolt mr-2" />
          <strong>Modo rápido</strong>
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey="freestyle">
        <Card.Body>
          <h2 className="mb-2">Modo rápido</h2>
          {/* description */}
          <strong style={{ fontSize: "14px" }} className="d-block">
            Contesta la mayor cantidad de preguntas que puedas en{" "}
            {freestyle.timer} minutos.
          </strong>
          <strong style={{ fontSize: "14px" }} className="mb-2 d-block">
            Los mejores 10 resultados serán mostrados en el cuadro de honor.
          </strong>
          {/* last visited */}
          <LastVisited date={freestyle.lastVisit} />
          <br />
          {/* duration */}
          <span style={{ fontSize: "14px" }} title="Duración">
            <i className="fas fa-stopwatch mr-2" />
            {freestyle.timer + " mins."}
          </span>
          <br />
          {/* columns */}
          <Row className="my-3">
            <Col className="text-center">
              <h1 className="mb-0 text-danger">
                <span title="Puntuación más alta">
                  {freestyle.myHighestScore}
                </span>
              </h1>
              <h4>
                <small className="text-muted">Puntos</small>
              </h4>
            </Col>
            <Col className="text-center">
              <h1 className="mb-0 text-danger">
                <span title="Número de intentos">{freestyle.myTryouts}</span>
              </h1>
              <h4>
                <small className="text-muted">Intentos</small>
              </h4>
            </Col>
          </Row>
          {/* button */}
          <Button
            variant="danger"
            className="shadow-sm"
            onClick={() =>
              handleBeginExam(
                freestyle.timer,
                "Modo Rápido",
                topicName,
                topicId
              )
            }
          >
            Iniciar
          </Button>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
});

FreestyleCard.propTypes = {
  freestyle: object.isRequired,
  topicName: string.isRequired,
};

FreestyleCard.displayName = "FreestyleCard";
