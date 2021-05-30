import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import TeacherAPI from "../../../../utils/TeacherAPI";
import { useSelector } from "react-redux";

export const CoursePayPalIdForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const courseId = useSelector((state) => state.admin.course.courseId);

    const school = useSelector((state) => state.admin.course.courseSchool);

    const yupschema = yup.object({
      newPaypalId: yup.string(),
    });

    return (
      <Formik
        initialValues={{
          newPaypalId: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          values.courseId = courseId;
          values.school = school;

          TeacherAPI.t_updateCoursePaypalId(values)
            .then((res) => {
              console.log(res);
              window.location.reload();
            })
            .catch((err) => {
              alert("Ocurrió un error. Vuelve a intentarlo.");
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
            {/* paypal id */}
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>{formLabel}</Form.Label>
                <Form.Control
                  maxLength="250"
                  type="text"
                  name="newPaypalId"
                  value={values.newPaypalId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newPaypalId && !errors.newPaypalId}
                  isInvalid={touched.newPaypalId && !!errors.newPaypalId}
                />
                <ErrorMessage
                  className="text-danger"
                  name="newPaypalId"
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
  }
);

CoursePayPalIdForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

CoursePayPalIdForm.displayName = "CoursePayPalIdForm";
