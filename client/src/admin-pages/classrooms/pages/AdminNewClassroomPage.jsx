import React, { useEffect, useState } from "react";
import { AdminLayout, AdminSpinner, Button } from "../../../components";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { Col, Form } from "react-bootstrap";
import { fetchInstitutions, newClassroom } from "../../../services";

export const AdminNewClassroomPage = () => {
  const [institutions, setInstitutions] = useState();

  const yupschema = yup.object({
    institution: yup.string(),
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
    school: yup.string(),
    description: yup.string(),
  });

  useEffect(() => {
    fetchInstitutions()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          String(a.name).toUpperCase().trim() <
          String(b.name).toUpperCase().trim()
            ? -1
            : 1
        );
        setInstitutions(defaultSorting);
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, []);

  return (
    <AdminLayout
      backBttn="/admin/classrooms"
      leftBarActive="Salones"
      topNavTitle="Nuevo Salón"
    >
      <h3 className="mb-3">Ingresa los datos del salón.</h3>
      {institutions ? (
        <Formik
          initialValues={{
            institution: "",
            name: "",
            school: "",
            description: "",
          }}
          validationSchema={yupschema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);

            newClassroom(values)
              .then(() => (window.location.href = "/admin/classrooms"))
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
              {/* institution */}
              <Form.Row>
                <Col>
                  <Form.Label>Escuela</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    name="institution"
                    defaultValue="Elige..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.institution && !errors.institution}
                    isInvalid={touched.institution && !!errors.institution}
                  >
                    <option>Elige...</option>
                    {institutions.length &&
                      institutions.map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.name}
                        </option>
                      ))}
                  </Form.Control>
                  <ErrorMessage
                    className="text-danger"
                    name="institution"
                    component="div"
                  />
                </Col>
              </Form.Row>
              {/* name and school */}
              <Form.Row className="mt-3">
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
                  <Form.Label>Nivel escolar</Form.Label>
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
                    <option>Elige...</option>
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
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  isSubmit
                />
              </Form.Group>
            </Form>
          )}
        </Formik>
      ) : (
        <AdminSpinner />
      )}
    </AdminLayout>
  );
};
