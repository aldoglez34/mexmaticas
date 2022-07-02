import React, { memo, useEffect, useState } from "react";
import { AdminLayout, AdminRow } from "../../../components";
import { fetchOneTeacher } from "../../../services";
import { formatDate, getFullName } from "../../../utils/helpers";

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

  const teacherFullName = getFullName(
    teacher?.name,
    teacher?.firstSurname,
    teacher?.secondSurname
  );

  return (
    <AdminLayout
      backBttn="/admin/teachers"
      expanded
      leftBarActive="Maestros"
      topNavTitle={teacherFullName}
    >
      <AdminRow rowTitle="Nombre" value={teacherFullName} />
      <AdminRow rowTitle="Cuenta" value={teacher?.email} />
      <AdminRow
        rowTitle="Fecha de Registro"
        value={formatDate(teacher?.createdAt, "LL")}
      />
      <AdminRow
        rowTitle="Salones"
        list={{
          accessor: "name",
          data: teacher?.classrooms,
          icon: {
            getLink: (item) => `/admin/classrooms/edit/${item._id}`,
            hoverText: "Ir a salón",
            svg: "anchor",
          },
        }}
      />
    </AdminLayout>
  );
});

AdminTeacherDetailPage.displayName = "AdminTeacherDetailPage";
