import React from "react";
import { Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateExamDescription } from "../../../../services";
import { useSelector } from "react-redux";
import { Button } from "../../../../components";

export const ExamDescriptionForm = React.memo(
  ({ formInitialText, formLabel }) => {
    const examId = useSelector((state) => state.admin.exam.examId);

    const yupschema = yup.object({
      newDescription: yup.string().required("Requerido"),
    });

    return (
      <Formik
        initialValues={{
          newDescription: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          values.examId = examId;
          updateExamDescription(values)
            .then((res) => {
              console.log(res.data);
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
            {/* name */}
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>{formLabel}</Form.Label>
                <Form.Control
                  maxLength="250"
                  type="text"
                  as="textarea"
                  rows="5"
                  name="newDescription"
                  value={values.newDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newDescription && !errors.newDescription}
                  isInvalid={touched.newDescription && !!errors.newDescription}
                />
                <ErrorMessage
                  className="text-danger"
                  name="newDescription"
                  component="div"
                />
              </Form.Group>
            </Form.Row>
            {/* buttons */}
            <Form.Group className="mt-1">
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

ExamDescriptionForm.propTypes = {
  formInitialText: string,
  formLabel: string,
};

ExamDescriptionForm.displayName = "ExamDescriptionForm";
