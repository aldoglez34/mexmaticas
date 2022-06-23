import React from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import { number, string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateCoursePrice } from "../../../../services";
import { useSelector } from "react-redux";
import { Button } from "../../../../components";

export const CoursePriceForm = React.memo(({ formLabel, formInitialText }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);

  console.log({ formLabel, formInitialText });

  const yupschema = yup.object({
    newPrice: yup.number().positive("¿Por qué negativo?").required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        newPrice: formInitialText,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.courseId = courseId;
        updateCoursePrice(values)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((err) => {
            alert("Ocurrió un error. Vuelve a intentarlo más tarde.");
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
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="number"
                  name="newPrice"
                  value={values.newPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newPrice && !errors.newPrice}
                  isInvalid={touched.newPrice && !!errors.newPrice}
                />
              </InputGroup>
              <ErrorMessage
                className="text-danger"
                name="newPrice"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* buttons */}
          <Form.Group>
            <Button isDisabled={isSubmitting} isLoading={isSubmitting} isSubmit>
              Guardar
            </Button>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
});

CoursePriceForm.propTypes = {
  formLabel: string,
  formInitialText: number,
};

CoursePriceForm.displayName = "CoursePriceForm";
