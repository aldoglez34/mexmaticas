import React, { memo } from "react";
import { Col, Form } from "react-bootstrap";
import { bool, oneOfType, string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateCourseStatus } from "../../../../services";
import { useSelector } from "react-redux";
import { Button } from "../../../../components";

export const CourseActiveForm = memo(({ formLabel, formInitialText }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);

  const yupschema = yup.object({
    newStatus: yup.bool().required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        newStatus: formInitialText,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.courseId = courseId;
        updateCourseStatus(values)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((err) => {
            alert("Ocurrió un error. Vuelve a intentarlo más tarde.");
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
                as="select"
                type="text"
                name="newStatus"
                value={values.newStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.newStatus && !errors.newStatus}
                isInvalid={touched.newStatus && !!errors.newStatus}
              >
                <option value={true}>Activo</option>
                <option value={false}>No activo</option>
              </Form.Control>
              <ErrorMessage
                className="text-danger"
                name="newStatus"
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
  );
});

CourseActiveForm.propTypes = {
  formLabel: string,
  formInitialText: oneOfType([string, bool]),
};

CourseActiveForm.displayName = "CourseActiveForm";