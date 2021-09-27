import React from "react";
import { Layout } from "../../components/Layout";
import { Col, Container, Row } from "react-bootstrap";
import { LoginForm } from "./components";
import "./loginpage.scss";

export const LoginPage = () => {
  return (
    <Layout>
      <Container id="log_container">
        <Row className="px-0 px-lg-3">
          <Col lg={6} id="log_leftCol" className="d-flex flex-column">
            <h2
              className="display-3 mb-0 text-light"
              style={{ fontWeight: 700 }}
            >
              Hola,
            </h2>
            <h2 className="text-light">¡Qué bueno verte de vuelta!</h2>
            <p className="text-light mt-auto">
              ¿No tienes cuenta? Crea una
              <a href="/signup" className="text-warning ml-1">
                aquí.
              </a>
            </p>
          </Col>
          <Col lg={6} id="log_rightCol">
            <LoginForm />
            {/* <strong className="d-block pt-4">
              Inicia sesión con alguna de tus cuentas:
            </strong>
            <div className="d-flex justify-content-between mt-3">
              <Button className="shadow-sm" variant="primary" block>
                <i
                  className="fab fa-facebook"
                  style={{ fontSize: "25px", paddingTop: "3px" }}
                />
              </Button>
              <Button className="shadow-sm mt-0" variant="light" block>
                <i
                  className="fab fa-google"
                  style={{ fontSize: "23px", paddingTop: "3px" }}
                />
              </Button>
              <Button className="shadow-sm mt-0" variant="dark" block>
                <i
                  className="fab fa-apple"
                  style={{ fontSize: "25px", paddingTop: "3px" }}
                />
              </Button>
            </div> */}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
