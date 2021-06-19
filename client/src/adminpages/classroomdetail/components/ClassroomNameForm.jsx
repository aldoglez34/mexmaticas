import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import TeacherAPI from "../../../utils/TeacherAPI";

export const ClassroomNameForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const url = new URL(window.location.href);
    const classroomId = url.href.split("/").pop();

    const yupschema = yup.object({
      newName: yup
        .string()
        .min(2, "Nombre demasiado corto")
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

          values.classroomId = classroomId;

          TeacherAPI.t_updateClassroomName(values)
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
                <Form.Label>
                  {formLabel}
                  <strong className="text-danger">*</strong>
                </Form.Label>
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
  }
);

ClassroomNameForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

ClassroomNameForm.displayName = "ClassroomNameForm";
