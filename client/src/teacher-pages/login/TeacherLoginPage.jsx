import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { firebaseAuth } from "../../firebase/firebase";
import fbApp from "firebase/app";
import cn from "classnames";
import { errorLogger } from "../../errors/errorLogger";
import { fetchTeacherInfo } from "../../services";
import { useDispatch } from "react-redux";
import { loginTeacher } from "../../redux/actions/teacher";

import styles from "./teacherLoginPage.module.scss";

export const TeacherLoginPage = () => {
  const dispatch = useDispatch();

  const loginSchema = yup.object({
    email: yup.string().email("Formato inválido").required("Requerido"),
    password: yup.string().min(6, "Longitud incorrecta").required("Requerido"),
  });

  return (
    <Container fluid className={cn("h-100", styles.container)}>
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <h1 className={cn("my-4", "py-3", "text-center", styles.logo)}>
            MeXmáticas
            <small className="d-block">[ maestro ]</small>
          </h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              try {
                await fetchTeacherInfo(values.email).then((res) =>
                  dispatch(loginTeacher(res.data))
                );
                await firebaseAuth.setPersistence(
                  fbApp.auth.Auth.Persistence.SESSION
                );
                await firebaseAuth.signInWithEmailAndPassword(
                  values.email,
                  values.password
                );
              } catch (err) {
                errorLogger(err);
              }
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label className="text-light">
                      Correo electrónico
                      <strong className="ml-1 text-danger" title="Requerido">
                        *
                      </strong>
                    </Form.Label>
                    <Form.Control
                      maxLength="100"
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.email && !errors.email}
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="email"
                      component="div"
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label className="text-light">
                      Contraseña
                      <strong className="ml-1 text-danger" title="Requerido">
                        *
                      </strong>
                    </Form.Label>
                    <Form.Control
                      maxLength="15"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.password && !errors.password}
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="password"
                      component="div"
                    />
                  </Form.Group>
                </Form.Row>
                <Button
                  className={cn("mt-3", "shadow-sm", styles.button)}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Entrar
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};