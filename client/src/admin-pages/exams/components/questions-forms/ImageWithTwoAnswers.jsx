import React from "react";
import { Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { newImageWithTwoAnswersQuestion } from "../../../../services";
import { useSelector } from "react-redux";
import { firebaseStorage } from "../../../../firebase/firebase";
import { IMAGES } from "../../../../utils/constants";
import { object } from "prop-types";
import { Button, ImageFromFirebase } from "../../../../components";

export const ImageWithTwoAnswers = ({ question }) => {
  const yupschema = yup.object({
    qCALeft1: yup.string(),
    qCALeft2: yup.string(),
    qCARight1: yup.string(),
    qCARight2: yup.string(),
    qComment: yup.string(),
    qCorrectAnswer1: yup.string().required("Requerido"),
    qCorrectAnswer2: yup.string().required("Requerido"),
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
        qCALeft1: question?.qCorrectAnswers[0]?.complementLeft || "",
        qCALeft2: question?.qCorrectAnswers[1]?.complementLeft || "",
        qCARight1: question?.qCorrectAnswers[0]?.complementRight || "",
        qCARight2: question?.qCorrectAnswers[1]?.complementRight || "",
        qComment: question?.qComment || "",
        qCorrectAnswer1: question?.qCorrectAnswers[0]?.answer || "",
        qCorrectAnswer2: question?.qCorrectAnswers[1]?.answer || "",
        qInstruction: question?.qInstruction || "",
      }}
      validationSchema={yupschema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        values.qInstruction = values.qInstruction.trim();
        values.qCorrectAnswer1 = values.qCorrectAnswer1.trim();
        values.qCALeft1 = values.qCALeft1.trim();
        values.qCARight1 = values.qCARight1.trim();
        values.qCorrectAnswer2 = values.qCorrectAnswer2.trim();
        values.qCALeft2 = values.qCALeft2.trim();
        values.qCARight2 = values.qCARight2.trim();
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
          const questionId = await newImageWithTwoAnswersQuestion(values).then(
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
          <Form.Row className="mb-3">
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
            <ErrorMessage className="text-danger" name="file" component="div" />
          </Form.Row>
          {/* answer 1 */}
          <h5 className="text-dark">Respuesta 1</h5>
          <Form.Row className="mb-3">
            <Col md={4}>
              <Form.Label>Complemento izquierda</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCALeft1"
                value={values.qCALeft1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCALeft1 && !errors.qCALeft1}
                isInvalid={touched.qCALeft1 && !!errors.qCALeft1}
              />
              <ErrorMessage
                className="text-danger"
                name="qCALeft1"
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
                name="qCorrectAnswer1"
                value={values.qCorrectAnswer1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswer1 && !errors.qCorrectAnswer1}
                isInvalid={touched.qCorrectAnswer1 && !!errors.qCorrectAnswer1}
              />
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswer1"
                component="div"
              />
            </Col>
            <Col md={4}>
              <Form.Label>Complemento derecha</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCARight1"
                value={values.qCARight1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCARight1 && !errors.qCARight1}
                isInvalid={touched.qCARight1 && !!errors.qCARight1}
              />
              <ErrorMessage
                className="text-danger"
                name="qCARight1"
                component="div"
              />
            </Col>
          </Form.Row>
          {/* answer 2 */}
          <h5 className="text-dark">Respuesta 2</h5>
          <Form.Row className="mb-3">
            <Col md={4}>
              <Form.Label>Complemento izquierda</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCALeft2"
                value={values.qCALeft2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCALeft2 && !errors.qCALeft2}
                isInvalid={touched.qCALeft2 && !!errors.qCALeft2}
              />
              <ErrorMessage
                className="text-danger"
                name="qCALeft2"
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
                name="qCorrectAnswer2"
                value={values.qCorrectAnswer2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswer2 && !errors.qCorrectAnswer2}
                isInvalid={touched.qCorrectAnswer2 && !!errors.qCorrectAnswer2}
              />
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswer2"
                component="div"
              />
            </Col>
            <Col md={4}>
              <Form.Label>Complemento derecha</Form.Label>
              <Form.Control
                maxLength="25"
                type="text"
                name="qCARight2"
                value={values.qCARight2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCARight2 && !errors.qCARight2}
                isInvalid={touched.qCARight2 && !!errors.qCARight2}
              />
              <ErrorMessage
                className="text-danger"
                name="qCARight2"
                component="div"
              />
            </Col>
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

ImageWithTwoAnswers.propTypes = {
  question: object,
};
