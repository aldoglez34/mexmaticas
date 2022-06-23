import React, { useEffect, useState } from "react";
import { AdminLayout, AdminSpinner, Button } from "../../../components";
import { Col, Form, Row } from "react-bootstrap";
import {
  fetchOneClassroom,
  fetchStudents,
  updateClassroomMembers,
} from "../../../services";
import cn from "classnames";

import styles from "./adminaddstudenttoclassroom.module.scss";

// TODO: refactor this
export const AdminAddStudentToClassroom = (props) => {
  const classroomId = props.routeProps.match.params.classroomId;

  const [isLoading, setIsLoading] = useState(false);
  const [defaultMembers, setDefaultMembers] = useState();
  const [allStudents, setAllStudents] = useState();
  const [classroomStudents, setClassroomStudents] = useState([]);

  useEffect(() => {
    fetchOneClassroom(classroomId)
      .then((res) =>
        setDefaultMembers(
          (res.data?.members || []).map((s) => ({
            studentId: s._id,
            studentName: `${s.name} ${s.firstSurname} ${s.secondName} - ${s.email}`,
          }))
        )
      )
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [classroomId]);

  useEffect(() => {
    fetchStudents()
      .then((res) => {
        const rawStudents = res.data
          .map(({ _id, email, firstSurname, name }) => ({
            _id,
            email: email.trim(),
            name: `${name} ${firstSurname}`.trim(),
          }))
          .sort((a, b) =>
            a.name.toUpperCase().trim() < b.name.toUpperCase().trim() ? -1 : 1
          );
        setClassroomStudents(defaultMembers);
        setAllStudents(rawStudents);
      })
      .catch((err) => {
        console.log("err", err);
        alert("Ocurrió un error al descargar los alumnos, intenta más tarde.");
      });
  }, [defaultMembers]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const onlyIds = classroomStudents.map(({ studentId }) => studentId);
    updateClassroomMembers({ classroomId, members: onlyIds })
      .then((res) => window.location.reload())
      .catch((err) => {
        console.log("error", err);
        alert("Ocurrió un error.");
      });
  };

  const isStudentInState = (studentId) =>
    !!(classroomStudents || []).find(
      (s) => String(s.studentId) === String(studentId)
    );

  const handleSelectStudent = (e) => {
    const studentId = e.target.value;
    const studentName = e.target.text;

    // if user selected is in state, delete it
    if (isStudentInState(studentId)) {
      setClassroomStudents((prevState) =>
        prevState.filter((s) => String(s.studentId) !== String(studentId))
      );
      return;
    }

    // if user selected is not in state, add it
    if (!isStudentInState(studentId)) {
      setClassroomStudents((prevState) => [
        ...prevState,
        { studentId, studentName },
      ]);
      return;
    }
  };

  const setClass = (studentId) => {
    if (!isStudentInState(studentId)) {
      cn(styles.option, styles.notSelectedOption);
      return;
    }
    if (isStudentInState(studentId)) {
      cn(styles.option, styles.selectedOption);
      return;
    }
  };

  return (
    <AdminLayout
      backBttn={`/admin/classrooms/edit/${classroomId}`}
      expanded
      leftBarActive="Salones"
      topNavTitle="Agregar Alumnos"
    >
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
              {(classroomStudents || []).map(({ studentId, studentName }) => (
                <li key={studentId}>
                  <small key={studentId}>{studentName}</small>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Form>
      <Button disabled={isLoading} onClick={handleSaveChanges}>
        Guardar
      </Button>
    </AdminLayout>
  );
};
