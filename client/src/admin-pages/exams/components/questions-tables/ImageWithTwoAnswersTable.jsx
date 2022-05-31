import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { array } from "prop-types";
import { useSelector } from "react-redux";
import { AdminDangerModal, ImageFromFirebase } from "../../../../components";
import { deleteQuestion } from "../../../../services";
import { firebaseStorage } from "../../../../firebase/firebase";
import { EditQuestionModal, ImageWithTwoAnswers } from "..";

export const ImageWithTwoAnswersTable = React.memo(({ questions }) => {
  const courseId = useSelector((state) => state.admin.course.courseId);
  const examId = useSelector((state) => state.admin.exam.examId);

  const handleDeleteQuestion = (questionId, path) => {
    deleteQuestion({ courseId, examId, questionId })
      .then(() => {
        const storageRef = firebaseStorage.ref();
        const fileRef = storageRef.child(path);

        fileRef
          .delete()
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
            alert("Ocurrió un error al borrar la pregunta.");
          });
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
                  Imagen
                </th>
                <th
                  style={{ backgroundColor: "#0f5257" }}
                  className="text-light text-center"
                >
                  Respuestas
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
                        <ImageFromFirebase
                          height="85"
                          path={q.qTechnicalInstruction.imageLink}
                          width="85"
                        />
                      </td>
                      <td className="align-middle">
                        {q.qCorrectAnswers.map((qa, idx) => {
                          return (
                            <React.Fragment key={qa._id}>
                              <span>
                                {String(
                                  `${qa.complementLeft} ${qa.answer} ${qa.complementRight}`
                                ).trim()}
                              </span>
                              {q.qCorrectAnswers.length === idx + 1 ? null : (
                                <hr className="my-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
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
                          Form={ImageWithTwoAnswers}
                          question={q}
                          text="Editar pregunta"
                        />
                        <AdminDangerModal
                          variant="transparent"
                          deleteFn={() =>
                            handleDeleteQuestion(
                              q._id,
                              q.qTechnicalInstruction.imageLink
                            )
                          }
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

ImageWithTwoAnswersTable.propTypes = {
  questions: array.isRequired,
};

ImageWithTwoAnswersTable.displayName = "ImageWithTwoAnswersTable";
