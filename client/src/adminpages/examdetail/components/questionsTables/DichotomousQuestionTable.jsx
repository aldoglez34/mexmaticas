import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { array } from "prop-types";
import { useSelector } from "react-redux";
import { AdminDangerModal } from "../../../components";
import TeacherAPI from "../../../../utils/TeacherAPI";
import { DichotomousQuestion, EditQuestionModal } from "../";

export const DichotomousQuestionTable = React.memo(({ questions }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);
  const examId = useSelector((state) => state.admin.exam.examId);

  const handleDeleteQuestion = (questionId) => {
    TeacherAPI.t_deleteQuestion({ courseId, examId, questionId })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  };

  return (
    <Row>
      <Col>
        <div className="mt-2 d-flex flex-column">
          <Table bordered striped size="sm">
            <thead>
              <tr>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  #
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  Instrucción
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  I. Técnica
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  Opciones
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  Respuesta
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  Comentario
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                ></th>
              </tr>
            </thead>
            <tbody>
              {questions
                .sort((a, b) => String(a._id) - String(b._id))
                .map((q, idx) => {
                  return (
                    <tr key={q._id}>
                      <td className="align-middle text-center">{idx + 1}</td>
                      <td className="align-middle">{q.qInstruction}</td>
                      <td className="align-middle">
                        {q.qTechnicalInstruction
                          ? q.qTechnicalInstruction.text
                          : null}
                      </td>
                      <td className="align-middle">
                        {q.qMultipleChoice.textChoices.length
                          ? q.qMultipleChoice.textChoices.map((c, idx) => (
                              <React.Fragment key={idx}>
                                <span className="mb-0">{`${c}`}</span>
                                {q.qMultipleChoice.textChoices.length ===
                                idx + 1 ? null : (
                                  <hr className="my-0" />
                                )}
                              </React.Fragment>
                            ))
                          : null}
                      </td>
                      <td className="align-middle">
                        {q.qCorrectAnswers[0].answer}
                      </td>
                      <td className="align-middle">
                        {q.qComment &&
                          q.qComment.split("\\n").map((c) => {
                            return (
                              <span key={c} className="d-block">
                                {String(c).trim()}
                              </span>
                            );
                          })}
                      </td>
                      <td className="text-center align-middle">
                        <EditQuestionModal
                          Form={DichotomousQuestion}
                          question={q}
                          text="Editar pregunta"
                        />
                        <AdminDangerModal
                          variant="transparent"
                          deleteFn={() => handleDeleteQuestion(q._id)}
                          icon={<i className="fas fa-times" />}
                          modalText={`¿Estás seguro que deseas borrar esta pregunta?`}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>
  );
});

DichotomousQuestionTable.propTypes = {
  questions: array.isRequired,
};

DichotomousQuestionTable.displayName = "DichotomousQuestionTable";
