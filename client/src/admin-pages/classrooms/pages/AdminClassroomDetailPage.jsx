import React, { memo, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  deleteClassroom,
  fetchClassroomHistory,
  fetchOneClassroom,
} from "../../../services";
import {
  AdminLayout,
  AdminModal,
  AdminRow,
  AdminSpinner,
  ExportHistoryToExcel,
  Button,
} from "../../../components";
import {
  ClassroomDescriptionForm,
  ClassroomInstitutionForm,
  ClassroomNameForm,
  ClassroomSchoolForm,
  ClassroomTeachersForm,
} from "../components";
import { formatDate, getFullName } from "../../../utils/helpers";

export const AdminClassroomDetailPage = memo((props) => {
  const [showExportToExcel, setShowExportToExcel] = useState(false);
  const [classroom, setClassroom] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [history, setHistory] = useState();

  const classroomId = props.routeProps.match.params.classroomId;

  useEffect(() => {
    fetchOneClassroom(classroomId)
      .then((res) => setClassroom(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [classroomId]);

  const handleDeleteClassroom = async () => {
    setIsDeleting(true);
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const optionsDropdown = [
    {
      text: "Agregar curso",
      href: `/admin/classrooms/edit/${classroomId}/course/add`,
    },
    {
      text: "Agregar alumnos",
      href: `/admin/classrooms/edit/${classroomId}/student/add`,
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
    } catch (err) {
      console.log(err);
    }
  }, [classroomId]);

  return classroom && history ? (
    <AdminLayout
      backBttn="/admin/classrooms"
      expanded
      leftBarActive="Salones"
      optionsDropdown={optionsDropdown}
      topNavTitle={classroom?.name}
    >
      <AdminRow
        rowTitle="Nombre"
        value={classroom.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomNameForm,
            initialValue: classroom.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Maestro"
        value={getFullName(
          classroom.teacher?.name,
          classroom.teacher?.firstSurname,
          classroom.teacher?.secondSurname
        )}
        icon={{
          hoverText: "Editar maestro",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomTeachersForm,
            initialValue: classroom.teacher?._id,
          },
        }}
      />
      <AdminRow
        rowTitle="Nivel Educativo"
        value={classroom.school}
        icon={{
          hoverText: "Editar nivel educativo",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomSchoolForm,
            initialValue: classroom.school || "Elige...",
          },
        }}
      />
      <AdminRow
        rowTitle="Escuela"
        value={classroom.institution?.name}
        icon={{
          hoverText: "Editar escuela",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomInstitutionForm,
            initialValue: classroom.institution?._id || "Elige...",
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={classroom.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ClassroomDescriptionForm,
            initialValue: classroom.description,
          },
        }}
      />
      <AdminRow
        rowTitle="Fecha de Creación"
        value={formatDate(classroom.createdAt, "LL")}
      />
      <AdminRow
        rowTitle="Cursos"
        list={{
          accessor: "name",
          data: classroom.courses,
          icon: {
            hoverText: "Ir a curso",
            svg: "anchor",
            link: {
              url: "/admin/courses/edit/",
              urlAccessor: "_id",
            },
          },
        }}
      />
      <AdminRow
        rowTitle={`Alumnos (${classroom.members.length})`}
        list={{
          accessor: ["name", "firstSurname", "secondSurname"],
          data: classroom.members,
          icon: {
            hoverText: "Ir a alumno",
            svg: "anchor",
            link: {
              url: "/admin/students/",
              urlAccessor: "_id",
            },
          },
        }}
      />
      {/* delete classroom modal */}
      <AdminModal
        handleClose={handleCloseModal}
        show={showModal}
        title="Borrar"
      >
        {isDeleting ? (
          <div className="py-4">
            <strong className="mb-2">Borrando...</strong>
            <br />
            <br />
            <Spinner variant="danger" animation="border" role="status">
              <span className="sr-only">Borrando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <p className="text-center">{`¿Estás seguro que deseas borrar el salón: ${classroom.name}?`}</p>
            <div className="d-flex flex-row justify-content-center">
              <Button size="sm" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                className="ml-2"
                onClick={handleDeleteClassroom}
                size="sm"
                variant="danger"
              >
                Borrar
                <i className="fas fa-trash-alt ml-2" />
              </Button>
            </div>
          </>
        )}
      </AdminModal>
      {/* export students history modal */}
      {showExportToExcel && (
        <ExportHistoryToExcel
          data={history}
          fileName={classroom?.name}
          setShow={setShowExportToExcel}
          show={showExportToExcel}
        />
      )}
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminClassroomDetailPage.displayName = "AdminClassroomDetailPage";
