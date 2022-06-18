import React, { memo, useEffect, useState } from "react";
import {
  AdminLayout,
  AdminSpinner,
  DivisionRow,
  ReadOnlyRow,
} from "../../../components";
import { fetchOneTeacher } from "../../../services";
import { Col, Row } from "react-bootstrap";
import { isEmpty } from "lodash";
import { formatDate } from "../../../utils/helpers";

export const AdminTeacherDetailPage = memo((props) => {
  const [teacher, setTeacher] = useState();

  const teacherId = props.routeProps.match.params.teacherId;

  useEffect(() => {
    fetchOneTeacher(teacherId)
      .then((res) => setTeacher(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [teacherId]);

  const getCoursesList = (courses) => {
    if (!courses) return;
    return !isEmpty(courses) ? (
      <ul>
        {courses.map((c) => (
          <li key={c._id}>{c.name}</li>
        ))}
      </ul>
    ) : (
      "Sin Cursos"
    );
  };

  const getMembersList = (members) => {
    if (!members) return;
    return !isEmpty(members) ? (
      <ul>
        {members.map((m) => (
          <li
            key={m._id}
          >{`${m.name} ${m.firstSurname} ${m.secondSurname} (${m.email})`}</li>
        ))}
      </ul>
    ) : (
      "Sin Alumnos"
    );
  };

  const renderClassroom = () => (
    <>
      <DivisionRow text="Datos del Salón" />
      <ReadOnlyRow rowTitle="Nombre" value={teacher.classroom?.name} />
      <ReadOnlyRow
        rowTitle="Nivel Educativo"
        value={teacher.classroom?.school}
      />
      <ReadOnlyRow
        rowTitle="Descripción"
        value={teacher.classroom?.description}
      />
      <ReadOnlyRow
        rowTitle="Cursos"
        value={getCoursesList(teacher.classroom?.courses)}
      />
      <ReadOnlyRow
        rowTitle="Alumnos"
        value={getMembersList(teacher.classroom?.members)}
      />
    </>
  );

  const renderNoClassroom = () => (
    <Row className="mb-2">
      <Col>
        <span className="text-muted">Sin salón.</span>
      </Col>
    </Row>
  );

  return teacher ? (
    <AdminLayout
      backBttn="/admin/teachers"
      expanded
      leftBarActive="Maestros"
      topNavTitle={`${teacher?.name ?? ""} ${teacher?.firstSurname ?? ""} ${
        teacher?.secondSurname ?? ""
      }`.trim()}
    >
      <DivisionRow text="Datos del Maestro" isTitle />
      <ReadOnlyRow
        rowTitle="Nombre Completo"
        value={`${teacher.name} ${teacher.firstSurname} ${teacher.secondSurname}`}
      />
      <ReadOnlyRow rowTitle="Cuenta" value={teacher.email} />
      <ReadOnlyRow
        icon={<i className="far fa-calendar-alt mr-2" />}
        rowTitle="Fecha de Registro"
        value={formatDate(teacher.createdAt, "LL")}
      />
      {!!teacher.classroom?._id ? renderClassroom() : renderNoClassroom()}
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminTeacherDetailPage.displayName = "AdminTeacherDetailPage";
