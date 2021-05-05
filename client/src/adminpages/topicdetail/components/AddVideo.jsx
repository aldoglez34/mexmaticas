import React, { useState } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { string } from "prop-types";
import TeacherAPI from "../../../utils/TeacherAPI";

export const AddVideo = React.memo(({ courseId, topicId }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const yupschema = yup.object({
    name: yup.string().required("Requerido"),
    link: yup.string().required("Requerido"),
  });

  return (
    <>
      <Button variant="dark" onClick={handleShow} size="sm">
        <i className="fas fa-video mr-2" />
        <span>Nuevo Video</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="bg-light rounded">
          <div className="d-flex">
            <h3 className="mb-0 text-dark">Nuevo Video</h3>
            <Button
              variant="link"
              className="text-dark ml-auto"
              onClick={handleClose}
            >
              <i className="fas fa-times" />
            </Button>
          </div>
          <div className="my-3">
            <Formik
              initialValues={{
                name: "",
                link: "",
              }}
              validationSchema={yupschema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                values.type = "video";
                values.courseId = courseId;
                values.topicId = topicId;
                TeacherAPI.t_addMaterial(values)
                  .then(() => {
                    window.location.reload();
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("Ocurrió un error, vuelve a intentarlo");
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
                    <Form.Group as={Col}>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        maxLength="55"
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
                  {/* link */}
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Liga</Form.Label>
                      <Form.Control
                        type="text"
                        name="link"
                        value={values.link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.link && !errors.link}
                        isInvalid={touched.link && !!errors.link}
                      />
                      <ErrorMessage
                        className="text-danger"
                        name="link"
                        component="div"
                      />
                    </Form.Group>
                  </Form.Row>
                  {/* buttons */}
                  <Form.Group className="mt-1">
                    <Button
                      block
                      disabled={isSubmitting}
                      size="lg"
                      type="submit"
                      variant="dark"
                    >
                      Guardar
                    </Button>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

AddVideo.propTypes = {
  courseId: string.isRequired,
  topicId: string.isRequired,
};
