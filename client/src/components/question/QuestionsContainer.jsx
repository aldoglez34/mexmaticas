import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { array, bool } from "prop-types";
import * as examActions from "../../redux/actions/exam";
import {
  HelpModalSM,
  Progress,
  QInstruction,
  QMultipleChoice,
  QTechnicalInstruction,
  TimeOutModal,
  Timer,
} from "../";
import { ExitButton } from "../";
import API from "../../utils/API";
import {
  CorrectModal,
  FreestyleQPoints,
  IncorrectModal,
  ScoreModal,
} from "../../pages/freestyle/components";

export const QuestionsContainer = React.memo(
  ({ questions, isFreestyle = false }) => {
    const dispatch = useDispatch();

    // timeout modal
    const [showTimeOut, setShowTimeOut] = useState(false);

    // data from redux
    const course = useSelector((state) => state.course);
    const exam = useSelector((state) => state.exam);
    const student = useSelector((state) => state.student);

    // questions data
    const [number, setNumber] = useState(1);
    const [question, setQuestion] = useState();
    const [answers, setAnswers] = useState([]);

    // timer
    const [secondsLeft, setSecondsLeft] = useState(exam.duration * 60 - 1);

    // question points, modals, score points and totalscoremodal for freestyle
    const [questionValue, setQuestionValue] = useState();
    const [showCorrect, setShowCorrect] = useState(false);
    const [showIncorrect, setShowIncorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [showScoreModal, setShowScoreModal] = useState(false);

    // this is where the value from the multiple choice is stored
    const [choice, setChoice] = useState();
    const getValueFromMultipleChoice = (value) => setChoice(value);

    const getGrade = () => {
      const corrects = answers.reduce((acc, cv) => {
        if (cv.qCorrectAnswers.answer === cv.userAnswers.answer) acc++;
        return acc;
      }, 0);
      const incorrects = answers.reduce((acc, cv) => {
        if (cv.qCorrectAnswers.answer !== cv.userAnswers.answer) acc++;
        return acc;
      }, 0);
      const grade = Math.round((corrects / answers.length) * 100) / 10 || 0;
      return { corrects, incorrects, grade };
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") pushQuestion();
    };

    const validateAnswer = (answer) => {
      const userAnswer = String(answer.userAnswers.answer).trim();
      const correctAnswer = String(answer.qCorrectAnswers.answer).trim();

      const isUserAnswerCorrect = userAnswer === correctAnswer;

      if (isUserAnswerCorrect && question.qValue) {
        // set qValue, show modal and increase points
        setQuestionValue(question.qValue);
        setShowCorrect(true);
        setScore((prevState) => prevState + question.qValue);
      }

      if (!isUserAnswerCorrect && question.qValue) {
        // set qVlaue, show modal and decrease points but stop at 0
        setQuestionValue(question.qValue);
        setShowIncorrect(true);
        if (score - question.qValue > 0) setScore(score - question.qValue);
        if (score - question.qValue <= 0) setScore(0);
      }
    };

    const getAnswerObject = () => {
      // first get correct answers from the question
      const correctAnswers = question.qCorrectAnswers.map((a) => a.answer);

      // then check if the type of question is multiple choice
      const isMultipleChoice = question.qMultipleChoice ? true : false;

      // if it's not multiple choice, get the values from the inputs
      if (!isMultipleChoice) {
        const userAnswers = [];
        const answersCounter = question.qCorrectAnswers.length;
        for (let i = 0; i < answersCounter; i++) {
          let a = document.getElementById(`answer${i}`).value;
          userAnswers.push(String(a).trim());
        }
        return {
          ...question,
          userAnswers: { type: "text", answer: String(userAnswers).trim() },
          qCorrectAnswers: {
            type: "text",
            answer: String(correctAnswers).trim(),
          },
        };
      }
      // if it's multiple choice, get the choice selected from the state "choice"
      if (isMultipleChoice) {
        return {
          ...question,
          userAnswers: { type: question.qMultipleChoice.type, answer: choice },
          qCorrectAnswers: {
            type: question.qMultipleChoice.type,
            answer: String(correctAnswers).trim(),
          },
        };
      }
    };

    const pushQuestion = () => {
      // build the answer object
      const answer = getAnswerObject();

      // freestyle only
      if (isFreestyle) validateAnswer(answer);

      // push to state
      setAnswers((prevState) => [...prevState, answer]);

      // clear choice and advance to next question
      setChoice();
      setNumber((prevState) => prevState + 1);
    };

    const pushFreestyleAttempt = () => {
      // ignore the user test luis@test.com
      const isStudentTest = student.email === "luis@test.com";
      if (!isStudentTest) {
        API.registerFreestyleAttempt({
          courseId: course._id,
          score: score,
          studentId: student._id,
          topicId: exam.topicId,
          username: student.username,
        })
          .then(() => setShowScoreModal(true))
          .catch((err) => {
            console.log("error", err);
            alert(
              "Ocurrió un error en el servidor, no se pudo registrar su calificación."
            );
            window.location.href = "/";
          });
      }
      if (isStudentTest) setShowScoreModal(true);
    };

    const pushRegularAttempt = (corrects, incorrects, grade) => {
      API.registerAttempt({
        courseId: course._id,
        examDifficulty: exam.difficulty,
        examId: exam._id,
        examLink: exam.reward.link,
        examName: exam.name,
        grade,
        studentId: student._id,
        topicId: exam.topicId,
      })
        .then((res) => {
          const {
            hasExamBeenApprovedBefore,
            isFreestyleUnlocked,
            unlockedExam,
          } = res.data;
          // save results in redux (so they can be read in the results page)
          dispatch(
            examActions.setResults({
              answers,
              corrects,
              grade,
              hasExamBeenApprovedBefore,
              incorrects,
              isFreestyleUnlocked,
              unlockedExam,
            })
          );
        })
        .catch((err) => {
          console.log("error", err);
          alert(
            "Ocurrió un error en el servidor, no se pudo registrar su calificación."
          );
          window.location.href = "/";
        });
    };

    const isLastQuestion = number === questions.length;
    const isTimeOver = secondsLeft === 0;
    const hasExamEnded = number > questions.length;

    // handles timer
    useEffect(() => {
      // decrement seconds
      if (secondsLeft >= 0)
        setTimeout(() => setSecondsLeft((prevState) => prevState - 1), 1000);

      // if it's a regular exam (not freestyle) and time over, show timeOutModal
      if (isTimeOver && !isFreestyle) setShowTimeOut(true);

      // if no minutes left, show score
      if (isTimeOver && isFreestyle) pushFreestyleAttempt();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft]);

    // sets new question or ends exam
    useEffect(() => {
      // if exam hasnt ended, set new question
      if (!hasExamEnded)
        setQuestion(questions.filter((q) => q.qNumber === number)[0]);

      // get the correct answers, the incorrect answers and the grade (only for regular exams, not freestyle)
      const { corrects, incorrects, grade } = getGrade();

      if (hasExamEnded && !isFreestyle)
        pushRegularAttempt(corrects, incorrects, grade);

      if (hasExamEnded && isFreestyle) pushFreestyleAttempt();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, choice, dispatch, number, questions]);

    // redirects user when result changes are updated (only for regular exams)
    useEffect(() => {
      if (exam.results) window.location.href = "/course/exam/results";
    }, [exam.results]);

    return (
      question &&
      (!hasExamEnded ? (
        <>
          {/* top container */}
          <Container>
            <Timer
              minutesLeft={Math.floor(secondsLeft / 60) + 1}
              secondsLeft={secondsLeft}
            />
            {isFreestyle && <FreestyleQPoints score={score} />}
          </Container>
          {/* middle container */}
          <Container className="mt-3">
            <div style={{ backgroundColor: "#e9ecef" }}>
              {!isFreestyle && (
                <Progress current={number} total={questions.length} />
              )}
              <Container>
                <Row>
                  <Col
                    lg={{ span: 7, offset: 2 }}
                    className="px-3"
                    style={{ paddingTop: "15px", paddingBottom: "45px" }}
                  >
                    {/* question value */}
                    {isFreestyle && (
                      <div className="mt-4">
                        <strong className="text-muted">
                          {question.qValue}
                          <span className="ml-1">
                            {question.qValue > 1 ? "puntos" : "punto"}
                          </span>
                        </strong>
                      </div>
                    )}
                    {/* instruction */}
                    <QInstruction
                      qNumber={question.qNumber}
                      qInstruction={question.qInstruction}
                    />
                    {/* technical instruction */}
                    {question.qTechnicalInstruction && (
                      <QTechnicalInstruction
                        type={question.qTechnicalInstruction.type}
                        text={question.qTechnicalInstruction.text}
                        imageLink={question.qTechnicalInstruction.imageLink}
                      />
                    )}
                    {/* multiple choices */}
                    {question.qMultipleChoice ? (
                      <QMultipleChoice
                        type={question.qMultipleChoice.type}
                        textChoices={question.qMultipleChoice.textChoices}
                        imageChoices={question.qMultipleChoice.imageChoices}
                        choiceSelected={choice}
                        getValueFromMultipleChoice={getValueFromMultipleChoice}
                      />
                    ) : (
                      question.qCorrectAnswers.map((ca, idx) => (
                        <div key={ca._id} className="d-flex flex-row mt-3 mb-2">
                          {/* left comment */}
                          {ca.complementLeft && (
                            <h4 className="mr-2 mb-0">
                              <small>{ca.complementLeft}</small>
                            </h4>
                          )}
                          {/* input */}
                          <input
                            type="text"
                            maxLength="20"
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                            className="border rounded px-2"
                            id={`answer${idx}`}
                          />
                          {/* right comment */}
                          {ca.complementRight && (
                            <h4 className="ml-2 mb-0">
                              <small>{ca.complementRight}</small>
                            </h4>
                          )}
                        </div>
                      ))
                    )}
                    {/* question comments */}
                    <div className="mt-3 mb-2">
                      {question.qComment &&
                        question.qComment.split("\\n").map((c) => {
                          return (
                            <span key={c} className="d-block text-muted">
                              {String(c).trim()}
                            </span>
                          );
                        })}
                    </div>
                    {/* button */}
                    <div className="mt-3">
                      <Button
                        className="shadow-sm genericButton"
                        onClick={pushQuestion}
                      >
                        {isLastQuestion ? "Finalizar" : "Siguiente"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Container>
          {/* bottom container */}
          <Container className="d-flex mt-3">
            <div className="ml-auto">
              <HelpModalSM question={question} />
              <ExitButton url={"/course/#" + exam.topicName} />
            </div>
          </Container>
          {/* modals for regular exams */}
          {!isFreestyle && (
            <TimeOutModal
              showTimeOut={showTimeOut}
              url={`/course/#${exam.topicName}`}
            />
          )}
          {/* modals for freestlye only */}
          {isFreestyle && (
            <>
              <ScoreModal
                image={"/images/freestyle.png"}
                score={score}
                show={showScoreModal}
                url={`/course/#${exam.topicName}`}
              />
              <CorrectModal
                showCorrect={showCorrect}
                setShowCorrect={setShowCorrect}
                qValue={questionValue}
              />
              <IncorrectModal
                showIncorrect={showIncorrect}
                setShowIncorrect={setShowIncorrect}
                qValue={questionValue}
              />
            </>
          )}
        </>
      ) : (
        <div className="text-center mt-4 pt-4">
          <Spinner animation="border" variant="success" />
          <ScoreModal
            image={"/images/freestyle.png"}
            score={score}
            show={showScoreModal}
            url={`/course/#${exam.topicName}`}
          />
        </div>
      ))
    );
  }
);

QuestionsContainer.propTypes = {
  questions: array.isRequired,
  isFreestyle: bool,
};
