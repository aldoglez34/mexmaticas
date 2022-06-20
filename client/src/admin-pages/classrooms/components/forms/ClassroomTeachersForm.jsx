import React, { useEffect, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { assignTeacher, fetchTeachers } from "../../../../services";
import { AdminSpinner, AdminSubmitButton } from "../../../../components";

export const ClassroomTeachersForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const [availableTeachers, setAvailableTeachers] = useState();

    const url = new URL(window.location.href);
    const classroomId = url.href.split("/").pop();

    const yupschema = yup.object({
      newTeacherId: yup.string(),
    });

    useEffect(() => {
      fetchTeachers()
        .then((res) => setAvailableTeachers(res.data))
        .catch((err) => {
          alert("Ocurrió un error.");
          console.log(err);
        });
    }, []);

    return (
      <Formik
        initialValues={{
          currentTeacherId: formInitialText,
          newTeacherId: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            const { currentTeacherId, newTeacherId } = values;
            await assignTeacher({
              classroomId,
              currentTeacherId,
              newTeacherId,
            });

            window.location.reload();
          } catch (err) {
            console.log(err);
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
            {/* teachers */}
            {availableTeachers ? (
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>{formLabel}</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    name="newTeacherId"
                    value={values.newTeacherId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.newTeacherId && !errors.newTeacherId}
                    isInvalid={touched.newTeacherId && !!errors.newTeacherId}
                  >
                    <option value="">Elige...</option>
                    {availableTeachers.length &&
                      availableTeachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {`${t.name} ${t.firstSurname} ${t.secondSurname}`.trim()}
                        </option>
                      ))}
                  </Form.Control>
                  <ErrorMessage
                    className="text-danger"
                    name="newTeacherId"
                    component="div"
                  />
                </Form.Group>
              </Form.Row>
            ) : (
              <AdminSpinner />
            )}
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

ClassroomTeachersForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

ClassroomTeachersForm.display = "ClassroomTeachersForm";
