import React, { useState, useEffect } from "react";
import { AdminLayout, AdminSpinner, CourseItem } from "../components";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminCoursesPage = () => {
  const dispatch = useDispatch();

  const [courses, setCourses] = useState();
  const [filtered, setFiltered] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    dispatch(setTitle("Cursos"));
    //
    TeacherAPI.t_fetchCourses()
      .then((res) => {
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
        //
        setCourses(sortedCourses);
        setFiltered(sortedCourses);
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const filterCourses = (criteria) => {
    setFilter(criteria === filter ? null : criteria);
    setFiltered(
      criteria === filter
        ? courses
        : courses.filter((c) => c.school === criteria)
    );
  };

  const filters = (
    <div className="d-flex">
      <Button
        disabled={courses ? false : true}
        active={filter === "Primaria" ? true : false}
        variant="outline-light"
        className="shadow-sm"
        onClick={() => filterCourses("Primaria")}
      >
        Primaria
      </Button>
      <Button
        disabled={courses ? false : true}
        active={filter === "Secundaria" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterCourses("Secundaria")}
      >
        Secundaria
      </Button>
      <Button
        disabled={courses ? false : true}
        active={filter === "Preparatoria" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterCourses("Preparatoria")}
      >
        Preparatoria
      </Button>
      <Button
        disabled={courses ? false : true}
        active={filter === "Universidad" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterCourses("Universidad")}
      >
        Universidad
      </Button>
    </div>
  );

  const optionsDropdown = [
    {
      text: "Nuevo Curso",
      fn: () => (window.location.href = "/admin/courses/new"),
    },
  ];

  return filtered ? (
    <AdminLayout
      buttons={filters}
      leftBarActive="Cursos"
      optionsDropdown={optionsDropdown}
    >
      <Container fluid>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {filtered.length ? (
              <>
                <h3 className="mb-3" style={{ color: "#0f5257" }}>
                  Selecciona un curso...
                </h3>
                <ListGroup>
                  {filtered.map((c) => (
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
              <div className="text-center mt-4">No hay cursos.</div>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
