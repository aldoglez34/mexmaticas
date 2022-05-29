import React, { useEffect } from "react";
import { AdminLayout } from "../components";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { newCourse } from "../../services";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminNewCoursePage = () => {
  const dispatch = useDispatch();

  const yupschema = yup.object({
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
    school: yup
      .string()
      .notOneOf(["Elige..."], "Requerido")
      .required("Requerido"),
    description: yup.string().required("Requerido"),
    summary: yup.string().required("Requerido"),
    price: yup
      .number()
      .positive("El número debe ser mayor a 1")
      .required("Requerido"),
  });

  useEffect(() => {
    dispatch(setTitle("Nuevo Curso"));
  }, [dispatch]);

  return (
    <AdminLayout leftBarActive="Cursos" backBttn="/admin/courses">
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <h3 className="mb-3">Ingresa los datos del curso.</h3>
            <Formik
              initialValues={{
                name: "",
                school: "",
                description: "",
                summary: "",
                price: "",
              }}
              validationSchema={yupschema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);

                newCourse(values)
                  .then((res) => {
                    const { courseId } = res.data;
                    const newRoute = `/admin/courses/edit/${courseId}`;
                    window.location.href = newRoute;
                  })
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
                  {/* name and school */}
                  <Form.Row>
                    <Col md="7">
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
                    <Col md="5">
                      <Form.Label>
                        Nivel escolar<strong className="text-danger">*</strong>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        type="text"
                        name="school"
                        defaultValue="Elige..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.school && !errors.school}
                        isInvalid={touched.school && !!errors.school}
                      >
                        <option disabled>Elige...</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Preparatoria">Preparatoria</option>
                        <option value="Universidad">Universidad</option>
                      </Form.Control>
                      <ErrorMessage
                        className="text-danger"
                        name="school"
                        component="div"
                      />
                    </Col>
                  </Form.Row>
                  {/* description */}
                  <Form.Row className="mt-3">
                    <Col>
                      <Form.Label>
                        Descripción<strong className="text-danger">*</strong>
                      </Form.Label>
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
                  {/* topics summary */}
                  <Form.Row className="mt-3">
                    <Col>
                      <Form.Label className="mb-0">
                        Resumen
                        <small className="text-muted ml-1">
                          (para el landing page)
                        </small>
                        <strong className="text-danger">*</strong>
                      </Form.Label>
                      <Form.Text className="text-muted mb-2">
                        Separados por coma
                      </Form.Text>
                      <Form.Control
                        maxLength="250"
                        type="text"
                        name="summary"
                        value={values.summary}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.summary && !errors.summary}
                        isInvalid={touched.summary && !!errors.summary}
                      />
                      <ErrorMessage
                        className="text-danger"
                        name="summary"
                        component="div"
                      />
                    </Col>
                  </Form.Row>
                  {/* price */}
                  <Form.Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>
                        Precio
                        <strong className="text-danger">*</strong>
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="number"
                          placeholder="0.00"
                          name="price"
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.price && !errors.price}
                          isInvalid={touched.price && !!errors.price}
                        />
                      </InputGroup>
                      <ErrorMessage
                        className="text-danger"
                        name="price"
                        component="div"
                      />
                    </Col>
                  </Form.Row>
                  {/* buttons */}
                  <Form.Group className="mt-4">
                    <Button
                      variant="dark"
                      type="submit"
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
