import React from "react";
import { Col, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { bool, func, string } from "prop-types";
import { firebaseStorage } from "../../../../firebase/firebase";
import { addMaterial } from "../../../../services";
import { PDFS } from "../../../../utils/constants";
import { AdminModal, Button } from "../../../../components";

export const AddPDFModal = React.memo(
  ({ courseId, handleCloseModal, show, topicId }) => {
    const yupschema = yup.object({
      name: yup.string().required("Requerido"),
      file: yup
        .mixed()
        .required("Requerido")
        // .test(
        //   "fileSize",
        //   "PDF muy pesado",
        //   (value) => value && value.size <= PDFS.SIZE
        // )
        .test(
          "fileFormat",
          "Formato no soportado",
          (value) => value && PDFS.SUPPORTED_FORMATS.includes(value.type)
        ),
    });

    return (
      <AdminModal
        handleClose={handleCloseModal}
        show={show}
        title="Agregar PDF"
      >
        <Formik
          initialValues={{
            name: "",
            pdf: undefined,
            file: undefined,
          }}
          validationSchema={yupschema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);

            const storageRef = firebaseStorage.ref();
            const pathOnFirebaseStorage = `${courseId}/${topicId}/material/${values.name}`;
            const fileRef = storageRef.child(pathOnFirebaseStorage);

            fileRef
              .put(values.file)
              .then(() => {
                values.type = "pdf";
                values.courseId = courseId;
                values.topicId = topicId;
                addMaterial(values)
                  .then((res) => {
                    console.log(res.data);
                    window.location.reload();
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("Ocurrió un error, vuelve a intentarlo");
                  });
              })
              .catch((err) => {
                console.log(err);
                alert("Ocurrió un error en el servidor, intenta más tarde");
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
            setFieldValue,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {/* name */}
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    maxLength="55"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.name && !errors.name}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <ErrorMessage
                    className="text-danger"
                    name="name"
                    component="div"
                  />
                </Form.Group>
              </Form.Row>
              {/* pdf */}
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>PDF</Form.Label>
                  <Form.File
                    encType="multipart/form-data"
                    accept="application/pdf"
                    label={values.pdf ? values.pdf : ""}
                    data-browse="Buscar"
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                      setFieldValue(
                        "pdf",
                        event.currentTarget.files[0]
                          ? event.currentTarget.files[0].name
                          : ""
                      );
                    }}
                    onBlur={handleBlur}
                    custom
                  />
                  <ErrorMessage
                    className="text-danger"
                    name="file"
                    component="div"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Button
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  isSubmit
                />
              </Form.Group>
            </Form>
          )}
        </Formik>
      </AdminModal>
    );
  }
);

AddPDFModal.propTypes = {
  courseId: string.isRequired,
  handleCloseModal: func.isRequired,
  show: bool.isRequired,
  topicId: string.isRequired,
};

AddPDFModal.displayName = "AddPDFModal";
