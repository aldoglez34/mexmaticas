import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import { AdminLayout } from "../../../components";
import { newTopic } from "../../../services";
import { useSelector } from "react-redux";
import { firebaseStorage } from "../../../firebase/firebase";
import { IMAGES } from "../../../utils/constants";

export const AdminNewTopicPage = React.memo((props) => {
  const courseName = useSelector((state) => state.admin.course.courseName);
  const courseId = props.routeProps.match.params.courseId;

  const yupschema = yup.object({
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
    subject: yup
      .string()
      .notOneOf(["Elige..."], "Requerido")
      .required("Requerido"),
    description: yup.string().required("Requerido"),
    freestyleTimer: yup
      .number()
      .positive("El número debe ser mayor a 1")
      .required("Requerido"),
    file: yup
      .mixed()
      .required("Requerido")
      .test(
        "fileFormat",
        "Formato no soportado",
        (value) => value && IMAGES.SUPPORTED_FORMATS.includes(value.type)
      ),
  });

  return (
    <AdminLayout
      backBttn={`/admin/courses/edit/${courseId}`}
      leftBarActive="Cursos"
      topNavTitle={courseName}
    >
      <h3 className="mb-3">Ingresa los datos del tema.</h3>
      <Formik
        initialValues={{
          name: "",
          subject: "",
          description: "",
          freestyleTimer: "",
          photo: undefined,
          file: undefined,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          newTopic({ ...values, courseId })
            .then((res) => {
              const { topicId } = res.data;

              const storageRef = firebaseStorage.ref();
              const pathOnFirebaseStorage = `${courseId}/${topicId}/rewards/medal`;
              const fileRef = storageRef.child(pathOnFirebaseStorage);

              fileRef
                .put(values.file)
                .then((res) => {
                  console.log(res);
                  const route = `/admin/courses/edit/topics/${courseId}/${topicId}`;
                  window.location.href = route;
                })
                .catch((err) => {
                  console.log(err);
                  alert(err);
                });
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
          setFieldValue,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {/* name and subject */}
            <Form.Row>
              <Col md={8}>
                <Form.Label>
                  Nombre
                  <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  maxLength="50"
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
              <Col md={4}>
                <Form.Label>
                  Materia
                  <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  as="select"
                  type="text"
                  name="subject"
                  defaultValue="Elige..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.subject && !errors.subject}
                  isInvalid={touched.subject && !!errors.subject}
                >
                  <option disabled>Elige...</option>
                  <option value="Álgebra">Álgebra</option>
                  <option value="Aritmética">Aritmética</option>
                  <option value="Cálculo Diferencial">
                    Cálculo Diferencial
                  </option>
                  <option value="Cálculo Integral">Cálculo Integral</option>
                  <option value="Funciones">Funciones</option>

                  <option value="Geometría">Geometría</option>
                  <option value="Geometría Analítica">
                    Geometría Analítica
                  </option>
                  <option value="Misceláneos">Misceláneos</option>
                  <option value="Pre-Cálculo">Pre-Cálculo</option>
                  <option value="Probabilidad">Probabilidad</option>
                  <option value="Sistema de Medición">
                    Sistema de Medición
                  </option>
                  <option value="Trigonometría">Trigonometría</option>
                </Form.Control>
                <ErrorMessage
                  className="text-danger"
                  name="subject"
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
                  maxLength="500"
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
            {/* reward and freestyle timer */}
            <Form.Row className="mt-3 mb-3">
              <Col md={8}>
                <Form.Label>
                  Medalla
                  <strong className="text-danger">*</strong>
                  <small className="ml-1">(.jpg, .jpeg, .gif y .png)</small>
                </Form.Label>
                {/* the following FORM.FILE only works on "react-bootstrap": "^1.0.0",  */}
                <Form.File
                  encType="multipart/form-data"
                  accept="image/*"
                  label={values.photo ? values.photo : ""}
                  data-browse="Buscar"
                  id="file"
                  name="file"
                  type="file"
                  onChange={(event) => {
                    setFieldValue("file", event.currentTarget.files[0]);
                    setFieldValue(
                      "photo",
                      event.currentTarget.files[0]
                        ? event.currentTarget.files[0].name
                        : ""
                    );
                  }}
                  onBlur={handleBlur}
                  custom
                />
                <ErrorMessage
                  className="text-danger"
                  name="file"
                  component="div"
                />
              </Col>
              <Col md={4}>
                <Form.Label>
                  Modo rápido
                  <strong className="text-danger">*</strong>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="freestyleTimer"
                    value={values.freestyleTimer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.freestyleTimer && !errors.freestyleTimer}
                    isInvalid={
                      touched.freestyleTimer && !!errors.freestyleTimer
                    }
                  />
                  <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">minutos</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                <ErrorMessage
                  className="text-danger"
                  name="freestyleTimer"
                  component="div"
                />
              </Col>
            </Form.Row>
            {/* buttons */}
            <Form.Group className="mt-2">
              <Button variant="dark" type="submit" disabled={isSubmitting}>
                Crear
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </AdminLayout>
  );
});

AdminNewTopicPage.displayName = "AdminNewTopicPage";
