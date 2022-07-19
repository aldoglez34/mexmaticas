import React, { memo, useEffect, useState } from "react";
import { Accordion, Button, Card, Col, Row } from "react-bootstrap";
import { array, object } from "prop-types";
import { DifficultyStars, FreestyleCard, NotAvailableBttn } from "..";
import { useDispatch, useSelector } from "react-redux";
import * as examActions from "../../../../redux/actions/exam";
import { isEqual } from "lodash";
import cn from "classnames";

import styles from "./examsaccordion.module.scss";

export const ExamsAccordion = memo(
  ({ exams, freestyle, reward, topicId, topicName }) => {
    const [selected, setSelected] = useState();

    const dispatch = useDispatch();
    const exam = useSelector((state) => state.exam);

    useEffect(() => {
      if (!exam) return;
      if (exam.name !== "Modo Rápido") window.location.href = "/course/exam";
    }, [exam]);

    const ArrowIcon = ({ isOpen }) => {
      if (isOpen)
        return <i className={cn("fas fa-chevron-up", styles.arrowIcon)} />;
      if (!isOpen)
        return <i className={cn("fas fa-chevron-down", styles.arrowIcon)} />;
    };

    const Toggle = ({ exam, index }) => {
      const { hasPerfectGrade, highestGrade, isAvailable, name } = exam;
      return (
        <>
          <ArrowIcon isOpen={isEqual(selected, index)} />
          <strong style={{ color: "#0f5257" }}>{name}</strong>
          {highestGrade >= 8 && (
            <i
              className="fas fa-check-circle text-warning ml-2"
              title="Aprobado"
            />
          )}
          {hasPerfectGrade && (
            <i
              className="fas fa-crown text-warning ml-2"
              title="Calificación perfecta"
            />
          )}{" "}
          {!isAvailable && (
            <i className="fas fa-lock ml-2 text-danger" title="Bloqueado" />
          )}
        </>
      );
    };

    const UnderConstruction = () => (
      <div className={cn("text-center", styles.underConstructionDiv)}>
        <h4 className="mb-3">En construcción...</h4>
        <i
          className={cn(
            "fas fa-exclamation-triangle text-warning",
            styles.underConstruction
          )}
        />
      </div>
    );

    const CardContent = ({ exam }) => {
      const { qCounter, questions } = exam;
      const isUnderConstruction = qCounter > questions;
      if (isUnderConstruction) return <UnderConstruction />;
      return (
        <div className="p-4">
          <h2 className="mb-2">{exam.name}</h2>
          <DifficultyStars difficulty={exam.difficulty} />
          <p className="mb-2">
            <strong>{exam.description}</strong>
          </p>
          {/* <LastVisited date={exam.latestAttempt} /> */}
          {/* <br />
          <span style={{ fontSize: "14px" }} title="Duración">
            <i className="fas fa-stopwatch mr-2" />
            {exam.duration + " minutos"}
          </span>
          <br />
          <span style={{ fontSize: "14px" }} title="Número de preguntas">
            <i className="fas fa-flag-checkered mr-2" />
            {exam.qCounter + " preguntas"}
          </span> */}
          <Row className="mb-2">
            <Col className="text-center">
              <strong
                className="mb-0 rounded text-light px-3 bg-info"
                style={{ fontSize: 45 }}
              >
                <span title="Calificación más alta">{exam.highestGrade}</span>
              </strong>
              <span className="d-block">Calificación</span>
            </Col>
            <Col className="text-center">
              <strong
                className="mb-0 rounded text-light px-3 bg-info"
                style={{ fontSize: 45 }}
              >
                <span title="Número de intentos">{exam.attemptsCounter}</span>
              </strong>
              <span className="d-block">Intentos</span>
            </Col>
          </Row>
          {exam.isAvailable ? (
            <Button
              className="shadow genericButton"
              onClick={() => handleBeginExam(exam)}
            >
              Iniciar
            </Button>
          ) : (
            <NotAvailableBttn />
          )}
        </div>
      );
    };

    const handleBeginExam = (exam) => {
      const { _id, name, difficulty, duration, qCounter } = exam;
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

    return (
      <Accordion className="shadow-sm">
        {exams
          .sort((a, b) => a.examOrderNumber - b.examOrderNumber)
          .map((exam, idx) => (
            <React.Fragment key={idx}>
              <Card>
                <Card.Header className={styles.cardHeader}>
                  <Accordion.Toggle
                    as={Button}
                    className={cn("p-0 text-left", styles.accordionToggle)}
                    eventKey={idx}
                    variant="link"
                    onClick={() =>
                      setSelected(!isEqual(selected, idx) ? idx : null)
                    }
                  >
                    <Toggle
                      {...{
                        exam,
                        index: idx,
                        key: idx,
                      }}
                    />
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={idx}>
                  <Card.Body className="p-0">
                    <CardContent {...{ exam }} />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              {/* only show freestyle if student has the reward AND it has to be the last card */}
              {isEqual(exams.length, idx + 1) && freestyle.isAvailable && (
                <FreestyleCard
                  topicName={topicName}
                  topicId={topicId}
                  freestyle={freestyle}
                />
              )}
            </React.Fragment>
          ))}
      </Accordion>
    );
  }
);

ExamsAccordion.propTypes = {
  exams: array.isRequired,
  freestyle: object.isRequired,
  reward: object.isRequired,
};

ExamsAccordion.displayName = "ExamsAccordion";
