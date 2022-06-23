import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  fetchCourses,
  fetchOneClassroom,
  updateClassroomCourses,
} from "../../../services";
import { AdminLayout, AdminSpinner, Button } from "../../../components";
import cn from "classnames";

import styles from "./adminaddcoursetoclassroom.module.scss";

// TODO: refactor this
export const AdminAddCourseToClassroom = (props) => {
  const classroomId = props.routeProps.match.params.classroomId;

  const [isLoading, setIsLoading] = useState(false);
  const [defaultCourses, setDefaultCourses] = useState();
  const [allCourses, setAllCourses] = useState();
  const [classroomCourses, setClassroomCourses] = useState([]);

  useEffect(() => {
    fetchOneClassroom(classroomId)
      .then((res) =>
        setDefaultCourses(
          (res.data?.courses || [])
            .map(({ _id, name, school }) => ({
              courseId: _id,
              courseName: `${school.trim()} / ${name.trim()}`,
            }))
            .sort((a, b) => {
              const courseA = a.courseName.toUpperCase().trim();
              const courseB = b.courseName.toUpperCase().trim();
              return courseA < courseB ? -1 : 1;
            })
        )
      )
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [classroomId]);

  useEffect(() => {
    fetchCourses()
      .then((res) => {
        const rawCourses = res.data
          .map(({ _id, name, school }) => ({
            courseId: _id,
            courseName: `${school.trim()} / ${name.trim()}`,
          }))
          .sort((a, b) =>
            a.courseName.toUpperCase().trim() <
            b.courseName.toUpperCase().trim()
              ? -1
              : 1
          );

        // remove the already assigned courses of the selection
        const rawWithoutDefault = rawCourses.filter(
          ({ courseId }) =>
            !(defaultCourses || []).find((dc) => dc.courseId === courseId)
        );

        setClassroomCourses(defaultCourses);
        setAllCourses(rawWithoutDefault);
      })
      .catch((err) => {
        console.log("err", err);
        alert("Ocurrió un error al descargar los alumnos, intenta más tarde.");
      });
  }, [defaultCourses]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const onlyIds = classroomCourses.map(({ courseId }) => courseId);
    updateClassroomCourses({ classroomId, courses: onlyIds })
      .then((res) => window.location.reload())
      .catch((err) => {
        console.log("error", err);
        alert("Ocurrió un error.");
      });
  };

  const isCourseInState = (courseId) =>
    !!(classroomCourses || []).find(
      (s) => String(s.courseId) === String(courseId)
    );

  const handleSelectStudent = (e) => {
    const courseId = e.target.value;
    const courseName = e.target.text;

    // if course selected is in state, delete it
    if (isCourseInState(courseId)) {
      setClassroomCourses((prevState) =>
        prevState.filter((s) => String(s.courseId) !== String(courseId))
      );
      return;
    }

    // if course selected is not in state, add it
    if (!isCourseInState(courseId)) {
      setClassroomCourses((prevState) => [
        ...prevState,
        { courseId, courseName },
      ]);
      return;
    }
  };

  const setClass = (courseId) => {
    if (!isCourseInState(courseId)) {
      cn(styles.option, styles.notSelectedOption);
      return;
    }

    if (isCourseInState(courseId)) {
      cn(styles.option, styles.selectedOption);
      return;
    }
  };

  return (
    <AdminLayout
      backBttn={`/admin/classrooms/edit/${classroomId}`}
      leftBarActive="Salones"
      topNavTitle="Agregar Curso"
      expanded
    >
      <Form>
        <Row>
          <Form.Group as={Col} md="8" className={styles.formGroup}>
            {allCourses ? (
              allCourses.length ? (
                <Form.Control
                  as="select"
                  className={styles.formControl}
                  multiple
                >
                  {allCourses.map((c) => (
                    <option
                      key={c.courseId}
                      onClick={handleSelectStudent}
                      value={c.courseId}
                      className={setClass(c.courseId)}
                    >
                      {c.courseName}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <em>No hay cursos.</em>
              )
            ) : (
              <AdminSpinner />
            )}
          </Form.Group>
          <Col md="4" className="text-left d-flex flex-column">
            <strong>Cursos:</strong>
            <ul className={styles.list}>
              {(classroomCourses || []).map(({ courseId, courseName }) => (
                <li key={courseId}>
                  <small key={courseId}>{courseName}</small>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Form>
      <Button disabled={isLoading} onClick={handleSaveChanges} variant="dark">
        Guardar
      </Button>
    </AdminLayout>
  );
};
