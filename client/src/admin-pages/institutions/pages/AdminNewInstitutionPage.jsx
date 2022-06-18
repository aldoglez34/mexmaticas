import React from "react";
import { AdminLayout } from "../../../components";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { Button, Col, Form } from "react-bootstrap";
import { newInstitution } from "../../../services";

export const AdminNewInstitutionPage = () => {
  const yupschema = yup.object({
    description: yup.string(),
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
  });

  return (
    <AdminLayout
      backBttn="/admin/institutions"
      leftBarActive="Escuelas"
      topNavTitle="Nueva Escuela"
    >
      <h3 className="mb-3">Ingresa los datos de la escuela.</h3>
      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          // setSubmitting(true);

          newInstitution(values)
            .then(() => (window.location.href = "/admin/institutions"))
            .catch((err) => {
              if (err.response && err.response.data) {
                alert(err.response.data);
              } else {
                alert("Ocurrió un error en el servidor");
              }
              setSubmitting(false);
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
            {/* name */}
            <Form.Row>
              <Col>
                <Form.Label>
                  Nombre<strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  maxLength="40"
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
              </Col>
            </Form.Row>
            {/* description */}
            <Form.Row className="mt-3">
              <Col>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  maxLength="1000"
                  as="textarea"
                  rows="4"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.description && !errors.description}
                  isInvalid={touched.description && !!errors.description}
                />
                <ErrorMessage
                  className="text-danger"
                  name="description"
                  component="div"
                />
              </Col>
            </Form.Row>
            {/* buttons */}
            <Form.Group className="mt-4">
              <Button
                variant="dark"
                type="submit"
                className="shadow-sm"
                disabled={isSubmitting}
              >
                Crear
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </AdminLayout>
  );
};
