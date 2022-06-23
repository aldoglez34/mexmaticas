import React, { useState, useEffect } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { assignCourse, fetchStudentUnpurchased } from "../../../services";
import { AdminSpinner, AdminLayout } from "../../../components";

export const AdminStudentAssignPage = React.memo((props) => {
  const [unpurchased, setUnpurchased] = useState(false);

  const studentId = props.routeProps.match.params.studentId;

  useEffect(() => {
    fetchStudentUnpurchased(studentId)
      .then((res) => setUnpurchased(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [studentId]);

  const _assignCourse = (courseId) => {
    assignCourse({
      courseId,
      studentId,
    })
      .then((res) => {
        console.log(res.data);
        window.location.href = `/admin/students/${studentId}`;
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  };

  return unpurchased ? (
    <AdminLayout
      backBttn={`/admin/students/${studentId}`}
      leftBarActive="Alumnos"
      topNavTitle="Asignar Curso"
    >
      <span className="mb-4">
        Sólo se muestran cursos que no ha adquirido el alumno.
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
                onClick={() => _assignCourse(u._id)}
              >
                <i className="fas fa-shopping-cart mr-2" />
                Asignar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="mt-4 text-center">
          <small>No hay cursos disponibles para asignar a este alumno.</small>
        </p>
      )}
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminStudentAssignPage.display = "AdminStudentAssignPage";
