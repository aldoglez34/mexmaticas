import React, { memo, useEffect, useState } from "react";
import { fetchOneClassroom } from "../../../services";
import { AdminRow, TeacherLayout } from "../../../components";
import { formatDate } from "../../../utils/helpers";
import { errorLogger } from "../../../errors/errorLogger";

export const TeacherClassroomDetail = memo((props) => {
  const [classroom, setClassroom] = useState();

  const classroomId = props.routeProps.match.params.classroomId;

  useEffect(() => {
    try {
      fetchOneClassroom(classroomId).then((res) => setClassroom(res.data));
    } catch (err) {
      errorLogger(err);
    }
  }, [classroomId]);

  return (
    <TeacherLayout
      backBttn="/teacher/classrooms"
      expanded
      leftBarActive="Salones"
      topNavTitle={classroom?.name}
    >
      <AdminRow rowTitle="Nombre" value={classroom?.name} />
      <AdminRow rowTitle="Nivel" value={classroom?.school} />
      <AdminRow rowTitle="Escuela" value={classroom?.institution?.name} />
      <AdminRow rowTitle="Descripción" value={classroom?.description} />
      <AdminRow
        rowTitle="Creación"
        value={formatDate(classroom?.createdAt, "LL")}
      />
      <AdminRow
        rowTitle="Cursos"
        list={{
          accessor: "name",
          data: classroom?.courses,
        }}
      />
      <AdminRow
        rowTitle="Alumnos"
        list={{
          accessor: ["name", "firstSurname", "secondSurname"],
          data: classroom?.members,
        }}
      />
    </TeacherLayout>
  );
});

TeacherClassroomDetail.displayName = "TeacherClassroomDetail";
