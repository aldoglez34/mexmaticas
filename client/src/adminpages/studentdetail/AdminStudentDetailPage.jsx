import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { AdminLayout, AdminSpinner } from "../components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import moment from "moment";
import "moment/locale/es";

export const AdminStudentDetailPage = React.memo((props) => {
  const url = new URL(window.location.href);
  const comesFrom =
    url.href.split("comesFrom=").length === 2
      ? url.href.split("comesFrom=").pop()
      : undefined;

  const dispatch = useDispatch();

  const [student, setStudent] = useState();

  const studentId = props.routeProps.match.params.studentId;

  useEffect(() => {
    TeacherAPI.t_fetchOneStudent(studentId)
      .then((res) => {
        setStudent(res.data);
        const { name, firstSurname, secondSurname } = res.data;
        dispatch(setTitle(`${name} ${firstSurname} ${secondSurname}`));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [studentId, dispatch]);

  return student ? (
    <AdminLayout
      backBttn={comesFrom || "/admin/students"}
      leftBarActive="Alumnos"
    >
      <Container fluid>
        {/* username */}
        <Row>
          <Col>
            <span className="text-muted">Usuario</span>
            <h1>{student.email.split("@", 1)[0]}</h1>
          </Col>
        </Row>
        {/* email */}
        <Row>
          <Col>
            <span className="text-muted">Correo electrónico</span>
            <h2>{student.email}</h2>
          </Col>
        </Row>
        {/* name */}
        <Row>
          <Col>
            <span className="text-muted">Nombre completo</span>
            <h3>
              {`${student.name} ${student.firstSurname} ${student.secondSurname}`}
            </h3>
          </Col>
        </Row>
        {/* registered at */}
        <Row>
          <Col>
            <span className="text-muted">Fecha de registro</span>
            <h5>
              <i className="far fa-calendar-alt mr-2" />
              {moment(student.registeredAt).format("LL")}
            </h5>
          </Col>
        </Row>
        {/* courses */}
        <Row>
          <Col>
            <span className="text-muted d-flex">Cursos</span>
            {student.courses.length ? (
              <ul className="mb-2">
                {student.courses.map((c) => {
                  return (
                    <li key={c._id}>
                      <h5 className="mb-0">{c.name}</h5>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <h5>-</h5>
            )}
            <Button
              variant="dark"
              size="sm"
              href={`/admin/students/unpurchased/${studentId}`}
            >
              <i className="fas fa-shopping-cart mr-2" />
              <span>Asignar curso</span>
            </Button>
          </Col>
        </Row>
        {/* attempts */}
        <Row>
          <Col>
            <span className="text-muted d-flex mt-2">
              Exámenes presentados / Calificaciones perfectas
            </span>
            <h2 className="mb-1">
              {student.attempts.length +
                " / " +
                student.attempts.filter((a) => a.grade === 10).length}
            </h2>
            <Button
              variant="dark"
              size="sm"
              href={`/admin/students/history/${studentId}`}
            >
              <i className="fas fa-history mr-2" />
              <span>Ver historial</span>
            </Button>
          </Col>
        </Row>
        {/* medallas */}
        <Row>
          <Col>
            <span className="text-muted d-flex mt-2">Medallas</span>
            {student.rewards.length ? (
              <ul>
                {student.rewards.map((r) => {
                  return (
                    <li key={r.name}>
                      <h5 className="mb-0">{r.name}</h5>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <h5>Sin medallas</h5>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminStudentDetailPage.displayName = "AdminStudentDetailPage";
