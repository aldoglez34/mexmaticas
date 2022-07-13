import React, { memo, useEffect, useState } from "react";
import {
  deleteClassroom,
  fetchClassroomHistory,
  fetchOneClassroom,
} from "../../../services";
import { AdminExportToExcel, AdminLayout, AdminRow } from "../../../components";
import {
  ClassroomDescriptionForm,
  ClassroomInstitutionForm,
  ClassroomNameForm,
  ClassroomSchoolForm,
  ClassroomTeachersForm,
} from "../components/forms";
import { formatDate, getFullName } from "../../../utils/helpers";
import { AdminDeleteModal } from "../../../components/modals/AdminDeleteModal";
import { AddCoursesModal, AddStudentsModal } from "../components/modals";

export const AdminClassroomDetailPage = memo((props) => {
  const [showExportToExcel, setShowExportToExcel] = useState(false);
  const [classroom, setClassroom] = useState();
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const classroomId = props.routeProps.match.params.classroomId;

  const handleDeleteClassroom = async () => {
    try {
      // delete classroom from database
      const deleteRes = await deleteClassroom({ classroomId });
      if (deleteRes.status === 200)
        return (window.location.href = "/admin/classrooms");
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error al intentar borrar el salón.");
    }
  };

  const optionsDropdown = [
    {
      text: "Actualizar cursos",
      modal: {
        Content: AddCoursesModal,
        props: { classroomId },
        size: "lg",
        title: "Actualizar cursos",
      },
    },
    {
      text: "Actualizar alumnos",
      modal: {
        Content: AddStudentsModal,
        props: { classroomId },
        size: "lg",
        title: "Actualizar estudiantes",
      },
    },
    {
      text: "Exportar calificaciones",
      fn: () => setShowExportToExcel(true),
    },
    "divider",
    { text: "Borrar Salón", fn: handleShowModal },
  ];

  useEffect(() => {
    try {
      fetchClassroomHistory(classroomId).then((res) => setHistory(res.data));
      fetchOneClassroom(classroomId).then((res) => setClassroom(res.data));
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error, vuelve a intentarlo.");
    }
  }, [classroomId]);

  const headers = [
    { label: "Fecha", key: "date" },
    { label: "Alumno", key: "student" },
    { label: "Curso", key: "course" },
    { label: "Tema", key: "topic" },
    { label: "Examen", key: "exam" },
    { label: "Calificación", key: "grade" },
  ];

  return (
    <AdminLayout
      backBttn="/admin/classrooms"
      expanded
      leftBarActive="Salones"
      optionsDropdown={optionsDropdown}
      topNavTitle={classroom?.name}
    >
      <AdminRow
        rowTitle="Nombre"
        value={classroom?.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomNameForm,
            initialValue: classroom?.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Maestro"
        value={getFullName(
          classroom?.teacher?.name,
          classroom?.teacher?.firstSurname,
          classroom?.teacher?.secondSurname
        )}
        icon={{
          hoverText: "Editar maestro",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomTeachersForm,
            initialValue: classroom?.teacher?._id,
          },
        }}
      />
      <AdminRow
        rowTitle="Nivel"
        value={classroom?.school}
        icon={{
          hoverText: "Editar nivel",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomSchoolForm,
            initialValue: classroom?.school || "Elige...",
          },
        }}
      />
      <AdminRow
        rowTitle="Escuela"
        value={classroom?.institution?.name}
        icon={{
          hoverText: "Editar escuela",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomInstitutionForm,
            initialValue: classroom?.institution?._id || "Elige...",
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={classroom?.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomDescriptionForm,
            initialValue: classroom?.description,
          },
        }}
      />
      <AdminRow
        rowTitle="Creación"
        value={formatDate(classroom?.createdAt, "LL")}
      />
      <AdminRow
        rowTitle="Cursos"
        list={{
          accessor: "name",
          data: classroom?.courses,
          icon: {
            getLink: (item) => `/admin/courses/edit/${item._id}`,
            hoverText: "Ir a curso",
            svg: "anchor",
          },
        }}
      />
      <AdminRow
        rowTitle="Alumnos"
        list={{
          accessor: ["name", "firstSurname", "secondSurname"],
          data: classroom?.members,
          icon: {
            getLink: (item) => `/admin/students/${item._id}`,
            hoverText: "Ir a alumno",
            svg: "anchor",
          },
        }}
      />
      {/* modals */}
      <AdminDeleteModal
        handleCloseModal={handleCloseModal}
        handleDelete={handleDeleteClassroom}
        modalText={`¿Estás seguro que deseas borrar el salón: ${classroom?.name}?`}
        show={showModal}
      />
      <AdminExportToExcel
        data={history || []}
        fileName={classroom?.name}
        headers={headers}
        modalText="Exporta el historial de calificaciones de los alumnos de este salón."
        setShow={setShowExportToExcel}
        show={showExportToExcel}
        textIfEmpty="Historial vacío."
      />
    </AdminLayout>
  );
});

AdminClassroomDetailPage.displayName = "AdminClassroomDetailPage";
