import React from "react";
import { Row, Col } from "react-bootstrap";
import { number } from "prop-types";
import "./grade.scss";

export const Grade = React.memo(({ grade, corrects, incorrects }) => {
  return (
    <>
      <h2 className="mt-3">Tu calificación es...</h2>
      {/* calificación */}
      <div
        className="d-flex flex-column rounded justify-content-center align-items-center"
        id="gradecardstyle"
      >
        <h1 className="mb-0" style={{ fontSize: "7rem" }}>
          {grade}
        </h1>
      </div>
      {/* aciertos y errores */}
      <Row className="mt-3">
        <Col className="text-center p-3">
          <strong className="text-muted">ACIERTOS</strong>
          <h1 className="mb-0" style={{ fontSize: "4rem" }}>
            {corrects}
          </h1>
        </Col>
        <Col className="text-center p-3">
          <strong className="text-muted">ERRORES</strong>
          <h1 className="mb-0" style={{ fontSize: "4rem" }}>
            {incorrects}
          </h1>
        </Col>
      </Row>
    </>
  );
});

Grade.propTypes = {
  corrects: number.isRequired,
  grade: number.isRequired,
  incorrects: number.isRequired,
};
