import React, { useState, useEffect } from "react";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { AdminSpinner, AdminLayout } from "../components";

export const AdminStudentAssignPage = React.memo((props) => {
  const [unpurchased, setUnpurchased] = useState(false);

  useEffect(() => {
    const studentId = props.routeProps.match.params.studentId;

    TeacherAPI.t_fetchStudentUnpurchased(studentId)
      .then((res) => setUnpurchased(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [props.routeProps.match.params.studentId]);

  const assignCourse = (courseId) => {
    TeacherAPI.t_assignCourse({
      courseId,
      studentId: props.routeProps.match.params.studentId,
    })
      .then((res) => {
        console.log(res.data);
        window.location.href =
          "/admin/students/" + props.routeProps.match.params.studentId;
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  };

  return unpurchased ? (
    <AdminLayout
      title="Asignar Curso"
      leftBarActive="Alumnos"
      backBttn={"/admin/students/" + props.routeProps.match.params.studentId}
    >
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <h3>Elige un curso de la lista...</h3>
            <span className="mb-4">
              Sólo se muestran cursos que no ha adquirido el alumno
            </span>
            {unpurchased.length ? (
              <ListGroup variant="flush" className="mt-3">
                {unpurchased.map((u) => (
                  <ListGroup.Item key={u._id} className="d-flex py-3">
                    <h4 className="mb-0">{u.name}</h4>
                    <Button
                      size="sm"
                      variant="dark"
                      className="ml-auto"
                      onClick={() => assignCourse(u._id)}
                    >
                      <i className="fas fa-shopping-cart mr-2" />
                      Asignar
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="py-4 text-center">
                <em>No hay cursos disponibles para asignar a este alumno</em>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});
