import React from "react";
import { Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateClassroomDescription } from "../../../../services";
import { AdminSubmitButton } from "../../../../components/buttons/AdminSubmitButton";

export const ClassroomDescriptionForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const url = new URL(window.location.href);
    const classroomId = url.href.split("/").pop();

    const yupschema = yup.object({
      newDescription: yup.string(),
    });

    return (
      <Formik
        initialValues={{
          newDescription: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          values.classroomId = classroomId;

          updateClassroomDescription(values)
            .then((res) => {
              console.log(res);
              window.location.reload();
            })
            .catch((err) => {
              alert("Ocurrió un error.");
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
            <Form.Group>
              <AdminSubmitButton {...{ isSubmitting }} />
            </Form.Group>
          </Form>
        )}
      </Formik>
    );
  }
);

ClassroomDescriptionForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

ClassroomDescriptionForm.displayName = "ClassroomDescriptionForm";
