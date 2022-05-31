import React from "react";
import { Button, Col, Container, Jumbotron, Row } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import "./welcomejumbotron.scss";

export const WelcomeJumbotron = () => {
  return (
    <Jumbotron fluid className="wj_jumboStyle">
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 7 }}>
            {/* title */}
            <Fade bottom cascade>
              <h2 className="text-left wj_title mb-0">MATEMÁTICAS</h2>
              <h2 className="text-left wj_title">SIMPLIFICADAS</h2>
              {/* list */}
              <p className="mb-1 mt-3 mt-lg-0">
                <i className="fas fa-plus-circle wj_plusIcon" />
                <span className="wj_text">
                  Cursos de matemáticas para estudiantes de cualquier grado
                  educativo
                </span>
              </p>
              <p className="mb-1">
                <i className="fas fa-plus-circle wj_plusIcon" />
                <span className="wj_text">
                  Miles de ejercicios con explicaciones y videos tutoriales
                </span>
              </p>
              <p className="mb-1">
                <i className="fas fa-plus-circle wj_plusIcon" />
                <span className="wj_text">
                  Aprendiendo matemáticas a tu propio ritmo y con un método
                  único
                </span>
              </p>
            </Fade>
            {/* button */}
            <Button
              size="lg"
              className="shadow mt-4 wj_registerButton"
              href="/signup"
            >
              Regístrate
            </Button>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
};
