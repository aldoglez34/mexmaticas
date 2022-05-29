import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { fetchStudents, updateClassroomMembers } from "../../../services";
import { AdminSpinner } from "../../components";
import { array } from "prop-types";
import cn from "classnames";

import styles from "./addstudentsbutton.module.scss";

export const AddStudentsButton = React.memo(({ defaultMembers }) => {
  const url = new URL(window.location.href);
  const classroomId = url.href.split("/").pop();

  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [allStudents, setAllStudents] = useState();
  const [classroomStudents, setClassroomStudents] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      fetchStudents()
        .then((res) => {
          const rawStudents = res.data
            .map(({ _id, email, firstSurname, name }) => ({
              _id,
              email: email.trim(),
              name: String(`${name} ${firstSurname}`).trim(),
            }))
            .sort((a, b) =>
              String(`${a.name}`).toUpperCase().trim() <
              String(`${b.name}`).toUpperCase().trim()
                ? -1
                : 1
            );
          setClassroomStudents(defaultMembers);
          setAllStudents(rawStudents);
        })
        .catch((err) => {
          console.log("err", err);
          alert(
            "Ocurrió un error al descargar los alumnos, intenta más tarde."
          );
        });
    }
  }, [defaultMembers, show]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const onlyIds = classroomStudents.map(({ studentId }) => studentId);
    updateClassroomMembers({ classroomId, members: onlyIds })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log("error", err);
        alert("Ocurrió un error.");
      });
  };

  const isStudentInState = (studentId) => {
    return !!classroomStudents.find(
      (s) => String(s.studentId) === String(studentId)
    );
  };

  const handleSelectStudent = (e) => {
    const studentId = e.target.value;
    const studentName = e.target.text;

    // if user selected is in state, delete it
    if (isStudentInState(studentId))
      return setClassroomStudents((prevState) =>
        prevState.filter((s) => String(s.studentId) !== String(studentId))
      );

    // if user selected is not in state, add it
    if (!isStudentInState(studentId))
      return setClassroomStudents((prevState) => [
        ...prevState,
        { studentId, studentName },
      ]);
  };

  const setClass = (studentId) => {
    if (!isStudentInState(studentId))
      return cn(styles.option, styles.notSelectedOption);
    if (isStudentInState(studentId))
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
        <i className="fas fa-user-plus mr-2" />
        <span>Agregar Alumnos</span>
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
        <Modal.Body className="bg-light py-4 rounded shadow text-center">
          <div className="d-flex">
            <h3 className="mb-0 text-dark">Agregar Alumnos</h3>
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
                  {allStudents ? (
                    allStudents.length ? (
                      <Form.Control
                        as="select"
                        className={styles.formControl}
                        multiple
                      >
                        {allStudents.map((s) => (
                          <option
                            key={s._id}
                            onClick={handleSelectStudent}
                            value={s._id}
                            className={setClass(s._id)}
                          >{`${s.name} - ${s.email}`}</option>
                        ))}
                      </Form.Control>
                    ) : (
                      <em>No hay alumnos.</em>
                    )
                  ) : (
                    <AdminSpinner />
                  )}
                </Form.Group>
                <Col md="4" className="text-left d-flex flex-column">
                  <strong>Alumnos:</strong>
                  <ul className={styles.list}>
                    {classroomStudents.map(({ studentId, studentName }) => (
                      <li key={studentId}>
                        <small key={studentId}>{studentName}</small>
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

AddStudentsButton.propTypes = {
  defaultMembers: array.isRequired,
};

AddStudentsButton.displayName = "AddStudentsButton";
