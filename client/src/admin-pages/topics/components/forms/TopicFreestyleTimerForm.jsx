import React from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import { number, string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateTopicFreestyleTimer } from "../../../../services";
import { useSelector } from "react-redux";
import { AdminSubmitButton } from "../../../../components";

export const TopicFreestyleTimerForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const courseId = useSelector((state) => state.admin.course.courseId);
    const topicId = useSelector((state) => state.admin.topic.topicId);

    const yupschema = yup.object({
      newTimer: yup
        .number()
        .positive("El número debe ser mayor a 1")
        .required("Requerido"),
    });

    return (
      <Formik
        initialValues={{
          newTimer: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          values.courseId = courseId;
          values.topicId = topicId;
          updateTopicFreestyleTimer(values)
            .then((res) => {
              console.log(res.data);
              window.location.reload();
            })
            .catch((err) => {
              alert("Ocurrió un error.");
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
                    name="newTimer"
                    value={values.newTimer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.newTimer && !errors.newTimer}
                    isInvalid={touched.newTimer && !!errors.newTimer}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>minutos</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                <ErrorMessage
                  className="text-danger"
                  name="newTimer"
                  component="div"
                />
              </Form.Group>
            </Form.Row>
            {/* buttons */}
            <Form.Group>
              <AdminSubmitButton {...{ isSubmitting }} />
            </Form.Group>
          </Form>
        )}
      </Formik>
    );
  }
);

TopicFreestyleTimerForm.propTypes = {
  formLabel: string,
  formInitialText: number,
};

TopicFreestyleTimerForm.displayName = "TopicFreestyleTimerForm";
