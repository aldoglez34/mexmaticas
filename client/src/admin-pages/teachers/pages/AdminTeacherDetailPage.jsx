import React, { memo, useEffect, useState } from "react";
import { AdminLayout, AdminSpinner } from "../../../components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../redux/actions/admin";
import { fetchOneTeacher } from "../../../services";

export const AdminTeacherDetailPage = memo((props) => {
  const dispatch = useDispatch();

  const [teacher, setTeacher] = useState();

  const teacherId = props.routeProps.match.params.teacherId;

  console.log({ teacher });

  useEffect(() => {
    fetchOneTeacher(teacherId)
      .then((res) => {
        setTeacher(res.data);
        const { name, firstSurname, secondSurname } = res.data;
        dispatch(setTitle(`${name} ${firstSurname} ${secondSurname}`));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch, teacherId]);

  return teacher ? (
    <AdminLayout leftBarActive="Maestros" backBttn="/admin/teachers" expanded>
      <span>asdasd</span>
      {/* <EditableRow
        {...{
          formInitialText: teacher.name,
          ModalFormComponent: ClassroomNameForm,
          modalLabel: "Nombre",
          rowTitle: "Nombre",
          value: teacher.name,
        }}
      /> */}
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminTeacherDetailPage.displayName = "AdminTeacherDetailPage";
