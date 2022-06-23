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

  return (
    <AdminLayout
      backBttn="/admin/teachers"
      expanded
      leftBarActive="Maestros"
      topNavTitle={`${teacher?.name ?? ""} ${teacher?.firstSurname ?? ""} ${
        teacher?.secondSurname ?? ""
      }`.trim()}
    >
      <AdminRow
        rowTitle="Nombre"
        value={getFullName(
          teacher?.name,
          teacher?.firstSurname,
          teacher?.secondSurname
        )}
      />
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
            hoverText: "Ir a salón",
            svg: "anchor",
            link: {
              url: "/admin/classrooms/edit/",
              urlAccessor: "_id",
            },
          },
        }}
      />
    </AdminLayout>
  );
});

AdminTeacherDetailPage.displayName = "AdminTeacherDetailPage";
