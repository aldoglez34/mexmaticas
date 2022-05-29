import React, { useState } from "react";
import { object } from "prop-types";
import { Button, Col, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { postMessage } from "../../../services";
import { AlertModal } from "../../";

export const HelpModalSM = React.memo(({ question }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const student = useSelector((state) => state.student);
  const { topicName, name } = useSelector((state) => state.exam);

  const yupschema = yup.object({
    body: yup.string().required("Requerido"),
  });

  return student ? (
    <>
      <Button
        variant="info"
        size="sm"
        className="shadow-sm mr-2"
        onClick={handleShow}
      >
        Ayuda
      </Button>

      <AlertModal image="/images/help.png" show={show}>
        <h5 className="text-dark mb-3 mt-3">
          ¿Necesitas ayuda? Utiliza el siguiente recuadro para hacerle llegar tu
          duda al maestro.
        </h5>
        <div className="mt-4">
          <Formik
            initialValues={{
              body: "",
            }}
            validationSchema={yupschema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              values.email = student.email;

              const description = question.qTechnicalInstruction
                ? question.qTechnicalInstruction.type === "text"
                  ? `${question.qInstruction} ${question.qTechnicalInstruction.text}`.trim()
                  : `${question.qInstruction} > ${question.qTechnicalInstruction.imageLink}`.trim()
                : "";

              values.subject = `${topicName} | ${name} | ${description}`;

              values.source = "Pregunta";
              values.username = student.username;
              values.name = student.name + " " + student.firstSurname;
              postMessage(values)
                .then(() => {
                  alert("Mensaje enviado.");
                  handleClose();
                })
                .catch((err) => {
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
                {/* body */}
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Control
                      maxLength="250"
                      type="text"
                      as="textarea"
                      rows="5"
                      name="body"
                      value={values.body}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.body && !errors.body}
                      isInvalid={touched.body && !!errors.body}
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="body"
                      component="div"
                    />
                  </Form.Group>
                </Form.Row>
                {/* buttons */}
                <div className="d-flex flex-row justify-content-center mt-2">
                  <Button variant="dark shadow-sm" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    variant="info"
                    type="submit"
                    className="shadow-sm ml-2"
                    disabled={isSubmitting}
                  >
                    Enviar
                    <i className="fas fa-paper-plane ml-1" />
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </AlertModal>
    </>
  ) : null;
});

HelpModalSM.propTypes = {
  question: object.isRequired,
};

HelpModalSM.displayName = "HelpModalSM";
