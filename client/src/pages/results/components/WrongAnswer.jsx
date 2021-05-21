import React from "react";
import { Row, Col, OverlayTrigger, Popover, Alert } from "react-bootstrap";
import { object, string } from "prop-types";
import { ImageFromFirebase } from "../../../adminpages/components";

const WrongAnswer = React.memo(
  ({ qInstruction, qTechnicalInstruction, userAnswers, qCorrectAnswers }) => {
    const popover = (
      <Popover>
        <Popover.Title
          as="h3"
          className="text-light"
          style={{ backgroundColor: "#0d2129" }}
        >
          Respuesta correcta
        </Popover.Title>
        <Popover.Content as="h3">
          {qCorrectAnswers.type === "text" ? (
            <span>{qCorrectAnswers.answer}</span>
          ) : (
            <div className="text-center">
              <ImageFromFirebase
                className="my-2"
                path={qCorrectAnswers.answer}
                width="50"
                height="50"
                rounded
              />
            </div>
          )}
        </Popover.Content>
      </Popover>
    );

    return (
      <OverlayTrigger placement="top" trigger="click" overlay={popover}>
        <Alert
          className="shadow-sm"
          variant="danger"
          style={{ cursor: "pointer" }}
          title="Haz clic para ver respuesta correcta"
        >
          <Row>
            <Col>
              <strong>
                <i className="fas fa-times mr-1" />
                INCORRECTO
              </strong>
              <br />
              <span className="text-break">{qInstruction}</span>
              {qTechnicalInstruction ? (
                qTechnicalInstruction.type === "text" ? (
                  <>
                    <br />
                    <span className="my-2">{qTechnicalInstruction.text}</span>
                  </>
                ) : (
                  <>
                    <br />
                    <ImageFromFirebase
                      className="my-2"
                      path={qTechnicalInstruction.imageLink}
                      width="150"
                      height="150"
                      rounded
                    />
                  </>
                )
              ) : null}
              {/* YOUR ANSWERS */}
              <br />
              <strong className="mr-2">Tu respuesta:</strong>
              <br />
              {userAnswers.type === "text" ? (
                <span>{userAnswers.answer}</span>
              ) : (
                <ImageFromFirebase
                  path={userAnswers.answer}
                  className="my-2"
                  width="50"
                  height="50"
                  rounded
                />
              )}
            </Col>
          </Row>
        </Alert>
      </OverlayTrigger>
    );
  }
);

WrongAnswer.propTypes = {
  qCorrectAnswers: object.isRequired,
  qInstruction: string.isRequired,
  qTechnicalInstruction: object,
  userAnswers: object.isRequired,
};

WrongAnswer.displayName = "WrongAnswer";

export default WrongAnswer;
