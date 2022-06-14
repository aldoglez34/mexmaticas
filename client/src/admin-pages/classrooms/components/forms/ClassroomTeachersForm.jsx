import React, { useEffect, useState } from "react";
import { Button, Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { assignTeacher, fetchAvailableTeachers } from "../../../../services";
import { AdminSpinner } from "../../../../components";

export const ClassroomTeachersForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const [availableTeachers, setAvailableTeachers] = useState();

    const url = new URL(window.location.href);
    const classroomId = url.href.split("/").pop();

    const yupschema = yup.object({
      newTeacherId: yup.string(),
    });

    useEffect(() => {
      fetchAvailableTeachers()
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
                      availableTeachers.map(({ fullName, _id }) => (
                        <option value={_id} key={_id}>
                          {fullName}
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
            <Form.Group className="mt-1">
              <Button
                block
                disabled={isSubmitting}
                size="lg"
                type="submit"
                variant="dark"
              >
                Guardar
              </Button>
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
