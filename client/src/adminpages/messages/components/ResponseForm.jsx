import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import TeachAPI from "../../../utils/TeacherAPI";
import { string } from "prop-types";

export const ResponseForm = React.memo(({ msgId, email }) => {
  const yupschema = yup.object({
    body: yup.string().required("Requerido"),
  });

  return (
    <>
      <h5 className="mt-3 text-dark">Respuesta</h5>
      <Formik
        initialValues={{
          body: "",
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          values.msgId = msgId;
          values.email = email;
          TeachAPI.t_respondMsg(values)
            .then((res) => {
              console.log(res.data);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
              alert("Ocurrió un error, vuelve a intentarlo más tarde");
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
            <Form.Group>
              <Button
                variant="dark"
                type="submit"
                className="shadow-sm mt-3"
                disabled={isSubmitting}
              >
                Enviar
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </>
  );
});

ResponseForm.propTypes = {
  msgId: string.isRequired,
  email: string,
};
