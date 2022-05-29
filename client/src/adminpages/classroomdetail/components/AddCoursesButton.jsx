import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { fetchCourses, updateClassroomCourses } from "../../../services";
import { AdminSpinner } from "../../components";
import { array } from "prop-types";
import cn from "classnames";

import styles from "./addstudentsbutton.module.scss";

export const AddCoursesButton = React.memo(({ defaultCourses }) => {
  const url = new URL(window.location.href);
  const classroomId = url.href.split("/").pop();

  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [allCourses, setAllCourses] = useState();
  const [classroomCourses, setClassroomCourses] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      fetchCourses()
        .then((res) => {
          const rawCourses = res.data
            .map(({ _id, name, school }) => ({
              courseId: _id,
              courseName: `${school.trim()} / ${name.trim()}`,
            }))
            .sort((a, b) =>
              String(`${a.courseName}`).toUpperCase().trim() <
              String(`${b.courseName}`).toUpperCase().trim()
                ? -1
                : 1
            );

          // remove the already assigned courses of the selection
          const rawWithoutDefault = rawCourses.filter(
            ({ courseId }) =>
              !defaultCourses.find((dc) => dc.courseId === courseId)
          );

          setClassroomCourses(defaultCourses);
          setAllCourses(rawWithoutDefault);
        })
        .catch((err) => {
          console.log("err", err);
          alert(
            "Ocurrió un error al descargar los alumnos, intenta más tarde."
          );
        });
    }
  }, [defaultCourses, show]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const onlyIds = classroomCourses.map(({ courseId }) => courseId);
    updateClassroomCourses({ classroomId, courses: onlyIds })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log("error", err);
        alert("Ocurrió un error.");
      });
  };

  const isCourseInState = (courseId) => {
    return !!classroomCourses.find(
      (s) => String(s.courseId) === String(courseId)
    );
  };

  const handleSelectStudent = (e) => {
    const courseId = e.target.value;
    const courseName = e.target.text;

    // if course selected is in state, delete it
    if (isCourseInState(courseId))
      return setClassroomCourses((prevState) =>
        prevState.filter((s) => String(s.courseId) !== String(courseId))
      );

    // if course selected is not in state, add it
    if (!isCourseInState(courseId))
      return setClassroomCourses((prevState) => [
        ...prevState,
        { courseId, courseName },
      ]);
  };

  const setClass = (courseId) => {
    if (!isCourseInState(courseId))
      return cn(styles.option, styles.notSelectedOption);
    if (isCourseInState(courseId))
      return cn(styles.option, styles.selectedOption);
  };

  return (
    <>
      <Button
        className="mt-1 shadow-sm"
        onClick={handleShow}
        variant="dark"
        size="sm"
      >
        <i className="fas fa-plus-square mr-2" />
        <span>Agregar Cursos</span>
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
        <Modal.Body className="bg-light py-4 rounded shadow text-center">
          <div className="d-flex">
            <h3 className="mb-0 text-dark">Agregar Cursos</h3>
            <Button
              variant="link"
              className="text-dark ml-auto"
              onClick={handleClose}
            >
              <i className="fas fa-times" />
            </Button>
          </div>
          <div className="my-2">
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
                    {classroomCourses.map(({ courseId, courseName }) => (
                      <li key={courseId}>
                        <small key={courseId}>{courseName}</small>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Form>
          </div>
          <Button
            disabled={isLoading}
            block
            onClick={handleSaveChanges}
            size="lg"
            variant="dark"
          >
            Guardar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
});

AddCoursesButton.propTypes = {
  defaultCourses: array.isRequired,
};

AddCoursesButton.displayName = "AddCoursesButton";
