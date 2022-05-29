import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateInstitutionDescription } from "../../../services";

export const InstitutionDescriptionForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const url = new URL(window.location.href);
    const institutionId = url.href.split("/").pop();

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

          values.institutionId = institutionId;

          updateInstitutionDescription(values)
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

InstitutionDescriptionForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

InstitutionDescriptionForm.displayName = "InstitutionDescriptionForm";
