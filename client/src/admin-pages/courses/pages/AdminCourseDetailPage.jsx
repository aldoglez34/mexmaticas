import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Col, Row } from "react-bootstrap";
import { fetchOneCourse } from "../../../services";
import { useDispatch } from "react-redux";
import * as adminActions from "../../../redux/actions/admin";
import {
  AdminEditModal,
  AdminLayout,
  AdminRow,
  AdminSpinner,
} from "../../../components";
import {
  CourseActiveForm,
  CourseDescriptionForm,
  CourseNameForm,
  CoursePriceForm,
  CourseSchoolForm,
  CourseSummaryForm,
  DraggableTopics,
} from "../components";
import { formatDate } from "../../../utils/helpers";

export const AdminCourseDetailPage = React.memo((props) => {
  const dispatch = useDispatch();

  const [course, setCourse] = useState();
  const courseId = props.routeProps.match.params.courseId;
  const hasTopics = useMemo(() => Boolean(course?.topics?.length), [course]);

  useEffect(() => {
    fetchOneCourse(courseId)
      .then((res) => {
        setCourse(res.data);
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
    <AdminLayout
      backBttn="/admin/courses"
      expanded
      leftBarActive="Cursos"
      topNavTitle={course?.name}
    >
      <AdminRow
        rowTitle="Nombre"
        value={course.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseNameForm,
            initialValue: course.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Nivel escolar"
        value={course.school}
        icon={{
          hoverText: "Editar nivel escolar",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseSchoolForm,
            initialValue: course.school,
          },
        }}
      />
      <AdminRow
        rowTitle="Precio"
        value={`$${course.price}`}
        icon={{
          hoverText: "Editar precio",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CoursePriceForm,
            initialValue: course.price,
          },
        }}
      />
      <AdminRow
        rowTitle="Estatus"
        value={
          <Badge variant={course.isActive ? "success" : "danger"}>
            {course.isActive ? "Activo" : "No activo"}
          </Badge>
        }
        icon={{
          hoverText: "Editar estatus",
          svg: "edit",
          isDisabled: !hasTopics,
          modal: {
            title: "Editar",
            Form: CourseActiveForm,
            initialValue: course.isActive,
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={course.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseDescriptionForm,
            initialValue: course.description,
          },
        }}
      />
      {/* TODO convert this to AdminRow */}
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
                      <AdminEditModal
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
      <Row className="mb-2">
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
      <AdminRow
        rowTitle="Fecha de creación"
        value={formatDate(course.createdAt, "LL")}
      />
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminCourseDetailPage.displayName = "AdminCourseDetailPage";
