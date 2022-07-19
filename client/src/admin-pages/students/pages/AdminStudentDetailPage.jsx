import React, { useState, useEffect } from "react";
import { fetchOneStudent, updateActivityStatus } from "../../../services";
import { AdminLayout, AdminRow } from "../../../components";
import {
  askUserToConfirm,
  formatDate,
  getFullName,
} from "../../../utils/helpers";
import { Badge } from "react-bootstrap";

export const AdminStudentDetailPage = (props) => {
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

  console.log({ student });

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
    "divider",
    {
      text: student?.isDeleted ? "Activar" : "Desactivar",
      fn: () =>
        askUserToConfirm("¿Estás seguro?", () =>
          updateActivityStatus({
            studentId,
            isDeleted: !student?.isDeleted,
          }).then(() => window.location.reload())
        ),
    },
  ];

  return (
    <AdminLayout
      backBttn="/admin/students"
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
        rowTitle="Estatus"
        value={
          <Badge variant={student?.isDeleted ? "danger" : "success"}>
            {student?.isDeleted ? "No activo" : "Activo"}
          </Badge>
        }
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
        rowTitle="Salones"
        list={{
          accessor: "name",
          data: student?.classrooms,
          icon: {
            getLink: (item) => `/admin/classrooms/edit/${item._id}`,
            hoverText: "Ir a salón",
            svg: "anchor",
          },
        }}
      />
      <AdminRow
        rowTitle="Medallas"
        list={{ accessor: "name", data: student?.rewards }}
      />
    </AdminLayout>
  );
};
