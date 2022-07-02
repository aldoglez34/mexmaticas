import React from "react";
import { Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { newSimpleWithTwoAnswersQuestion } from "../../../../services";
import { useSelector } from "react-redux";
import { object } from "prop-types";
import { Button } from "../../../../components";

export const SimpleWithTwoAnswersForm = ({ question }) => {
  const examId = useSelector((state) => state.admin.exam.examId);

  const yupschema = yup.object({
    qCALeft1: yup.string(),
    qCALeft2: yup.string(),
    qCARight1: yup.string(),
    qCARight2: yup.string(),
    qComment: yup.string(),
    qCorrectAnswer1: yup.string().required("Requerido"),
    qCorrectAnswer2: yup.string().required("Requerido"),
    qInstruction: yup.string().required("Requerido"),
    qTechnicalInstruction: yup.string(),
  });

  return (
    <Formik
      initialValues={{
        qCALeft1: question?.qCorrectAnswers[0]?.complementLeft ?? "",
        qCALeft2: question?.qCorrectAnswers[1]?.complementLeft ?? "",
        qCARight1: question?.qCorrectAnswers[0]?.complementRight ?? "",
        qCARight2: question?.qCorrectAnswers[1]?.complementRight ?? "",
        qComment: question?.qComment ?? "",
        qCorrectAnswer1: question?.qCorrectAnswers[0]?.answer ?? "",
        qCorrectAnswer2: question?.qCorrectAnswers[1]?.answer ?? "",
        qInstruction: question?.qInstruction ?? "",
        qTechnicalInstruction: question?.qTechnicalInstruction?.text ?? "",
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        values.qInstruction = values.qInstruction.trim();
        values.qTechnicalInstruction = values.qTechnicalInstruction.trim();
        values.qCorrectAnswer1 = values.qCorrectAnswer1.trim();
        values.qCALeft1 = values.qCALeft1.trim();
        values.qCARight1 = values.qCARight1.trim();
        values.qCorrectAnswer2 = values.qCorrectAnswer2.trim();
        values.qCALeft2 = values.qCALeft2.trim();
        values.qCARight2 = values.qCARight2.trim();
        values.qComment = values.qComment.trim();

        values.isEdition = question ? true : false;
        values.questionId = question?._id;

        values.examId = examId;

        newSimpleWithTwoAnswersQuestion(values)
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
          {/* answer 1 */}
          <h5 className="text-dark">Respuesta 1</h5>
          <Form.Row className="mb-3">
            <Col md={4}>
              <Form.Label>Complemento izquierda</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCALeft1"
                value={values.qCALeft1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCALeft1 && !errors.qCALeft1}
                isInvalid={touched.qCALeft1 && !!errors.qCALeft1}
              />
              <ErrorMessage
                className="text-danger"
                name="qCALeft1"
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
                name="qCorrectAnswer1"
                value={values.qCorrectAnswer1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswer1 && !errors.qCorrectAnswer1}
                isInvalid={touched.qCorrectAnswer1 && !!errors.qCorrectAnswer1}
              />
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswer1"
                component="div"
              />
            </Col>
            <Col md={4}>
              <Form.Label>Complemento derecha</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCARight1"
                value={values.qCARight1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCARight1 && !errors.qCARight1}
                isInvalid={touched.qCARight1 && !!errors.qCARight1}
              />
              <ErrorMessage
                className="text-danger"
                name="qCARight1"
                component="div"
              />
            </Col>
          </Form.Row>
          {/* answer 2 */}
          <h5 className="text-dark">Respuesta 2</h5>
          <Form.Row className="mb-3">
            <Col md={4}>
              <Form.Label>Complemento izquierda</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCALeft2"
                value={values.qCALeft2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCALeft2 && !errors.qCALeft2}
                isInvalid={touched.qCALeft2 && !!errors.qCALeft2}
              />
              <ErrorMessage
                className="text-danger"
                name="qCALeft2"
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
                name="qCorrectAnswer2"
                value={values.qCorrectAnswer2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswer2 && !errors.qCorrectAnswer2}
                isInvalid={touched.qCorrectAnswer2 && !!errors.qCorrectAnswer2}
              />
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswer2"
                component="div"
              />
            </Col>
            <Col md={4}>
              <Form.Label>Complemento derecha</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCARight2"
                value={values.qCARight2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCARight2 && !errors.qCARight2}
                isInvalid={touched.qCARight2 && !!errors.qCARight2}
              />
              <ErrorMessage
                className="text-danger"
                name="qCARight2"
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

SimpleWithTwoAnswersForm.propTypes = {
  question: object,
};
