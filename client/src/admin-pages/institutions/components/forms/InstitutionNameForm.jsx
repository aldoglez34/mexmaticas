import React from "react";
import { Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateInstitutionName } from "../../../../services";
import { AdminSubmitButton } from "../../../../components/buttons/AdminSubmitButton";

export const InstitutionNameForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const url = new URL(window.location.href);
    const institutionId = url.href.split("/").pop();

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

          values.institutionId = institutionId;

          updateInstitutionName(values)
            .then((res) => {
              console.log(res);
              window.location.reload();
            })
            .catch((err) => {
              alert(
                "Ocurrió un error. Asegúrate que no exista una escuela con este nombre y vuelve a intentarlo."
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
            <Form.Group>
              <AdminSubmitButton {...{ isSubmitting }} />
            </Form.Group>
          </Form>
        )}
      </Formik>
    );
  }
);

InstitutionNameForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

InstitutionNameForm.displayName = "InstitutionNameForm";
