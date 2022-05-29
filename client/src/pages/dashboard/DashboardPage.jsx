import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { StudentLayout } from "../../components/Layout";
import { useSelector } from "react-redux";
import { NoCourses, MyCourses } from "./components";
import { fetchDashboard } from "../../services";
import { useDispatch } from "react-redux";
import * as courseActions from "../../redux/actions/course";
import * as examActions from "../../redux/actions/exam";
import * as zenModeActions from "../../redux/actions/zenMode";
import "./dashboardpage.scss";

export const DashboardPage = () => {
  const dispatch = useDispatch();

  const student = useSelector((state) => state.student);
  const course = useSelector((state) => state.course);
  const exam = useSelector((state) => state.exam);
  const zenMode = useSelector((state) => state.zenMode);

  const [myCourses, setMyCourses] = useState();

  useEffect(() => {
    // clear redux
    if (course) dispatch(courseActions.clearCourse());
    if (exam) dispatch(examActions.clearExam());
    if (zenMode) dispatch(zenModeActions.zenModeOff());

    // fetch student's courses
    if (student) {
      fetchDashboard(student._id)
        .then((res) => {
          setMyCourses(res.data.courses);
        })
        .catch((err) => {
          console.log(err);
          alert("Ocurrió un error inesperado");
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, dispatch]);

  return (
    <StudentLayout>
      <Container className="pb-4">
        <h2 className="studentTitle">Bienvenido a tus cursos</h2>
        <br />
        {myCourses ? (
          myCourses.length ? (
            <MyCourses courses={myCourses} />
          ) : (
            <NoCourses />
          )
        ) : (
          <div className="text-center mt-4 pt-4">
            <Spinner animation="border" variant="success" />
          </div>
        )}
      </Container>
    </StudentLayout>
  );
};
