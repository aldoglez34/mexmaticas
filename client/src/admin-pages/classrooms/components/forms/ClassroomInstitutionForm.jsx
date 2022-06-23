import React, { useEffect, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  fetchInstitutions,
  updateClassroomInstitution,
} from "../../../../services";
import { Button } from "../../../../components";

export const ClassroomInstitutionForm = React.memo(
  ({ formLabel, formInitialText }) => {
    const [institutions, setInstitutions] = useState();

    const url = new URL(window.location.href);
    const classroomId = url.href.split("/").pop();

    const yupschema = yup.object({
      newInstitution: yup.string(),
    });

    useEffect(() => {
      fetchInstitutions()
        .then((res) => {
          const institutions = res.data
            .map(({ _id, name }) => ({
              _id,
              name,
            }))
            .sort((a, b) =>
              String(a.name).toUpperCase().trim() >
              String(b.name).toUpperCase().trim()
                ? 1
                : -1
            );
          setInstitutions(institutions);
        })
        .catch((err) => {
          console.log(err);
          alert("Ocurrió un error, vuelve a intentarlo.");
        });
    }, []);

    return (
      <Formik
        initialValues={{
          newInstitution: formInitialText,
        }}
        validationSchema={yupschema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          values.classroomId = classroomId;

          updateClassroomInstitution(values)
            .then((res) => {
              console.log(res);
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
                  as="select"
                  type="text"
                  name="newInstitution"
                  value={values.newInstitution}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.newInstitution && !errors.newInstitution}
                  isInvalid={touched.newInstitution && !!errors.newInstitution}
                >
                  <option value="Elige...">Elige...</option>
                  {institutions &&
                    institutions.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                </Form.Control>
                <ErrorMessage
                  className="text-danger"
                  name="newInstitution"
                  component="div"
                />
              </Form.Group>
            </Form.Row>
            {/* buttons */}
            <Form.Group>
              <Button
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                isSubmit
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

ClassroomInstitutionForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

ClassroomInstitutionForm.display = "ClassroomInstitutionForm";
