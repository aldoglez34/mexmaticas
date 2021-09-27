import React, { useState } from "react";
import { Formik, ErrorMessage } from "formik";
import { Alert, Button, Col, Form, Modal } from "react-bootstrap";
import * as yup from "yup";
import { useForgotPassword } from "../hooks/login";
import cn from "classnames";

import styles from "./ForgotPassword.module.scss";

export const ForgotPassword = () => {
  const [show, setShow] = useState(false);
  const [emailToRecover, setEmailToRecover] = useState();

  const forgotPassword = useForgotPassword();

  const handleShowModal = () => setShow((prevState) => setShow(!prevState));

  const handleOnHide = () => {
    handleShowModal();
    setEmailToRecover();
  };

  const yupSchema = yup.object({
    email: yup
      .string()
      .email("Formato de email incorrecto")
      .required("Requerido"),
  });

  return (
    <>
      <div className="text-right mt-2">
        <small
          className={cn("text-success", styles.link)}
          onClick={handleShowModal}
        >
          ¿Olvidaste tu contraseña?
        </small>
      </div>
      <Modal show={show} onHide={handleOnHide}>
        <Modal.Body className="bg-light rounded shadow py-4">
          <h5 className="text-dark my-3">
            Ingresa tu cuenta para enviarte un correo de recuperación de
            contraseña:
          </h5>
          {emailToRecover && (
            <Alert className="mt-4" variant="success">
              <span>{`Se ha enviado el correo a ${emailToRecover}`}</span>
            </Alert>
          )}
          <div className="mt-3">
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={yupSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                setEmailToRecover(values.email);

                await forgotPassword(values.email);
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
                      <Form.Label>
                        <strong>Correo</strong>
                        <strong className="ml-1 text-danger" title="Requerido">
                          *
                        </strong>
                      </Form.Label>
                      <Form.Control
                        isValid={touched.email && !errors.email}
                        maxLength="50"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="ejemplo@email.com"
                        type="email"
                        value={values.email}
                      />
                      <ErrorMessage
                        className="text-danger"
                        name="email"
                        component="div"
                      />
                    </Form.Group>
                  </Form.Row>
                  <Button
                    block
                    className="shadow-sm mt-2 genericButton"
                    disabled={emailToRecover ?? isSubmitting}
                    size="lg"
                    type="submit"
                  >
                    Enviar
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
