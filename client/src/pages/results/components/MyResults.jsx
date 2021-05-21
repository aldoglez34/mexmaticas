import React from "react";
import { array } from "prop-types";
import { Alert, Row, Col } from "react-bootstrap";
import WrongAnswer from "./WrongAnswer";
import { ImageFromFirebase } from "../../../adminpages/components";

export const MyResults = React.memo(({ results }) => {
  return (
    <div className="mt-4">
      <h4 className="mb-3">Tus respuestas fueron...</h4>
      {results.map((q) => {
        return q.qCorrectAnswers.answer === q.userAnswers.answer ? (
          <Alert className="shadow-sm" key={q._id} variant="success">
            <Row>
              <Col>
                <strong>
                  <i className="fas fa-check mr-1" />
                  CORRECTO
                </strong>
                {/* TECHNICAL INSTRUCTION */}
                <div className="d-flex flex-column my-2">
                  <span className="text-break">{q.qInstruction}</span>
                  {q.qTechnicalInstruction ? (
                    q.qTechnicalInstruction.type === "text" ? (
                      <span>{q.qTechnicalInstruction.text}</span>
                    ) : (
                      <ImageFromFirebase
                        className="mb-2"
                        path={q.qTechnicalInstruction.imageLink}
                        width="150"
                        height="150"
                        rounded
                      />
                    )
                  ) : null}
                </div>
                {/* USER ANSWERS */}
                <div className="d-flex flex-column">
                  <strong className="mb-2">Tu respuesta:</strong>
                  {q.userAnswers.type === "text" ? (
                    <span>{q.userAnswers.answer}</span>
                  ) : (
                    <ImageFromFirebase
                      path={q.userAnswers.answer}
                      className="my-2 mb-3"
                      width="50"
                      height="50"
                      rounded
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Alert>
        ) : (
          <WrongAnswer
            key={q._id}
            qInstruction={q.qInstruction}
            qTechnicalInstruction={q.qTechnicalInstruction}
            userAnswers={q.userAnswers}
            qCorrectAnswers={q.qCorrectAnswers}
          />
        );
      })}
    </div>
  );
});

MyResults.propTypes = {
  results: array.isRequired,
};

MyResults.displayName = "MyResults";
