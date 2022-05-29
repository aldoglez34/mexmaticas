import React, { useState, useEffect } from "react";
import { AdminLayout, AdminModal, AdminSpinner } from "../components";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { fetchExam } from "../../services";
import {
  DichotomousQuestion,
  DichotomousQuestionTable,
  DichotomousQuestionWithImage,
  DichotomousQuestionWithImageTable,
  ExamDescriptionForm,
  ExamDurationForm,
  ExamNameForm,
  ExamQCounterForm,
  ImageWithTwoAnswers,
  ImageWithTwoAnswersTable,
  MultipleOptionForm,
  MultipleOptionQuestionsTable,
  MultipleOptionWithImage,
  MultipleOptionWithImageTable,
  NewQuestionModal,
  SimpleQuestionForm,
  SimpleQuestionTable,
  SimpleWithImageForm,
  SimpleWithImageQuestionsTable,
  SimpleWithTwoAnswersForm,
  SimpleWithTwoAnswersTable,
} from "./components";
import { useDispatch, useSelector } from "react-redux";
import { setExam, setTitle } from "../../redux/actions/admin";
import { HashLink as Link } from "react-router-hash-link";
import cn from "classnames";

import styles from "./adminexamdetailpage.module.scss";

export const AdminExamDetailPage = React.memo((props) => {
  const dispatch = useDispatch();

  const [exam, setExamOnState] = useState();

  const courseName = useSelector((state) => state.admin.course.courseName);
  const topicName = useSelector((state) => state.admin.topic.topicName);

  // questions
  const [simpleQuestions, setSimpleQuestions] = useState([]);
  const [simpleWithImageQuestions, setSimpleWithImageQuestions] = useState([]);
  const [simpleWithTwoAnswersQuestions, setSimpleWithTwoAnswersQuestions] =
    useState([]);
  const [imageWithTwoAnswers, setImageWithTwoAnswers] = useState([]);
  const [multipleOptionQuestions, setMultipleOptionQuestions] = useState([]);
  const [
    multipleOptionWithImageQuestions,
    setMultipleOptionWithImageQuestions,
  ] = useState([]);
  const [dichotomousQuestions, setDichotomousQuestions] = useState([]);
  const [dichotomousQuestionsWithImage, setDichotomousQuestionsWithImage] =
    useState([]);

  // url params
  const courseId = props.routeProps.match.params.courseId;
  const topicId = props.routeProps.match.params.topicId;
  const examId = props.routeProps.match.params.examId;

  // exams list used to map in the jsx
  const examsList = [
    {
      name: "Sencilla",
      form: SimpleQuestionForm,
      tableHeader: "Preguntas sencillas",
      table: SimpleQuestionTable,
      hasQuestions: simpleQuestions.length > 0,
      data: simpleQuestions,
    },
    {
      name: "Sencilla con imagen",
      form: SimpleWithImageForm,
      tableHeader: "Preguntas sencillas con imagen",
      table: SimpleWithImageQuestionsTable,
      hasQuestions: simpleWithImageQuestions.length > 0,
      data: simpleWithImageQuestions,
    },
    {
      name: "Sencilla con 2 respuestas",
      form: SimpleWithTwoAnswersForm,
      tableHeader: "Preguntas sencillas con 2 respuestas",
      table: SimpleWithTwoAnswersTable,
      hasQuestions: simpleWithTwoAnswersQuestions.length > 0,
      data: simpleWithTwoAnswersQuestions,
    },
    {
      name: "Imagen con 2 respuestas",
      form: ImageWithTwoAnswers,
      tableHeader: "Preguntas con imagen y con 2 respuestas",
      table: ImageWithTwoAnswersTable,
      hasQuestions: imageWithTwoAnswers.length > 0,
      data: imageWithTwoAnswers,
    },
    {
      name: "Opción múltiple",
      form: MultipleOptionForm,
      tableHeader: "Preguntas de opción múltiple",
      table: MultipleOptionQuestionsTable,
      hasQuestions: multipleOptionQuestions.length > 0,
      data: multipleOptionQuestions,
    },
    {
      name: "Opción múltiple con imagen",
      form: MultipleOptionWithImage,
      tableHeader: "Preguntas de opción múltiple con imagen",
      table: MultipleOptionWithImageTable,
      hasQuestions: multipleOptionWithImageQuestions.length > 0,
      data: multipleOptionWithImageQuestions,
    },
    {
      name: "Dicotómica",
      form: DichotomousQuestion,
      tableHeader: "Preguntas dicotómicas",
      table: DichotomousQuestionTable,
      hasQuestions: dichotomousQuestions.length > 0,
      data: dichotomousQuestions,
    },
    {
      name: "Dicotómica con imagen",
      form: DichotomousQuestionWithImage,
      tableHeader: "Preguntas dicotómicas con imagen",
      table: DichotomousQuestionWithImageTable,
      hasQuestions: dichotomousQuestionsWithImage.length > 0,
      data: dichotomousQuestionsWithImage,
    },
  ];

  useEffect(() => {
    fetchExam(examId)
      .then((res) => {
        setExamOnState(res.data);

        // set exam on redux
        const { _id: examId, name: examName } = res.data;
        dispatch(setExam({ examId, examName }));

        // set title
        dispatch(setTitle(`${courseName} | ${topicName} | ${examName}`));

        // set questions
        setSimpleQuestions(
          res.data.questions.filter(({ qType }) => qType === "simple")
        );
        setSimpleWithImageQuestions(
          res.data.questions.filter(({ qType }) => qType === "simpleWithPic")
        );
        setImageWithTwoAnswers(
          res.data.questions.filter(
            ({ qType }) => qType === "imageWithTwoAnswers"
          )
        );
        setMultipleOptionQuestions(
          res.data.questions.filter(({ qType }) => qType === "multipleOption")
        );
        setSimpleWithTwoAnswersQuestions(
          res.data.questions.filter(({ qType }) => qType === "twoAnswers")
        );
        setMultipleOptionWithImageQuestions(
          res.data.questions.filter(
            ({ qType }) => qType === "multipleOptionWithPic"
          )
        );
        setDichotomousQuestions(
          res.data.questions.filter(({ qType }) => qType === "dichotomous")
        );
        setDichotomousQuestionsWithImage(
          res.data.questions.filter(
            ({ qType }) => qType === "dichotomousWithPic"
          )
        );
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [courseName, dispatch, examId, topicName]);

  return exam ? (
    <AdminLayout
      leftBarActive="Cursos"
      backBttn={`/admin/courses/edit/topics/${courseId}/${topicId}`}
    >
      <Container fluid>
        {exam.qCounter > exam.questions.length && (
          <Alert variant="danger">
            Este examen no satisface el número mínimo de preguntas.
          </Alert>
        )}
        {/* name */}
        <Row>
          <Col>
            <span className="text-muted">Nombre</span>
            <h1>
              {exam.name}
              <AdminModal
                Form={ExamNameForm}
                formInitialText={exam.name}
                formLabel="Nombre"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h1>
          </Col>
        </Row>
        {/* difficulty */}
        <Row>
          <Col>
            <span className="text-muted">Dificultad</span>
            <h2>{exam.difficulty}</h2>
          </Col>
        </Row>
        {/* duration */}
        <Row>
          <Col>
            <span className="text-muted">Duración</span>
            <h2>
              {exam.duration} {exam.duration === 1 ? "minuto" : "minutos"}
              <AdminModal
                Form={ExamDurationForm}
                formInitialText={exam.duration}
                formLabel="Duración"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h2>
          </Col>
        </Row>
        {/* question counter */}
        <Row>
          <Col>
            <span className="text-muted">Preguntas por examen</span>
            <h2
              className={
                exam.qCounter > exam.questions.length ? "text-danger" : null
              }
            >
              {`${exam.qCounter} preguntas`}
              <AdminModal
                Form={ExamQCounterForm}
                formInitialText={exam.qCounter}
                formLabel="Preguntas por examen"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h2>
          </Col>
        </Row>
        {/* actual number of questions on this exam */}
        <Row>
          <Col>
            <span className="text-muted">Total de preguntas</span>
            <h3>{`${exam.questions.length} preguntas`}</h3>
          </Col>
        </Row>
        {/* description */}
        <Row>
          <Col>
            <span className="text-muted">Descripción</span>
            <h5 className="mb-0">
              {exam.description}
              <AdminModal
                Form={ExamDescriptionForm}
                formInitialText={exam.description}
                formLabel="Descripción"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h5>
          </Col>
        </Row>
        {/* new questions menu */}
        <Row>
          <Col>
            <span className="text-muted">Nuevas preguntas</span>
            {examsList.map((e) => {
              const path = `/admin/courses/edit/exam/${courseId}/${topicId}/${examId}/#${e.name}`;
              return (
                <h5 key={e.name} className="m-0">
                  <Link
                    className={cn(styles.sendIcon, "rounded", "mr-1")}
                    smooth
                    title={`Ir a: ${e.tableHeader}`}
                    to={path}
                  >
                    <i className="fas fa-paper-plane" />
                  </Link>
                  {e.name}
                  {` (${e.data.length})`}
                  <NewQuestionModal Form={e.form} text={e.name} />
                </h5>
              );
            })}
          </Col>
        </Row>
        <hr />
        {/* questions tables */}
        {examsList.map((e) => {
          return (
            <Row key={e.name} id={e.name}>
              <Col>
                <span className="text-muted">
                  {e.tableHeader}
                  {` (${e.data.length})`}
                </span>
                {e.hasQuestions ? (
                  React.createElement(e.table, { questions: e.data }, null)
                ) : (
                  <h5>-</h5>
                )}
              </Col>
            </Row>
          );
        })}
        <br />
        <br />
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminExamDetailPage.displayName = "AdminExamDetailPage";
