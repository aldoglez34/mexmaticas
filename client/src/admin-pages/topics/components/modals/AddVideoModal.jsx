import React from "react";
import { Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { bool, func, string } from "prop-types";
import { addMaterial } from "../../../../services";
import { AdminModal, Button } from "../../../../components";

export const AddVideoModal = React.memo(
  ({ courseId, handleCloseModal, show, topicId }) => {
    const yupschema = yup.object({
      name: yup.string().required("Requerido"),
      link: yup.string().required("Requerido"),
    });

    return (
      <AdminModal
        handleClose={handleCloseModal}
        show={show}
        title="Agregar Video"
      >
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
            addMaterial(values)
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
              <Form.Group>
                <Button
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  isSubmit
                />
              </Form.Group>
            </Form>
          )}
        </Formik>
      </AdminModal>
    );
  }
);

AddVideoModal.propTypes = {
  courseId: string.isRequired,
  handleCloseModal: func.isRequired,
  show: bool.isRequired,
  topicId: string.isRequired,
};

AddVideoModal.displayName = "AddVideoModal";
