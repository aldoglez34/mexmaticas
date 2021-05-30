import React, { useState, useEffect } from "react";
import { AdminLayout, AdminSpinner } from "../components";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { StudentItem } from "./components";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminStudentsPage = () => {
  const dispatch = useDispatch();

  const [students, setStudents] = useState();

  useEffect(() => {
    dispatch(setTitle("Alumnos"));

    TeacherAPI.t_fetchStudents()
      .then((res) => setStudents(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  return students ? (
    <AdminLayout leftBarActive="Alumnos">
      <Container fluid>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {students.length ? (
              <>
                <h3 className="mb-1" style={{ color: "#0f5257" }}>
                  Selecciona un alumno...
                </h3>
                <h5 className="mb-3" style={{ color: "#0f5257" }}>
                  {`Total alumnos: ${students.length}`}
                </h5>
                <ListGroup>
                  {students.map((s) => (
                    <StudentItem
                      key={s._id}
                      name={`${s.name} ${s.firstSurname}`}
                      email={s.email}
                      _id={s._id}
                    />
                  ))}
                </ListGroup>
              </>
            ) : (
              <div className="text-center mt-4">No hay alumnos</div>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
