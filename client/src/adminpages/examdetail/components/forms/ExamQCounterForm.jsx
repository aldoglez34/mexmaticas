import React from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import { number, string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import TeacherAPI from "../../../../utils/TeacherAPI";
import { useSelector } from "react-redux";

export const ExamQCounterForm = React.memo(({ formInitialText, formLabel }) => {
  const examId = useSelector((state) => state.admin.exam.examId);

  const yupschema = yup.object({
    newQCounter: yup
      .number()
      .positive("El número debe ser mayor a 1")
      .required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        newQCounter: formInitialText,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.examId = examId;
        TeacherAPI.t_updateExamQCounter(values)
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
              <InputGroup>
                <Form.Control
                  type="number"
                  name="newQCounter"
                  value={values.newQCounter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newQCounter && !errors.newQCounter}
                  isInvalid={touched.newQCounter && !!errors.newQCounter}
                />
                <InputGroup.Append>
                  <InputGroup.Text id="basic-addon2">preguntas</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <ErrorMessage
                className="text-danger"
                name="newQCounter"
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

ExamQCounterForm.propTypes = {
  formInitialText: number,
  formLabel: string,
};

ExamQCounterForm.displayName = "ExamQCounterForm";
