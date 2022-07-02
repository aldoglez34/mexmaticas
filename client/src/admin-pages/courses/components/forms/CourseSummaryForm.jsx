import React from "react";
import { Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateCourseSummary } from "../../../../services";
import { useSelector } from "react-redux";
import { Button } from "../../../../components";

export const CourseSummaryForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const courseId = useSelector((state) => state.admin.course.courseId);

    const yupschema = yup.object({
      newSummary: yup.string().required("Requerido"),
    });

    return (
      <Formik
        initialValues={{
          newSummary: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          values.courseId = courseId;
          updateCourseSummary(values)
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
                <Form.Label className="mb-0">{formLabel}</Form.Label>
                <Form.Text className="text-muted mb-2">
                  Separados por coma
                </Form.Text>
                <Form.Control
                  maxLength="250"
                  as="textarea"
                  rows="5"
                  type="text"
                  name="newSummary"
                  value={values.newSummary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newSummary && !errors.newSummary}
                  isInvalid={touched.newSummary && !!errors.newSummary}
                />
                <ErrorMessage
                  className="text-danger"
                  name="newSummary"
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
  }
);

CourseSummaryForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

CourseSummaryForm.displayName = "CourseSummaryForm";
