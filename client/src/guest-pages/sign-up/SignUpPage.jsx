import React from "react";
import { GuestLayout } from "../../components";
import { Col, Container, Row } from "react-bootstrap";
import { SignUpForm } from "./components";
import cn from "classnames";

import styles from "./signuppage.scss";

export const SignUpPage = () => (
  <GuestLayout>
    <Container className={styles.su_container}>
      <Row className="px-0 px-lg-3">
        <Col lg={6} className={cn("d-flex flex-column", styles.su_leftCol)}>
          <h1 className={cn("mb-1 display-3 text-light", styles.su_title)}>
            Registro.
          </h1>
          <h1 className={cn("mb-3 text-light", styles.su_title)}>
            Aprende matemáticas con nosotros.
          </h1>
          <p className="text-light mt-auto">
            ¿Ya tienes cuenta? Entra
            <a href="/login" className="text-warning ml-1">
              aquí.
            </a>
          </p>
        </Col>
        <Col lg={6} className={styles.su_rightCol}>
          <SignUpForm />
        </Col>
      </Row>
    </Container>
  </GuestLayout>
);
