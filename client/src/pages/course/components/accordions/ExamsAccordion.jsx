import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col, Row } from "react-bootstrap";
import { array, object } from "prop-types";
import {
  DifficultyStars,
  FreestyleCard,
  LastVisited,
  NotAvailableBttn,
} from "..";
import { useDispatch, useSelector } from "react-redux";
import * as examActions from "../../../../redux/actions/exam";
import cn from "classnames";

import styles from "./examsaccordion.module.scss";

export const ExamsAccordion = React.memo(
  ({ exams, freestyle, reward, topicId, topicName }) => {
    const dispatch = useDispatch();

    const [selected, setSelected] = useState();

    const exam = useSelector((state) => state.exam);

    const handleBeginExam = (_id, name, difficulty, duration, qCounter) => {
      dispatch(
        examActions.setExam({
          _id,
          difficulty,
          duration,
          name,
          qCounter,
          reward,
          topicId,
          topicName,
        })
      );
    };

    useEffect(() => {
      if (exam && exam.name !== "Modo Rápido")
        window.location.href = "/course/exam";
    }, [exam]);

    return (
      <Accordion className="shadow-sm">
        {exams
          .sort((a, b) => a.examOrderNumber - b.examOrderNumber)
          .map((ex, idx) => {
            const icon =
              selected === idx
                ? "fas fa-chevron-up mr-2"
                : "fas fa-chevron-down mr-2";
            return (
              <React.Fragment key={idx}>
                <Card>
                  <Card.Header style={{ backgroundColor: "#e7edee" }}>
                    <Accordion.Toggle
                      as={Button}
                      className="p-0"
                      eventKey={idx}
                      style={{ boxShadow: "none", textDecoration: "none" }}
                      variant="link"
                      onClick={() => {
                        if (selected !== idx) {
                          setSelected(idx);
                        } else {
                          setSelected();
                        }
                      }}
                    >
                      <i className={icon} style={{ color: "#48bf84" }} />
                      <strong style={{ color: "#0f5257" }}>{ex.name}</strong>
                      {/* exam cheked (passed) */}
                      {ex.highestGrade >= 8 ? (
                        <i
                          className="fas fa-check-circle text-warning ml-2"
                          title="Aprobado"
                        />
                      ) : null}
                      {/* crown for perfect grade */}
                      {ex.hasPerfectGrade ? (
                        <i
                          className="fas fa-crown text-warning ml-2"
                          title="Calificación perfecta"
                        />
                      ) : null}
                      {/* locked exam */}
                      {ex.isAvailable ? null : (
                        <i
                          className="fas fa-lock ml-2 text-danger"
                          title="Bloqueado"
                        />
                      )}
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={idx}>
                    <Card.Body className="p-0">
                      {Number(ex.qCounter) <= Number(ex.questions) ? (
                        <div className="p-4">
                          <h2 className="mb-2">{ex.name}</h2>
                          <DifficultyStars difficulty={ex.difficulty} />
                          <p className="mb-2 mt-2">
                            <strong style={{ fontSize: "14px" }}>
                              {ex.description}
                            </strong>
                          </p>
                          <LastVisited date={ex.latestAttempt} />
                          <br />
                          <span style={{ fontSize: "14px" }} title="Duración">
                            <i className="fas fa-stopwatch mr-2" />
                            {ex.duration + " minutos"}
                          </span>
                          <br />
                          <span
                            style={{ fontSize: "14px" }}
                            title="Número de preguntas"
                          >
                            <i className="fas fa-flag-checkered mr-2" />
                            {ex.qCounter + " preguntas"}
                          </span>
                          <Row className="my-3">
                            <Col className="text-center">
                              <h1 className="mb-0" style={{ color: "#48bf84" }}>
                                <span title="Calificación más alta">
                                  {ex.highestGrade}
                                </span>
                              </h1>
                              <h4>
                                <small className="text-muted">
                                  Calificación
                                </small>
                              </h4>
                            </Col>
                            <Col className="text-center">
                              <h1 className="mb-0" style={{ color: "#48bf84" }}>
                                <span title="Número de intentos">
                                  {ex.attemptsCounter}
                                </span>
                              </h1>
                              <h4>
                                <small className="text-muted">Intentos</small>
                              </h4>
                            </Col>
                          </Row>
                          {ex.isAvailable ? (
                            <Button
                              onClick={() =>
                                handleBeginExam(
                                  ex._id,
                                  ex.name,
                                  ex.difficulty,
                                  ex.duration,
                                  ex.qCounter
                                )
                              }
                              className="shadow-sm genericButton"
                            >
                              Iniciar
                            </Button>
                          ) : (
                            <NotAvailableBttn />
                          )}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "text-center",
                            styles.underConstruction
                          )}
                        >
                          <h4 className="mb-3">En construcción...</h4>
                          <i
                            className="fas fa-exclamation-triangle text-warning"
                            style={{ fontSize: "80px" }}
                          />
                        </div>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                {/* only show freestyle if student has the reward AND it has to be the last card */}
                {exams.length === idx + 1 && freestyle.isAvailable ? (
                  <FreestyleCard
                    topicName={topicName}
                    topicId={topicId}
                    freestyle={freestyle}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
      </Accordion>
    );
  }
);

ExamsAccordion.propTypes = {
  exams: array.isRequired,
  freestyle: object.isRequired,
  reward: object.isRequired,
};
