import React from "react";
import { Layout } from "../../components/Layout";
import { Button, Col, Container, Row } from "react-bootstrap";
import { SignUpForm } from "./components";
import "./signuppage.scss";

export const SignUpPage = () => {
  return (
    <Layout>
      <Container id="su_container">
        <Row className="px-0 px-lg-3">
          <Col lg={6} id="su_leftCol" className="d-flex flex-column">
            <h1 className="mb-1 display-3 text-light su_title">Registro</h1>
            <h1 className="mb-3 text-light su_title">
              Aprende matemáticas con nosotros
            </h1>
            <p className="text-light mt-auto">
              ¿Ya tienes cuenta? Entra
              <a href="/login" className="text-warning ml-1">
                aquí
              </a>
            </p>
          </Col>
          <Col lg={6} id="su_rightCol">
            <SignUpForm />
            <hr className="mt-4" />
            <strong>O inicia sesión con las siguiente cuentas</strong>
            <Row>
              <Col>
                <Button variant="outline-dark">Facebook</Button>
                <Button variant="outline-dark">Google</Button>
                <Button variant="outline-dark">Apple</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
