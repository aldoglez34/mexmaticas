import React from "react";
import { StudentLayout } from "../../components";
import { Col, Container, Row } from "react-bootstrap";
import { LoginForm } from "./components";
import cn from "classnames";

import styles from "./loginpage.module.scss";

export const LoginPage = () => (
  <StudentLayout isContainer={false}>
    <Container className={styles.log_container}>
      <Row className="px-0 px-lg-3">
        <Col lg={6} className={cn("d-flex flex-column", styles.log_leftCol)}>
          <h2 className="display-3 mb-0 text-light" style={{ fontWeight: 700 }}>
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
        <Col lg={6} className={styles.log_rightCol}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  </StudentLayout>
);
