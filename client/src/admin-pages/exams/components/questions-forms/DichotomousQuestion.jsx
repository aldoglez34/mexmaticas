import React from "react";
import { Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { newDichotomousQuestion } from "../../../../services";
import { useSelector } from "react-redux";
import { object } from "prop-types";
import { Button } from "../../../../components";

export const DichotomousQuestion = ({ question }) => {
  const yupschema = yup.object({
    qComment: yup.string(),
    qCorrectAnswers: yup.string().required("Requerido"),
    qInstruction: yup.string().required("Requerido"),
    qOption1: yup.string().required("Requerido"),
    qOption2: yup.string().required("Requerido"),
    qTechnicalInstruction: yup.string(),
  });

  const examId = useSelector((state) => state.admin.exam.examId);

  return (
    <Formik
      initialValues={{
        qComment: question?.qComment || "",
        qCorrectAnswers: question?.qCorrectAnswers[0]?.answer || "",
        qInstruction: question?.qInstruction || "",
        qOption1: "Falso",
        qOption2: "Verdadero",
        qTechnicalInstruction: question?.qTechnicalInstruction?.text || "",
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        values.qInstruction = values.qInstruction.trim();
        values.qTechnicalInstruction = values.qTechnicalInstruction.trim();
        values.qInstructiqCommenton = values.qComment.trim();

        values.isEdition = question ? true : false;
        values.questionId = question?._id;

        values.examId = examId;

        const isAnswerIncludedInOptions = [
          String(values.qOption1),
          String(values.qOption2),
        ].includes(String(values.qCorrectAnswers));

        if (!isAnswerIncludedInOptions) {
          alert("La respuesta debe estar contenida en las opciones.");
          setSubmitting(false);
        } else {
          newDichotomousQuestion(values)
            .then((res) => {
              console.log(res.data);
              window.location.reload();
            })
            .catch((err) => {
              alert("Ocurrió un error. Vuelve a intentarlo.");
              setSubmitting(false);
              console.log(err);
            });
        }
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
          {/* options 1 - 2 */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Opción 1
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                disabled
                maxLength="25"
                type="text"
                name="qOption1"
                value={values.qOption1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qOption1 && !errors.qOption1}
                isInvalid={touched.qOption1 && !!errors.qOption1}
              />
              <ErrorMessage
                className="text-danger"
                name="qOption1"
                component="div"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>
                Opción 2
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                disabled
                maxLength="25"
                type="text"
                name="qOption2"
                value={values.qOption2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qOption2 && !errors.qOption2}
                isInvalid={touched.qOption2 && !!errors.qOption2}
              />
              <ErrorMessage
                className="text-danger"
                name="qOption2"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* correct answer */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Respuesta
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                as="select"
                type="text"
                name="qCorrectAnswers"
                defaultValue={
                  question?.qCorrectAnswers[0]?.answer || "Elige..."
                }
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswers && !errors.qCorrectAnswers}
                isInvalid={touched.qCorrectAnswers && !!errors.qCorrectAnswers}
              >
                <option disabled>Elige...</option>
                <option value="Falso">Falso</option>
                <option value="Verdadero">Verdadero</option>
              </Form.Control>
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswers"
                component="div"
              />
            </Form.Group>
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

DichotomousQuestion.propTypes = {
  question: object,
};
