import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import TeacherAPI from "../../../../utils/TeacherAPI";
import { useSelector } from "react-redux";

export const ExamNameForm = React.memo(({ formInitialText, formLabel }) => {
  const examId = useSelector((state) => state.admin.exam.examId);

  const yupschema = yup.object({
    newName: yup.string().required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        newName: formInitialText,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.examId = examId;
        TeacherAPI.t_updateExamName(values)
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
});

ExamNameForm.propTypes = {
  formInitialText: string,
  formLabel: string,
};
