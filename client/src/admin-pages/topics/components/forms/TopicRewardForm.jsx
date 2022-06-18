import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { string } from "prop-types";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { firebaseStorage } from "../../../../firebase/firebase";
import { useSelector } from "react-redux";
import { IMAGES } from "../../../../utils/constants";

export const TopicRewardForm = React.memo(({ formLabel }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);
  const topicId = useSelector((state) => state.admin.topic.topicId);

  const yupschema = yup.object({
    file: yup
      .mixed()
      .required("Requerido")
      // .test(
      //   "fileSize",
      //   "Imagen muy pesada",
      //   (value) => value && value.size <= IMAGES.PHOTO_SIZE
      // )
      .test(
        "fileFormat",
        "Formato no soportado",
        (value) => value && IMAGES.SUPPORTED_FORMATS.includes(value.type)
      ),
  });

  return (
    <Formik
      initialValues={{
        photo: undefined,
        file: undefined,
      }}
      validationSchema={yupschema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        const storageRef = firebaseStorage.ref();
        const pathOnFirebaseStorage = `${courseId}/${topicId}/rewards/medal`;
        const fileRef = storageRef.child(pathOnFirebaseStorage);

        fileRef
          .put(values.file)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            alert(err);
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
              <Form.Label>
                {formLabel}
                <strong className="text-danger">*</strong>
                <small className="ml-1">(.jpg, .jpeg, .gif y .png)</small>
              </Form.Label>
              <Form.File
                encType="multipart/form-data"
                accept="image/*"
                label={values.photo ? values.photo : ""}
                data-browse="Buscar"
                id="file"
                name="file"
                type="file"
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                  setFieldValue(
                    "photo",
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
});

TopicRewardForm.propTypes = {
  formLabel: string,
  formInitialText: string,
};

TopicRewardForm.displayName = "TopicRewardForm";
