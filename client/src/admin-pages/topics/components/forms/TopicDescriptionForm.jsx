import React from "react";
import { Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { updateTopicDescription } from "../../../../services";
import { useSelector } from "react-redux";
import { AdminSubmitButton } from "../../../../components";

export const TopicDescriptionForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const courseId = useSelector((state) => state.admin.course.courseId);
    const topicId = useSelector((state) => state.admin.topic.topicId);

    const yupschema = yup.object({
      newDescription: yup
        .string()
        .min(3, "Demasiado corta")
        .required("Requerido"),
    });

    return (
      <Formik
        initialValues={{
          newDescription: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          values.courseId = courseId;
          values.topicId = topicId;
          updateTopicDescription(values)
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
                <Form.Control
                  maxLength="500"
                  as="textarea"
                  rows="5"
                  type="text"
                  name="newDescription"
                  value={values.newDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newDescription && !errors.newDescription}
                  isInvalid={touched.newDescription && !!errors.newDescription}
                />
                <ErrorMessage
                  className="text-danger"
                  name="newDescription"
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

TopicDescriptionForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

TopicDescriptionForm.displayName = "TopicDescriptionForm";
