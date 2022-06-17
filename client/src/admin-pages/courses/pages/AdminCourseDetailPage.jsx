import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Col, Row } from "react-bootstrap";
import { fetchOneCourse } from "../../../services";
import { useDispatch } from "react-redux";
import * as adminActions from "../../../redux/actions/admin";
import {
  AdminLayout,
  AdminModal,
  AdminSpinner,
  EditableRow,
  ReadOnlyRow,
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
    <AdminLayout leftBarActive="Cursos" backBttn="/admin/courses" expanded>
      <EditableRow
        {...{
          formInitialText: course.name,
          ModalFormComponent: CourseNameForm,
          modalLabel: "Nombre",
          rowTitle: "Nombre",
          value: course.name,
        }}
      />
      <EditableRow
        {...{
          formInitialText: course.school,
          ModalFormComponent: CourseSchoolForm,
          modalLabel: "Nivel escolar",
          rowTitle: "Nivel escolar",
          value: course.school,
        }}
      />
      <EditableRow
        {...{
          formInitialText: course.price,
          ModalFormComponent: CoursePriceForm,
          modalLabel: "Precio",
          rowTitle: "Precio",
          value: `$${course.price}`,
        }}
      />
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
            <small>
              <Badge variant={course.isActive ? "success" : "danger"}>
                {course.isActive ? "Activo" : "No activo"}
              </Badge>
            </small>
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
      <EditableRow
        {...{
          formInitialText: course.description,
          ModalFormComponent: CourseDescriptionForm,
          modalLabel:
            "Descripción (Utiliza el símbolo \n para saltos de línea)",
          rowTitle: "Descripción",
          value: course.description,
        }}
      />
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
      <ReadOnlyRow
        icon={<i className="far fa-calendar-alt mr-2" />}
        rowTitle="Fecha de creación"
        value={formatDate(course.createdAt, "LL")}
      />
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminCourseDetailPage.displayName = "AdminCourseDetailPage";
