import React, { useEffect } from "react";
import { AdminLayout } from "../components";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminNewInstitutionPage = () => {
  const dispatch = useDispatch();

  const yupschema = yup.object({
    description: yup.string(),
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
  });

  useEffect(() => {
    dispatch(setTitle("Nueva Escuela"));
  }, [dispatch]);

  return (
    <AdminLayout leftBarActive="Escuelas" backBttn="/admin/institutions">
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <h3 className="mb-3">Ingresa los datos de la escuela.</h3>
            <Formik
              initialValues={{
                name: "",
                description: "",
              }}
              validationSchema={yupschema}
              onSubmit={(values, { setSubmitting }) => {
                // setSubmitting(true);

                TeacherAPI.t_newInstitution(values)
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
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};
