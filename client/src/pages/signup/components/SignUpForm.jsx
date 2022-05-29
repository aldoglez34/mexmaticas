import React, { useState } from "react";
import { Formik, ErrorMessage } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { useSignUpUser } from "../hooks/signUp";

export const SignUpForm = () => {
  const [emailToVerify, setEmailToVerify] = useState();

  const { signUpUser } = useSignUpUser();

  const yupSchema = yup.object({
    email: yup
      .string()
      .email("Formato de email incorrecto")
      .required("Requerido"),
    name: yup
      .string()
      .min(2, "Debe ser más largo que 2 letras")
      .matches(
        /^[a-zA-Z-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ ]+$/,
        "Sólo letras"
      )
      .matches(/^(?!admin\b)/i, "Nombre inválido")
      .matches(/^(?!teacher\b)/i, "Nombre inválido")
      .required("Requerido"),
    firstSurname: yup
      .string()
      .min(2, "Debe ser más largo que 2 letras")
      .matches(
        /^[a-zA-Z-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ ]+$/,
        "Sólo letras"
      )
      .matches(/^(?!admin\b)/i, "Apellido inválido")
      .matches(/^(?!teacher\b)/i, "Apellido inválido")
      .required("Requerido"),
    secondSurname: yup
      .string()
      .min(2, "Debe ser más largo que 2 letras")
      .matches(
        /^[a-zA-Z-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ ]+$/,
        "Sólo letras"
      )
      .required("Requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        name: "",
        firstSurname: "",
        secondSurname: "",
        password: "",
      }}
      validationSchema={yupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        const { isError } = await signUpUser(values);

        if (isError) {
          setSubmitting(false);
        }

        if (!isError) {
          setEmailToVerify(values.email);
        }
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
        <>
          {emailToVerify && (
            <Alert className="mb-3" variant="success">
              <span>
                Se ha enviado un correo de verificación a <b>{emailToVerify}</b>
              </span>
            </Alert>
          )}
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
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Nombre(s)</strong>
                  <strong className="ml-1 text-danger" title="Requerido">
                    *
                  </strong>
                </Form.Label>
                <Form.Control
                  maxLength="50"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.name && !errors.name}
                />
                <ErrorMessage
                  className="text-danger"
                  name="name"
                  component="div"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  <strong>Apellido Paterno</strong>
                  <strong className="ml-1 text-danger" title="Requerido">
                    *
                  </strong>
                </Form.Label>
                <Form.Control
                  maxLength="50"
                  type="text"
                  name="firstSurname"
                  value={values.firstSurname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.firstSurname && !errors.firstSurname}
                />
                <ErrorMessage
                  className="text-danger"
                  name="firstSurname"
                  component="div"
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  <strong>Apellido Materno</strong>
                  <strong className="ml-1 text-danger" title="Requerido">
                    *
                  </strong>
                </Form.Label>
                <Form.Control
                  maxLength="50"
                  type="text"
                  name="secondSurname"
                  value={values.secondSurname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.secondSurname && !errors.secondSurname}
                />
                <ErrorMessage
                  className="text-danger"
                  name="secondSurname"
                  component="div"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Contraseña</strong>
                  <strong className="ml-1 text-danger" title="Requerido">
                    *
                  </strong>
                  <br />
                  <small className="text-muted">
                    La contraseña deben tener por lo menos 6 caracteres
                  </small>
                </Form.Label>
                <Form.Control
                  maxLength="25"
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
              block
              className="shadow-sm mt-2 genericButton"
              disabled={emailToVerify ?? isSubmitting}
              size="lg"
              type="submit"
            >
              Registrarme
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};
