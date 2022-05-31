import React from "react";
import { Button, Form, Col } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { newDichotomousQuestionWithImage } from "../../../../services";
import { useSelector } from "react-redux";
import { firebaseStorage } from "../../../../firebase/firebase";
import { IMAGES } from "../../../../constants/constants";
import { ImageFromFirebase } from "../../../../components";
import { object } from "prop-types";

export const DichotomousQuestionWithImage = ({ question }) => {
  const yupschema = yup.object({
    qComment: yup.string(),
    qCorrectAnswers: yup.string().required("Requerido"),
    qInstruction: yup.string().required("Requerido"),
    qOption1: yup.string().required("Requerido"),
    qOption2: yup.string().required("Requerido"),
    ...(question
      ? {}
      : {
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
        qComment: question?.qComment || "",
        qCorrectAnswers: question?.qCorrectAnswers[0]?.answer || "",
        qInstruction: question?.qInstruction || "",
        qOption1: "Falso",
        qOption2: "Verdadero",
      }}
      validationSchema={yupschema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        values.qInstruction = values.qInstruction.trim();
        values.qCorrectAnswers = values.qCorrectAnswers.trim();
        values.qComment = values.qComment.trim();

        values.courseId = courseId;
        values.topicId = topicId;
        values.examId = examId;

        values.isEdition = question ? true : false;
        values.oldQuestionId = question?._id;
        values.firebasePath = `${courseId}/${topicId}/exams/${examId}/${question?._id}/imagen`;

        const hasImageChanged =
          question && values.file && values.image ? true : false;

        const isAnswerIncludedInOptions = [
          String(values.qOption1),
          String(values.qOption2),
        ].includes(String(values.qCorrectAnswers));

        try {
          if (!isAnswerIncludedInOptions) {
            setSubmitting(false);
            return alert("La respuesta debe estar contenida en las opciones.");
          }

          // post question to mongodb
          const questionId = await newDichotomousQuestionWithImage(values).then(
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
          {/* options 1 - 2 */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Opción 1
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                disabled
                maxLength="25"
                type="text"
                name="qOption1"
                value={values.qOption1}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qOption1 && !errors.qOption1}
                isInvalid={touched.qOption1 && !!errors.qOption1}
              />
              <ErrorMessage
                className="text-danger"
                name="qOption1"
                component="div"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>
                Opción 2
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                disabled
                maxLength="25"
                type="text"
                name="qOption2"
                value={values.qOption2}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qOption2 && !errors.qOption2}
                isInvalid={touched.qOption2 && !!errors.qOption2}
              />
              <ErrorMessage
                className="text-danger"
                name="qOption2"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          {/* correct answer */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                Respuesta
                <strong className="text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                as="select"
                type="text"
                name="qCorrectAnswers"
                defaultValue={
                  question ? question?.qCorrectAnswers[0]?.answer : "Elige..."
                }
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.qCorrectAnswers && !errors.qCorrectAnswers}
                isInvalid={touched.qCorrectAnswers && !!errors.qCorrectAnswers}
              >
                <option disabled>Elige...</option>
                <option value="Falso">Falso</option>
                <option value="Verdadero">Verdadero</option>
              </Form.Control>
              <ErrorMessage
                className="text-danger"
                name="qCorrectAnswers"
                component="div"
              />
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
};

DichotomousQuestionWithImage.propTypes = {
  question: object,
};
