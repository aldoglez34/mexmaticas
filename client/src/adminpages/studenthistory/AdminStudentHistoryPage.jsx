import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { AdminLayout, AdminSpinner } from "../components";
import moment from "moment";
import "moment/locale/es";

export const AdminStudentHistoryPage = React.memo((props) => {
  const [history, setHistory] = useState(false);

  useEffect(() => {
    const studentId = props.routeProps.match.params.studentId;

    TeacherAPI.t_fetchStudentHistory(studentId)
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [props.routeProps.match.params.studentId]);

  return history ? (
    <AdminLayout
      title="Historial de Exámenes"
      leftBarActive="Alumnos"
      backBttn={"/admin/students/" + props.routeProps.match.params.studentId}
    >
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <h3 className="mb-3">Exámenes...</h3>
            {history.length ? (
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th
                      className="py-3 text-center"
                      style={{ backgroundColor: "#f4fbf8" }}
                    >
                      <h5 className="mb-0">Fecha</h5>
                    </th>
                    <th
                      className="py-3 text-center"
                      style={{ backgroundColor: "#f4fbf8" }}
                    >
                      <h5 className="mb-0">Examen</h5>
                    </th>
                    <th
                      className="py-3 text-center"
                      style={{ backgroundColor: "#f4fbf8" }}
                    >
                      <h5 className="mb-0">Calificación</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => {
                    return (
                      <tr key={h._id}>
                        <td>{moment(h.date).format("L")}</td>
                        <td>{h.exam.name}</td>
                        <td className="text-center">{h.grade}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="py-4 text-center">
                <em>Este alumno no ha presentado ningún examen</em>
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

AdminStudentHistoryPage.displayName = "AdminStudentHistoryPage";
