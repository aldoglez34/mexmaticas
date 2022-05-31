import React from "react";
import { Button, Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateClassroomSchool } from "../../../../services";

export const ClassroomSchoolForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const url = new URL(window.location.href);
    const classroomId = url.href.split("/").pop();

    const yupschema = yup.object({
      newSchool: yup.string(),
    });

    return (
      <Formik
        initialValues={{
          newSchool: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          values.classroomId = classroomId;

          updateClassroomSchool(values)
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
                  as="select"
                  type="text"
                  name="newSchool"
                  value={values.newSchool}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newSchool && !errors.newSchool}
                  isInvalid={touched.newSchool && !!errors.newSchool}
                >
                  <option value="Elige...">Elige...</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Secundaria">Secundaria</option>
                  <option value="Preparatoria">Preparatoria</option>
                  <option value="Universidad">Universidad</option>
                </Form.Control>
                <ErrorMessage
                  className="text-danger"
                  name="newSchool"
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

ClassroomSchoolForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

ClassroomSchoolForm.display = "ClassroomSchoolForm";
