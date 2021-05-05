import React, { useState, useEffect } from "react";
import { AdminLayout, AdminSpinner, CourseItem } from "../components";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Cursos"));

    TeacherAPI.t_fetchCourses()
      .then((res) => {
        // ordering courses by school level
        const rawCourses = res.data;

        const sortedCourses = rawCourses
          .reduce((acc, cv) => {
            let orderNumber;
            switch (cv.school) {
              case "Primaria":
                orderNumber = 1;
                break;
              case "Secundaria":
                orderNumber = 2;
                break;
              case "Preparatoria":
                orderNumber = 3;
                break;
              case "Universidad":
                orderNumber = 4;
                break;
              default:
                break;
            }
            acc.push({ ...cv, orderNumber });
            return acc;
          }, [])
          .sort((a, b) => a.orderNumber - b.orderNumber);

        setCourses(sortedCourses);
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  return courses ? (
    <AdminLayout title="Cursos" leftBarActive="Cursos">
      <Container fluid>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {courses.length ? (
              <>
                <h3 className="mb-3" style={{ color: "#0f5257" }}>
                  Selecciona un curso...
                </h3>
                <ListGroup>
                  {courses.map((c) => (
                    <CourseItem
                      key={c._id}
                      name={c.name}
                      school={c.school}
                      _id={c._id}
                      isActive={c.isActive}
                    />
                  ))}
                </ListGroup>
              </>
            ) : (
              <div className="text-center mt-4">No hay cursos</div>
            )}
            <Button
              variant="dark"
              size="lg"
              className="py-4 mt-4"
              block
              href="/admin/courses/new"
            >
              <h5 className="mb-0 text-light">NUEVO CURSO</h5>
            </Button>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
