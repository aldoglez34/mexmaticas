import React, { memo, useEffect, useState } from "react";
import { AdminLayout, ReadOnlyRow } from "../../../components";
import { fetchOneTeacher } from "../../../services";
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

  const renderClassroom = (classrooms) => (
    <ReadOnlyRow
      rowTitle="Salones"
      value={
        <ul>
          {classrooms.sort().map((c) => (
            <li key={c._id}>
              {`${c.name} (${c.members.length})`}
              <a href={`/admin/classrooms/edit/${c._id}`} className="ml-1">
                <i className="fas fa-paper-plane" />
              </a>
            </li>
          ))}
        </ul>
      }
    />
  );

  return (
    <AdminLayout
      backBttn="/admin/teachers"
      expanded
      leftBarActive="Maestros"
      topNavTitle={`${teacher?.name ?? ""} ${teacher?.firstSurname ?? ""} ${
        teacher?.secondSurname ?? ""
      }`.trim()}
    >
      <ReadOnlyRow
        rowTitle="Nombre Completo"
        value={`${teacher?.name ?? ""} ${teacher?.firstSurname ?? ""} ${
          teacher?.secondSurname ?? ""
        }`.trim()}
      />
      <ReadOnlyRow rowTitle="Cuenta" value={teacher?.email} />
      <ReadOnlyRow
        icon={<i className="far fa-calendar-alt mr-2" />}
        rowTitle="Fecha de Registro"
        value={formatDate(teacher?.createdAt, "LL")}
      />
      {!isEmpty(teacher?.classrooms)
        ? renderClassroom(teacher.classrooms)
        : null}
    </AdminLayout>
  );
});

AdminTeacherDetailPage.displayName = "AdminTeacherDetailPage";
