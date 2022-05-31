import React from "react";
import { Button, Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateCourseSchool } from "../../../../services";
import { useSelector } from "react-redux";

export const CourseSchoolForm = React.memo(({ formLabel, formInitialText }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);
  const courseName = useSelector((state) => state.admin.course.courseName);

  const yupschema = yup.object({
    newSchool: yup.string().required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        newSchool: formInitialText,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        values.courseId = courseId;
        values.courseName = courseName;

        updateCourseSchool(values)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((err) => {
            alert(
              "Ocurrió un error. Asegúrate que no exista un curso con este nombre en este nuevo nivel educativo y vuelve a intentarlo."
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
                as="select"
                type="text"
                name="newSchool"
                value={values.newSchool}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.newSchool && !errors.newSchool}
                isInvalid={touched.newSchool && !!errors.newSchool}
              >
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
});

CourseSchoolForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

CourseSchoolForm.display = "CourseSchoolForm";
