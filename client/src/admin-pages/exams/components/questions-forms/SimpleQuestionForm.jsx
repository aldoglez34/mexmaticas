import React from "react";
import { Col, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { newSimpleQuestion } from "../../../../services";
import { useSelector } from "react-redux";
import { object } from "prop-types";
import { Button } from "../../../../components";

export const SimpleQuestionForm = ({ question }) => {
  const examId = useSelector((state) => state.admin.exam.examId);

  const yupschema = yup.object({
    qCALeft: yup.string(),
    qCARight: yup.string(),
    qComment: yup.string(),
    qCorrectAnswers: yup.string().required("Requerido"),
    qInstruction: yup.string().required("Requerido"),
    qTechnicalInstruction: yup.string(),
  });

  return (
    <Formik
      initialValues={{
        qInstruction: question?.qInstruction || "",
        qTechnicalInstruction: question?.qTechnicalInstruction?.text || "",
        qCorrectAnswers: question?.qCorrectAnswers[0]?.answer || "",
        qCALeft: question?.qCorrectAnswers[0]?.complementLeft || "",
        qCARight: question?.qCorrectAnswers[0]?.complementRight || "",
        qComment: question?.qComment || "",
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.qInstruction = values.qInstruction.trim();
        values.qTechnicalInstruction = values.qTechnicalInstruction.trim();
        values.qCorrectAnswers = values.qCorrectAnswers.trim();
        values.qCALeft = values.qCALeft.trim();
        values.qCARight = values.qCARight.trim();
        values.qComment = values.qComment.trim();
        values.examId = examId;

        values.isEdition = question ? true : false;
        values.oldQuestionId = question?._id;
        values.questionId = question?._id;

        newSimpleQuestion(values)
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
          {/* qInstruction */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Instrucción
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="500"
                type="text"
                as="textarea"
                rows="1"
                name="qInstruction"
                value={values.qInstruction}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qInstruction && !errors.qInstruction}
                isInvalid={touched.qInstruction && !!errors.qInstruction}
              />
              <ErrorMessage
                className="text-danger"
                name="qInstruction"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* qTechnicalInstruction */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Instrucción técnica</Form.Label>
              <Form.Control
                maxLength="250"
                type="text"
                as="textarea"
                rows="1"
                name="qTechnicalInstruction"
                value={values.qTechnicalInstruction}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={
                  touched.qTechnicalInstruction && !errors.qTechnicalInstruction
                }
                isInvalid={
                  touched.qTechnicalInstruction &&
                  !!errors.qTechnicalInstruction
                }
              />
              <ErrorMessage
                className="text-danger"
                name="qTechnicalInstruction"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* answers */}
          <Form.Row className="mb-3">
            <Col md={4}>
              <Form.Label>Complemento izquierda</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCALeft"
                value={values.qCALeft}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCALeft && !errors.qCALeft}
                isInvalid={touched.qCALeft && !!errors.qCALeft}
              />
              <ErrorMessage
                className="text-danger"
                name="qCALeft"
                component="div"
              />
            </Col>
            <Col md={4}>
              <Form.Label>
                Respuesta
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="250"
                type="text"
                name="qCorrectAnswers"
                value={values.qCorrectAnswers}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswers && !errors.qCorrectAnswers}
                isInvalid={touched.qCorrectAnswers && !!errors.qCorrectAnswers}
              />
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswers"
                component="div"
              />
            </Col>
            <Col md={4}>
              <Form.Label>Complemento derecha</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCARight"
                value={values.qCARight}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCARight && !errors.qCARight}
                isInvalid={touched.qCARight && !!errors.qCARight}
              />
              <ErrorMessage
                className="text-danger"
                name="qCARight"
                component="div"
              />
            </Col>
          </Form.Row>
          {/* qComment */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Comentario{" "}
                <small>(Utiliza el símbolo \n para saltos de línea)</small>
              </Form.Label>
              <Form.Control
                maxLength="500"
                type="text"
                as="textarea"
                rows="1"
                name="qComment"
                value={values.qComment}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qComment && !errors.qComment}
                isInvalid={touched.qComment && !!errors.qComment}
              />
              <ErrorMessage
                className="text-danger"
                name="qComment"
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
};

SimpleQuestionForm.propTypes = {
  question: object,
};
