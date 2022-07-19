import React, { useState, useEffect } from "react";
import { StudentLayout } from "../../components";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { CourseInfoCard } from "./components";
import { fetchCoursesBySchool } from "../../services";
import { useDispatch, useSelector } from "react-redux";

import styles from "./courseinfopage.module.scss";

export const CourseInfoPage = (props) => {
  const dispatch = useDispatch();

  const [courses, setCourses] = useState();

  const schoolLevel = props.routeProps.match.params.school;

  const student = useSelector((state) => state.student);
  const purchase = useSelector((state) => state.purchase);
  const studentId = (student && student._id) || "Guest";

  useEffect(() => {
    fetchCoursesBySchool(schoolLevel, studentId)
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, actualiza la página");
      });
  }, [dispatch, purchase, schoolLevel, studentId]);

  const schoolLevels = {
    Primaria: {
      text: "Compuesto por las bases de la aritmética este curso es ideal para que los alumnos desde primero hasta sexto grado desarrollen y practiquen sus habilidades lógico-matemáticas, así como para los estudiantes que necesiten fortalecer sus bases en aritmética puedan disponer del curso en cualquier momento del día.",
      image: "/images/primaria.png",
    },
    Secundaria: {
      text: "La secundaria es una de las etapas más importantes de la vida ya que es donde empieza la transición de niño a adulto; las matemáticas pueden parecer igual de confusas para un adolescente, sin embargo este curso ha sido diseñado de una forma tal que el alumno aprenda y refuerce los conocimientos básicos del álgebra y esté preparado para enfrentar los cursos posteriores en preparatoria.",
      image: "/images/secundaria.png",
    },
    Preparatoria: {
      text: "Independientemente de la carrera por la cual se llegue a decidir, la trigonometría, la geometría y el álgebra son de los retos que el estudiante en Preparatoria puede llegar a enfrentar, el curso ha sido pensado para acompañar, practicar y aprender estos temas que lo ayudarán a prepararse de tal forma que en su vida universitaria el alumno pueda llevar una vida equilibrada entre asignaciones.",
      image: "/images/preparatoria.png",
    },
    Universidad: {
      text: "Estos cursos están diseñados para sumergir al alumno que haya decidido tomar alguna carrera del área físico-matemáticas en el cálculo diferencial, integral y álgebra lineal para que así durante su vida estudiantil pueda enfrentar con bases sólidas los temas más complejos que tienen como raíz de todo estos temas antes mencionados.",
      image: "/images/universidad.png",
    },
  };

  return (
    <StudentLayout showScrollButton isContainer={false}>
      <Container>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <div className="text-center">
              <h1 className={styles.courseinfoheader}>{schoolLevel}</h1>
            </div>
            <div className="text-center">
              <Image
                height="100"
                src={schoolLevels[schoolLevel].image}
                width="100"
              />
              <p className="mt-3">{schoolLevels[schoolLevel].text}</p>
            </div>
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
                  school={schoolLevel}
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
    </StudentLayout>
  );
};
