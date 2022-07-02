import React, { useState, useEffect } from "react";
import { fetchOneStudent } from "../../../services";
import { AdminLayout, AdminRow } from "../../../components";
import { formatDate, getFullName } from "../../../utils/helpers";

export const AdminStudentDetailPage = (props) => {
  const url = new URL(window.location.href);
  const comesFrom =
    url.href.split("comesFrom=").length === 2
      ? url.href.split("comesFrom=").pop()
      : undefined;

  const [student, setStudent] = useState();

  const studentId = props.routeProps.match.params.studentId;

  useEffect(() => {
    fetchOneStudent(studentId)
      .then((res) => setStudent(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [studentId]);

  const studentFullName = `${student?.name ?? ""} ${
    student?.firstSurname ?? ""
  } ${student?.secondSurname ?? ""}`.trim();

  const optionsDropdown = [
    {
      text: "Asignar curso",
      href: `/admin/students/unpurchased/${studentId}`,
    },
    {
      text: "Ver historial",
      href: `/admin/students/history/${studentId}`,
    },
  ];

  return (
    <AdminLayout
      backBttn={comesFrom || "/admin/students"}
      expanded
      leftBarActive="Alumnos"
      optionsDropdown={optionsDropdown}
      topNavTitle={studentFullName}
    >
      <AdminRow rowTitle="Usuario" value={student?.email.split("@", 1)[0]} />
      <AdminRow rowTitle="Correo electrónico" value={student?.email} />
      <AdminRow
        rowTitle="Nombre"
        value={getFullName(
          student?.name,
          student?.firstSurname,
          student?.secondSurname
        )}
      />
      <AdminRow
        rowTitle="Fecha de registro"
        value={formatDate(student?.registeredAt, "LL")}
      />
      <AdminRow
        rowTitle="Cursos"
        list={{
          accessor: "name",
          data: student?.courses,
          icon: {
            getLink: (item) => `/admin/courses/edit/${item._id}`,
            hoverText: "Ir a curso",
            svg: "anchor",
          },
        }}
      />
      <AdminRow
        rowTitle="Exámenes presentados / Calificaciones perfectas"
        value={`${student?.attempts?.length} / ${
          (student?.attempts || []).filter((a) => a.grade === 10).length
        }`}
      />
      <AdminRow
        rowTitle="Medallas"
        list={{ accessor: "name", data: student?.rewards }}
      />
    </AdminLayout>
  );
};
