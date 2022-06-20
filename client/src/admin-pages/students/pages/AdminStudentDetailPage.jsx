import React, { useState, useEffect } from "react";
import { fetchOneStudent } from "../../../services";
import { AdminLayout, AdminSpinner, ReadOnlyRow } from "../../../components";
import { formatDate } from "../../../utils/helpers";

export const AdminStudentDetailPage = React.memo((props) => {
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
      fn: () =>
        (window.location.href = `/admin/students/unpurchased/${studentId}`),
    },
    {
      text: "Ver historial",
      fn: () => (window.location.href = `/admin/students/history/${studentId}`),
    },
  ];

  return student ? (
    <AdminLayout
      backBttn={comesFrom || "/admin/students"}
      expanded
      leftBarActive="Alumnos"
      optionsDropdown={optionsDropdown}
      topNavTitle={studentFullName}
    >
      <ReadOnlyRow rowTitle="Usuario" value={student.email.split("@", 1)[0]} />
      <ReadOnlyRow rowTitle="Correo electrónico" value={student.email} />
      <ReadOnlyRow
        rowTitle="Nombre completo"
        value={`${student.name} ${student.firstSurname} ${student.secondSurname}`}
      />
      <ReadOnlyRow
        icon={<i className="far fa-calendar-alt mr-2" />}
        rowTitle="Fecha de registro"
        value={formatDate(student.registeredAt, "LL")}
      />
      <ReadOnlyRow
        rowTitle="Cursos"
        list={{ data: student.courses, accessor: "name" }}
      />
      <ReadOnlyRow
        rowTitle="Exámenes presentados / Calificaciones perfectas"
        value={`${student.attempts.length} / ${
          student.attempts.filter((a) => a.grade === 10).length
        }`}
      />
      <ReadOnlyRow
        rowTitle="Medallas"
        list={{ data: student.rewards, accessor: "name" }}
      />
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminStudentDetailPage.displayName = "AdminStudentDetailPage";
