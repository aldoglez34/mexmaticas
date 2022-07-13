import React, { memo, useEffect, useState } from "react";
import { func, string } from "prop-types";
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { messageTeacher } from "../../../../services";
import { AlertModal } from "../../../../components";
import { errorLogger } from "../../../../errors/errorLogger";
import cn from "classnames";
import { isEqual } from "lodash";

export const HelpModal = memo(
  ({ className, courseName, getTeacherNames, question, topic, topicId }) => {
    const [show, setShow] = useState(false);
    const [availableTeachers, setAvailableTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const student = useSelector((state) => state.student);

    useEffect(() => {
      const teachers = getTeacherNames(topicId);
      setAvailableTeachers(teachers);
      setSelectedTeacher((teachers || [])[0]);
    }, [getTeacherNames, setAvailableTeachers, topicId]);

    // if we are rendering this, we assume the user is assigned to a classroom
    const TeachersDropdown = () => (
      <DropdownButton
        as={ButtonGroup}
        size="sm"
        drop="down"
        title={selectedTeacher?.name || ""}
        variant="outline-info"
      >
        {(availableTeachers || []).map((teacher) => (
          <Dropdown.Item
            key={teacher.id}
            onClick={() => setSelectedTeacher(teacher)}
          >
            {teacher.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );

    const getOriginFromQuestion = () => {
      if (!question) return "";
      if (
        question.qTechnicalInstruction &&
        isEqual(question.qTechnicalInstruction.type, "text")
      ) {
        return `${question.qInstruction} | ${question.qTechnicalInstruction.text}`.trim();
      } else {
        return question.qInstruction;
      }
    };

    return (
      <>
        <Button
          className={cn("shadow-sm", className)}
          onClick={handleShow}
          size="sm"
          variant="info"
        >
          <i className="fas fa-question-circle mr-1" />
          Ayuda
        </Button>

        <AlertModal image="/images/help.png" show={show}>
          <strong className="mb-3 mt-3 d-block">
            ¿Necesitas ayuda? Utiliza el siguiente recuadro para hacerle llegar
            tu duda al maestro.
          </strong>
          <div className="text-left">
            <strong className="d-block mb-1">Elige maestro:</strong>
            <TeachersDropdown />
          </div>
          <div className="mt-4">
            <Formik
              initialValues={{
                body: "",
              }}
              validationSchema={yup.object({
                body: yup.string().required("Requerido"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                const messageData = {
                  text: values.body,
                  origin: question
                    ? getOriginFromQuestion()
                    : `${courseName} | ${topic}`,
                  student: student?._id,
                  teacherId: selectedTeacher?.id,
                  ...(question?.qTechnicalInstruction?.imageLink && {
                    image: question.qTechnicalInstruction.imageLink,
                  }),
                };
                messageTeacher(messageData)
                  .then(() => {
                    alert("Mensaje enviado.");
                    handleClose();
                  })
                  .catch((err) => errorLogger(err));
                setSubmitting(false);
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
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Control
                        maxLength="250"
                        type="text"
                        as="textarea"
                        rows="5"
                        name="body"
                        value={values.body}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.body && !errors.body}
                        isInvalid={touched.body && !!errors.body}
                      />
                      <ErrorMessage
                        className="text-danger"
                        name="body"
                        component="div"
                      />
                    </Form.Group>
                  </Form.Row>
                  <div className="d-flex flex-row justify-content-center mt-2">
                    <Button variant="dark shadow-sm" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button
                      variant="info"
                      type="submit"
                      className="shadow-sm ml-2"
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-paper-plane mr-1" />
                      Enviar
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </AlertModal>
      </>
    );
  }
);

HelpModal.propTypes = {
  courseName: string.isRequired,
  getTeacherNames: func,
  topic: string.isRequired,
  topicId: string,
};

HelpModal.displayName = "HelpModal";
