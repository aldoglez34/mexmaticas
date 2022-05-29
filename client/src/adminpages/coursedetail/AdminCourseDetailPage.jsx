import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { fetchOneCourse } from "../../services";
import { useDispatch } from "react-redux";
import * as adminActions from "../../redux/actions/admin";
import { AdminLayout, AdminModal, AdminSpinner } from "../components";
import {
  CourseActiveForm,
  CourseDescriptionForm,
  CourseNameForm,
  CoursePriceForm,
  CourseSchoolForm,
  CourseSummaryForm,
  DraggableTopics,
} from "./components";
import moment from "moment";
import "moment/locale/es";

export const AdminCourseDetailPage = React.memo((props) => {
  const [course, setCourse] = useState();

  const dispatch = useDispatch();

  const courseId = props.routeProps.match.params.courseId;

  const hasTopics = useMemo(() => Boolean(course?.topics?.length), [course]);

  useEffect(() => {
    fetchOneCourse(courseId)
      .then((res) => {
        setCourse(res.data);
        dispatch(adminActions.setTitle(res.data.name));
        dispatch(
          adminActions.setCourse({
            courseId: res.data._id,
            courseName: res.data.name,
            courseSchool: res.data.school,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [courseId, dispatch]);

  return course ? (
    <AdminLayout leftBarActive="Cursos" backBttn="/admin/courses">
      <Container fluid>
        {/* course id */}
        <Row>
          <Col>
            <span className="text-muted">ID</span>
            <h4 className="mb-3">{course._id}</h4>
          </Col>
        </Row>
        {/* course name */}
        <Row>
          <Col>
            <span className="text-muted">Nombre</span>
            <h1>
              {course.name}
              <AdminModal
                Form={CourseNameForm}
                formInitialText={course.name}
                formLabel="Nombre"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h1>
          </Col>
        </Row>
        {/* grado escolar */}
        <Row>
          <Col>
            <span className="text-muted">Nivel</span>
            <h2>
              {course.school}
              <AdminModal
                Form={CourseSchoolForm}
                formInitialText={course.school}
                formLabel="Nivel escolar"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h2>
          </Col>
        </Row>
        {/* precio */}
        <Row>
          <Col>
            <span className="text-muted">Precio</span>
            <h2>
              {"$" + course.price}
              <AdminModal
                Form={CoursePriceForm}
                formInitialText={course.price}
                formLabel="Precio"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h2>
          </Col>
        </Row>
        {/* status */}
        <Row>
          <Col>
            <span className="text-muted">
              Estatus
              {!hasTopics && (
                <>
                  {" "}
                  <small>
                    (para activar este curso es necesario agregar temas)
                  </small>
                </>
              )}
            </span>
            <h4 className="mb-3">
              {course.isActive ? (
                <Badge variant="success">Activo</Badge>
              ) : (
                <Badge variant="danger">No activo</Badge>
              )}
              {hasTopics && (
                <AdminModal
                  Form={CourseActiveForm}
                  formInitialText={course.isActive}
                  formLabel="Estatus"
                  icon={<i className="fas fa-pen-alt" />}
                />
              )}
            </h4>
          </Col>
        </Row>
        {/* description */}
        <Row>
          <Col>
            <span className="text-muted">Descripción</span>
            <h5>
              {course.description}
              <AdminModal
                Form={CourseDescriptionForm}
                formInitialText={course.description}
                formLabel="Descripción (Utiliza el símbolo \n para saltos de línea)"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h5>
          </Col>
        </Row>
        {/* summary */}
        <Row>
          <Col>
            <span className="text-muted">
              Resumen <small>(para el landing page)</small>
            </span>
            <ul className="mb-1 mt-2">
              {course.topicsSummary.map((t, idx) => {
                return (
                  <li key={idx}>
                    <h5>
                      {t}
                      {idx === course.topicsSummary.length - 1 ? (
                        <AdminModal
                          Form={CourseSummaryForm}
                          formInitialText={course.topicsSummary.toString()}
                          formLabel="Resumen"
                          icon={<i className="fas fa-pen-alt" />}
                        />
                      ) : null}
                    </h5>
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>
        {/* topics */}
        <Row>
          <Col>
            <span className="text-muted">
              Temas <small>(lista reordenable)</small>
            </span>
            <DraggableTopics
              courseId={courseId}
              topics={course.topics
                .sort((a, b) => a.topicOrderNumber - b.topicOrderNumber)
                .map((t) => ({
                  _id: t._id,
                  id: t.topicOrderNumber,
                  name: t.name,
                }))}
            />
            <Button
              variant="dark"
              size="sm"
              href={`/admin/courses/courses/newTopic/${courseId}`}
            >
              <i className="fas fa-plus-square mr-2" />
              <span>Nuevo Tema</span>
            </Button>
          </Col>
        </Row>
        {/* created at */}
        <Row className="mt-2">
          <Col>
            <span className="text-muted">Fecha de creación</span>
            <h5>
              <i className="far fa-calendar-alt mr-2" />
              {moment(course.createdAt).format("LL")}
            </h5>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminCourseDetailPage.displayName = "AdminCourseDetailPage";
