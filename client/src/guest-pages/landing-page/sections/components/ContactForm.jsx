import React from "react";
import { Form, Col, Button } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { postMessage } from "../../../../services";

export const ContactForm = () => {
  const yupschema = yup.object({
    name: yup.string().required("Requerido"),
    email: yup.string().email("Formato inválido").required("Requerido"),
    subject: yup.string().required("Requerido"),
    body: yup.string().required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        subject: "",
        body: "",
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.source = "Inicio";
        postMessage(values)
          .then((res) => {
            // console.log(res);
            alert(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
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
          {/* user */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Nombre<strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                maxLength="150"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.name && !errors.name}
                isInvalid={touched.name && !!errors.name}
              />
              <ErrorMessage
                className="text-danger"
                name="name"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* email */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Correo<strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                maxLength="150"
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.email && !errors.email}
                isInvalid={touched.email && !!errors.email}
              />
              <ErrorMessage
                className="text-danger"
                name="email"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* subject */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Asunto<strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                as="select"
                defaultValue="Elige..."
                type="text"
                name="subject"
                // value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.subject && !errors.subject}
                isInvalid={touched.subject && !!errors.subject}
              >
                <option disabled>Elige...</option>
                <option value="Información sobre un curso">
                  Información sobre un curso
                </option>
                <option value="Información sobre costos">
                  Información sobre costos
                </option>
                <option value="Otro">Otro</option>
              </Form.Control>
              <ErrorMessage
                className="text-danger"
                name="subject"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* cuerpo */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Mensaje<strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                maxLength="250"
                as="textarea"
                rows="3"
                type="text"
                name="body"
                value={values.body}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.body && !errors.body}
                isInvalid={touched.body && !!errors.body}
              />
              <ErrorMessage
                className="text-danger"
                name="body"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* buttons */}
          <Form.Group>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="genericButton"
            >
              Enviar
            </Button>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};
