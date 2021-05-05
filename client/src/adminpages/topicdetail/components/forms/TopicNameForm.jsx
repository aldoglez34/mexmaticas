import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import TeacherAPI from "../../../../utils/TeacherAPI";
import { useSelector } from "react-redux";

export const TopicNameForm = React.memo(({ formLabel, formInitialText }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);
  const topicId = useSelector((state) => state.admin.topic.topicId);

  const yupschema = yup.object({
    newName: yup
      .string()
      .min(3, "Nombre demasiado corto")
      .required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        newName: formInitialText,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.courseId = courseId;
        values.topicId = topicId;
        TeacherAPI.t_updateTopicName(values)
          .then((res) => {
            console.log(res.data);
            window.location.reload();
          })
          .catch((err) => {
            alert(
              "Ocurrió un error. Asegúrate que no exista un tema con este nombre y vuelve a intentarlo."
            );
            setSubmitting(false);
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
          {/* name */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>{formLabel}</Form.Label>
              <Form.Control
                maxLength="40"
                type="text"
                name="newName"
                value={values.newName}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.newName && !errors.newName}
                isInvalid={touched.newName && !!errors.newName}
              />
              <ErrorMessage
                className="text-danger"
                name="newName"
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
  );
});

TopicNameForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};
