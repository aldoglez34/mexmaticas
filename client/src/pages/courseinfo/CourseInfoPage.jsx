import React, { useState, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { ScrollButton } from "../../components/scrollbutton/ScrollButton";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { CourseInfoCard } from "./components";
import API from "../../utils/API";
import { BackButton } from "../../components";
import { useDispatch, useSelector } from "react-redux";

import styles from "./courseinfopage.module.scss";

export const CourseInfoPage = React.memo((props) => {
  const dispatch = useDispatch();

  const [courses, setCourses] = useState();

  const school = props.routeProps.match.params.school;

  const student = useSelector((state) => state.student);
  const purchase = useSelector((state) => state.purchase);
  const studentId = (student && student._id) || "Guest";

  useEffect(() => {
    API.fetchCoursesBySchool(school, studentId)
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, actualiza la página");
      });
  }, [dispatch, purchase, school, studentId]);

  const setDescription = () => {
    switch (school) {
      case "Primaria":
        return "Compuesto por las bases de la Aritmética este curso es ideal para que los alumnos desde 3er grado hasta 6to desarrollen y practiquen sus habilidades lógico-matemáticas, así como para los estudiantes        que necesiten fortalecer sus bases en Aritmética puedan disponer del curso en cualquier momento del día.";
      case "Secundaria":
        return "La secundaria es una de las etapas más importantes de la vida ya que es donde empieza la transición de niño a adulto; las matemáticas pueden parecer igual de confusas para un adolescente, sin embargo este curso ha sido diseñado de una forma tal que el alumno aprenda y refuerce los conocimientos básicos del Álgebra y esté preparado para enfrentar los cursos posteriores en preparatoria.";
      case "Preparatoria":
        return "Independientemente de la carrera por la cual se llegue a decidir, la Trigonometría, Álgebra y Estadística son de los retos que el estudiante en Preparatoria puede llegar a enfrentar, el curso ha sido pensado para acompañar, practicar y aprender estos temas que lo ayudarán a prepararse de tal forma que en su vida universitaria el alumno pueda llevar una vida equilibrada entre asignaciones.";
      case "Universidad":
        return "lorem ipsum";
      default:
        return null;
    }
  };

  return (
    <Layout backgroundColor="white">
      <Container
        style={{
          paddingTop: "40px",
          marginBottom: "80px",
        }}
      >
        <BackButton to="/" />
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <div className="text-center">
              <h1 className={styles.courseinfoheader}>{school}</h1>
            </div>
            <p className="lead text-left text-md-center mt-3">
              {setDescription()}
            </p>
          </Col>
        </Row>
        <div className="d-flex flex-wrap justify-content-center my-3">
          {courses ? (
            courses.length ? (
              courses.map((c) => (
                <CourseInfoCard
                  courseId={c._id}
                  isCoursePurchased={c.isCoursePurchased}
                  key={c._id}
                  lessonCounter={c.topics.length}
                  price={c.price}
                  school={school}
                  title={c.name}
                  topics={c.topics
                    .sort((a, b) => a.topicOrderNumber - b.topicOrderNumber)
                    .reduce((acc, cv) => {
                      acc.push(cv.name);
                      return acc;
                    }, [])}
                />
              ))
            ) : (
              <></>
            )
          ) : (
            <div className="my-4 text-center" style={{ marginTop: "150px" }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
        </div>
      </Container>
      <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
    </Layout>
  );
});

CourseInfoPage.displayName = "CourseInfoPage";
