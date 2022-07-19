import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { StudentLayout } from "../../components";
import { useSelector } from "react-redux";
import { fetchFreestyle } from "../../services";
import { QuestionsContainer } from "../../components";

export const FreestylePage = () => {
  const course = useSelector((state) => state.course);
  const exam = useSelector((state) => state.exam);

  const [freestyle, setFreestyle] = useState();

  useEffect(() => {
    try {
      fetchFreestyle(course._id, exam.topicId).then((res) => {
        if (!res.data.length) {
          alert(
            "Ocurrió un error con este examen. Ponte en contacto con tu maestro."
          );
          window.location.href = "/course";
        } else {
          setFreestyle(res.data);
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
    <StudentLayout isZen={true}>
      {freestyle ? (
        <>
          <Container>
            <h1 className="examNameStyle mt-4">
              {exam.name}
              <small className="ml-2">
                <i className="fas fa-bolt" />
              </small>
            </h1>
          </Container>
          <QuestionsContainer questions={freestyle} isFreestyle={true} />
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
