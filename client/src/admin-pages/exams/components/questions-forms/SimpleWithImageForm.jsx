import React from "react";
import { Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { newSimpleWithImageQuestion } from "../../../../services";
import { useSelector } from "react-redux";
import { firebaseStorage } from "../../../../firebase/firebase";
import { object } from "prop-types";
import { Button, ImageFromFirebase } from "../../../../components";
import { IMAGES } from "../../../../utils/constants";

export const SimpleWithImageForm = ({ question }) => {
  const yupschema = yup.object({
    qCALeft: yup.string(),
    qCARight: yup.string(),
    qComment: yup.string(),
    qCorrectAnswers: yup.string().required("Requerido"),
    qInstruction: yup.string().required("Requerido"),
    ...(question
      ? {}
      : {
          file: yup
            .mixed()
            .required("Requerido")
            // .test(
            //   "fileSize",
            //   "Imagen muy pesada",
            //   (value) => value && value.size <= IMAGES.SIZE
            // )
            .test(
              "fileFormat",
              "Formato no soportado",
              (value) => value && IMAGES.SUPPORTED_FORMATS.includes(value.type)
            ),
        }),
  });

  const examId = useSelector((state) => state.admin.exam.examId);
  const topicId = useSelector((state) => state.admin.topic.topicId);
  const courseId = useSelector((state) => state.admin.course.courseId);

  const oldQuestionImageUrl = question?.qTechnicalInstruction?.imageLink;

  return (
    <Formik
      initialValues={{
        file: undefined,
        image: undefined,
        qCALeft: question?.qCorrectAnswers[0]?.complementLeft || "",
        qCARight: question?.qCorrectAnswers[0]?.complementRight || "",
        qComment: question?.qComment || "",
        qCorrectAnswers: question?.qCorrectAnswers[0]?.answer || "",
        qInstruction: question?.qInstruction || "",
      }}
      validationSchema={yupschema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        values.qInstruction = values.qInstruction.trim();
        values.qCorrectAnswers = values.qCorrectAnswers.trim();
        values.qCALeft = values.qCALeft.trim();
        values.qCARight = values.qCARight.trim();
        values.qComment = values.qComment.trim();

        values.courseId = courseId;
        values.topicId = topicId;
        values.examId = examId;

        values.isEdition = question ? true : false;
        values.oldQuestionId = question?._id;
        values.firebasePath = `${courseId}/${topicId}/exams/${examId}/${question?._id}/imagen`;

        const hasImageChanged =
          question && values.file && values.image ? true : false;

        try {
          // post question to mongodb
          const questionId = await newSimpleWithImageQuestion(values).then(
            (res) => res.data
          );

          // if this isn't an edition, upload image to firebase store
          // or if this is an edition and the image changed, upload new image with the same path
          if (!values.isEdition || (values.isEdition && hasImageChanged)) {
            const storageRef = firebaseStorage.ref();
            const pathOnFirebaseStorage = `${courseId}/${topicId}/exams/${examId}/${questionId}/imagen`;
            const fileRef = storageRef.child(pathOnFirebaseStorage);

            await fileRef.put(values.file);
          }

          window.location.reload();
        } catch (err) {
          console.log(err);
          setSubmitting(false);
          alert("Ocurrió un error en el servidor, intenta más tarde");
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
        setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          {/* qInstruction */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Instrucción
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="500"
                type="text"
                as="textarea"
                rows="1"
                name="qInstruction"
                value={values.qInstruction}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qInstruction && !errors.qInstruction}
                isInvalid={touched.qInstruction && !!errors.qInstruction}
              />
              <ErrorMessage
                className="text-danger"
                name="qInstruction"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* qTechnicalInstruction (image) */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Imagen
                {!question || (values.image && values.file) ? (
                  <strong className="text-danger" title="Requerido">
                    *
                  </strong>
                ) : (
                  <small> (Opcional)</small>
                )}
                <small className="ml-1">(.jpg, .jpeg, .gif y .png)</small>
                {oldQuestionImageUrl && !values.image && !values.file && (
                  <>
                    <br />
                    <ImageFromFirebase
                      className="mt-2"
                      height="85"
                      path={oldQuestionImageUrl}
                      width="85"
                    />
                  </>
                )}
              </Form.Label>
              <Form.File
                encType="multipart/form-data"
                accept="image/*"
                label={values.image ? values.image : ""}
                data-browse="Buscar"
                id="file"
                name="file"
                type="file"
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                  setFieldValue(
                    "image",
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
          {/* answers */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Row>
                <Col md={4}>
                  <Form.Label>Complemento izquierda</Form.Label>
                  <Form.Control
                    maxLength="25"
                    type="text"
                    name="qCALeft"
                    value={values.qCALeft}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.qCALeft && !errors.qCALeft}
                    isInvalid={touched.qCALeft && !!errors.qCALeft}
                  />
                  <ErrorMessage
                    className="text-danger"
                    name="qCALeft"
                    component="div"
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Respuesta
                    <strong className="text-danger" title="Requerido">
                      *
                    </strong>
                  </Form.Label>
                  <Form.Control
                    maxLength="250"
                    type="text"
                    name="qCorrectAnswers"
                    value={values.qCorrectAnswers}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.qCorrectAnswers && !errors.qCorrectAnswers}
                    isInvalid={
                      touched.qCorrectAnswers && !!errors.qCorrectAnswers
                    }
                  />
                  <ErrorMessage
                    className="text-danger"
                    name="qCorrectAnswers"
                    component="div"
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Complemento derecha</Form.Label>
                  <Form.Control
                    maxLength="25"
                    type="text"
                    name="qCARight"
                    value={values.qCARight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.qCARight && !errors.qCARight}
                    isInvalid={touched.qCARight && !!errors.qCARight}
                  />
                  <ErrorMessage
                    className="text-danger"
                    name="qCARight"
                    component="div"
                  />
                </Col>
              </Form.Row>
            </Form.Group>
          </Form.Row>
          {/* qComment */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Comentario{" "}
                <small>(Utiliza el símbolo \n para saltos de línea)</small>
              </Form.Label>
              <Form.Control
                maxLength="500"
                type="text"
                as="textarea"
                rows="1"
                name="qComment"
                value={values.qComment}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qComment && !errors.qComment}
                isInvalid={touched.qComment && !!errors.qComment}
              />
              <ErrorMessage
                className="text-danger"
                name="qComment"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* buttons */}
          <Form.Group className="mt-1">
            <Button
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              isSubmit
            />
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

SimpleWithImageForm.propTypes = {
  question: object,
};
