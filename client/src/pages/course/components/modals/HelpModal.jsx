import React, { useState } from "react";
import { string } from "prop-types";
import { Button, Col, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import API from "../../../../utils/API";
import { AlertModal } from "../../../../components";

export const HelpModal = React.memo(({ courseName, topic }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const student = useSelector((state) => state.student);

  const yupschema = yup.object({
    body: yup.string().required("Requerido"),
  });

  return student ? (
    <>
      <Button
        variant="info"
        size="sm"
        className="mb-3 mt-2 mb-lg-0 shadow-sm"
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
              values.subject = `${courseName} | ${topic}`;
              values.source = "Tema";
              values.username = student.username;
              values.name = student.name + " " + student.firstSurname;
              API.postMessage(values)
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

HelpModal.propTypes = {
  courseName: string.isRequired,
  topic: string.isRequired,
};
