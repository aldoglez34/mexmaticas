import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StudentLayout } from "../../components";
import { Container, Spinner } from "react-bootstrap";
import { fetchExamInfo } from "../../services";
import * as zenModeActions from "../../redux/actions/zenMode";
import { QuestionsContainer } from "../../components";
import "./exampage.scss";

export const ExamPage = () => {
  const dispatch = useDispatch();

  const [exam, setExam] = useState();

  const reduxexam = useSelector((state) => state.exam);

  useEffect(() => {
    try {
      fetchExamInfo(reduxexam._id).then((res) => {
        const realQuestionsCounter = res.data.questions.length;
        if (realQuestionsCounter < reduxexam.qCounter) {
          alert(
            "Ocurrió un error con este examen. Ponte en contacto con tu maestro."
          );
          window.location.href = "/course";
        } else {
          dispatch(zenModeActions.zenModeOn());
          setExam(res.data);
        }
      });
    } catch (err) {
      console.log(err);
      alert(
        "Ocurrió un error con este examen. Ponte en contacto con tu maestro."
      );
      window.location.href = "/course";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StudentLayout>
      {exam ? (
        <>
          <Container>
            <h1 className="examNameStyle mt-4">{exam.name}</h1>
          </Container>
          <QuestionsContainer questions={exam.questions} />
          <br />
          <br />
        </>
      ) : (
        <div className="text-center mt-4 pt-4">
          <Spinner animation="border" variant="success" />
        </div>
      )}
    </StudentLayout>
  );
};
