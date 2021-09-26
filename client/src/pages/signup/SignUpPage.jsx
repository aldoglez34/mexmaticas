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
            <h1 className="mb-1 display-3 text-light su_title">Registro.</h1>
            <h1 className="mb-3 text-light su_title">
              Aprende matemáticas con nosotros.
            </h1>
            <p className="text-light mt-auto">
              ¿Ya tienes cuenta? Entra
              <a href="/login" className="text-warning ml-1">
                aquí.
              </a>
            </p>
          </Col>
          <Col lg={6} id="su_rightCol">
            <SignUpForm />
            {/* <strong className="d-block pt-4">
              Regístrate usando alguna de tus cuentas:
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
