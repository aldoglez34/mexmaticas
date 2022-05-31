import React from "react";
import { ErrorMessage, Formik } from "formik";
import { Button, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { useLoginUser } from "../hooks/login";
import { ForgotPassword } from ".";

export const LoginForm = () => {
  const { loginUser } = useLoginUser();

  const yupSchema = yup.object({
    email: yup
      .string()
      .email("Formato de email incorrecto")
      .required("Requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={yupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        const { isError } = await loginUser(values);

        if (isError) setSubmitting(false);
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
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                <strong>Contraseña</strong>
                <strong className="ml-1 text-danger" title="Requerido">
                  *
                </strong>
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
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            Entrar
          </Button>
          <ForgotPassword />
        </Form>
      )}
    </Formik>
  );
};
