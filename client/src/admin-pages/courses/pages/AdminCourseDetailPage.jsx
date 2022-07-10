import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "react-bootstrap";
import { fetchOneCourse, updateTopicOrder } from "../../../services";
import { useDispatch } from "react-redux";
import * as adminActions from "../../../redux/actions/admin";
import { AdminLayout, AdminRow } from "../../../components";
import {
  CourseActiveForm,
  CourseDescriptionForm,
  CourseNameForm,
  CoursePriceForm,
  CourseSchoolForm,
  CourseSummaryForm,
} from "../components";
import { formatDate } from "../../../utils/helpers";
import { isEmpty } from "lodash";

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

  const optionsDropdown = [
    { text: "Nuevo tema", href: `/admin/courses/courses/newTopic/${courseId}` },
  ];

  const sortedTopics = useMemo(
    () =>
      (course?.topics || [])
        .sort((a, b) => a.topicOrderNumber - b.topicOrderNumber)
        .map((t) => ({
          _id: t._id,
          id: t.topicOrderNumber,
          name: t.name,
        })),
    [course]
  );

  const handleOnChangeDraggableTopic = async (topics) => {
    const changes = topics.reduce((acc, cv, idx) => {
      if (cv.id !== idx + 1)
        acc.push({
          _id: cv._id,
          name: cv.name,
          lastId: cv.id,
          newOrderNumber: idx + 1,
        });
      return acc;
    }, []);

    if (isEmpty(changes)) return;

    try {
      await updateTopicOrder({ courseId, newList: changes });
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error en el servidor");
    }
  };

  return (
    <AdminLayout
      backBttn="/admin/courses"
      expanded
      leftBarActive="Cursos"
      optionsDropdown={optionsDropdown}
      topNavTitle={course?.name}
    >
      <AdminRow
        rowTitle="Nombre"
        value={course?.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseNameForm,
            initialValue: course?.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Nivel"
        value={course?.school}
        icon={{
          hoverText: "Editar nivel",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseSchoolForm,
            initialValue: course?.school,
          },
        }}
      />
      <AdminRow
        rowTitle="Precio"
        value={`$${course?.price}`}
        icon={{
          hoverText: "Editar precio",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CoursePriceForm,
            initialValue: course?.price,
          },
        }}
      />
      <AdminRow
        rowTitle="Estatus"
        tooltip="Sólo puedes activar el curso si tiene temas."
        value={
          <Badge variant={course?.isActive ? "success" : "danger"}>
            {course?.isActive ? "Activo" : "No activo"}
          </Badge>
        }
        icon={{
          hoverText: "Editar estatus",
          svg: "edit",
          isDisabled: !hasTopics,
          modal: {
            title: "Editar",
            Form: CourseActiveForm,
            initialValue: course?.isActive,
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={course?.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseDescriptionForm,
            initialValue: course?.description,
          },
        }}
      />
      <AdminRow
        rowTitle="Resumen"
        tooltip="Separado por comas y utilizado en el landing page."
        value={course?.topicsSummary.toString()}
        icon={{
          hoverText: "Editar resumen",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: CourseSummaryForm,
            initialValue: course?.topicsSummary.toString(),
          },
        }}
      />
      <AdminRow
        rowTitle="Temas"
        tooltip="Lista reordenable"
        list={{
          accessor: "name",
          data: sortedTopics,
          icon: {
            getLink: (item) =>
              `/admin/courses/edit/topics/${courseId}/${item._id}`,
            hoverText: "Ir a tema",
            svg: "anchor",
          },
          onOrderChange: handleOnChangeDraggableTopic,
        }}
      />
      <AdminRow
        rowTitle="Creación"
        value={formatDate(course?.createdAt, "LL")}
      />
    </AdminLayout>
  );
});

AdminCourseDetailPage.displayName = "AdminCourseDetailPage";
