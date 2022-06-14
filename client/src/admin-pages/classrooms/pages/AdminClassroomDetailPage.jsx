import React, { memo, useEffect, useState } from "react";
import { Button, Col, Image, Modal, Row, Spinner } from "react-bootstrap";
import {
  deleteClassroom,
  fetchClassroomHistory,
  fetchOneClassroom,
} from "../../../services";
import {
  AdminLayout,
  AdminSpinner,
  EditableRow,
  ExportHistoryToExcel,
  ListGroupItem,
  ReadOnlyRow,
} from "../../../components";
import {
  AddCoursesButton,
  AddStudentsButton,
  ClassroomDescriptionForm,
  ClassroomInstitutionForm,
  ClassroomNameForm,
  ClassroomSchoolForm,
  ClassroomTeachersForm,
} from "../components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../redux/actions/admin";
import moment from "moment";
import "moment/locale/es";

export const AdminClassroomDetailPage = memo((props) => {
  const [showExportToExcel, setShowExportToExcel] = useState(false);
  const [classroom, setClassroom] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [history, setHistory] = useState();

  const dispatch = useDispatch();

  const classroomId = props.routeProps.match.params.classroomId;

  useEffect(() => {
    fetchOneClassroom(classroomId)
      .then((res) => {
        setClassroom(res.data);
        const { name } = res.data;
        dispatch(setTitle(name));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [classroomId, dispatch]);

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
    { text: "Borrar Salón", fn: handleShowModal },
    {
      text: "Exportar calificaciones a .csv",
      fn: () => setShowExportToExcel(true),
    },
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
    >
      <EditableRow
        {...{
          formInitialText: classroom.name,
          ModalFormComponent: ClassroomNameForm,
          modalLabel: "Nombre",
          rowTitle: "Nombre",
          value: classroom.name,
        }}
      />
      <EditableRow
        {...{
          formInitialText: classroom.teacher?._id,
          ModalFormComponent: ClassroomTeachersForm,
          modalLabel: "Maestro",
          rowTitle: "Maestro",
          value: String(
            `${classroom.teacher?.name ?? ""} ${
              classroom.teacher?.firstSurname ?? ""
            } ${classroom.teacher?.secondSurname ?? ""}`
          ).trim(),
        }}
      />
      <EditableRow
        {...{
          formInitialText: classroom.school || "Elige...",
          ModalFormComponent: ClassroomSchoolForm,
          modalLabel: "Nivel educativo",
          rowTitle: "Nivel educativo",
          value: classroom.school || "-",
        }}
      />
      <EditableRow
        {...{
          formInitialText: classroom.institution?._id || "Elige...",
          ModalFormComponent: ClassroomInstitutionForm,
          modalLabel: "Escuela",
          rowTitle: "Escuela",
          value: classroom.institution?.name || "-",
        }}
      />
      <EditableRow
        {...{
          formInitialText: classroom.description,
          ModalFormComponent: ClassroomDescriptionForm,
          modalLabel: "Descripción",
          rowTitle: "Descripción",
          value: classroom.description,
        }}
      />
      <ReadOnlyRow
        icon={<i className="far fa-calendar-alt mr-2" />}
        rowTitle="Fecha de creación"
        value={moment(classroom.createdAt).format("LL")}
      />
      <Row className="mb-2">
        <Col>
          <span className="text-muted">Cursos</span>
          {classroom.courses.length ? (
            <ul className="mb-2">
              {classroom.courses.map((c) => (
                <li key={c._id}>
                  <h5 className="mb-0">{c.name}</h5>
                </li>
              ))}
            </ul>
          ) : (
            <h5 className="mb-0">-</h5>
          )}
          <AddCoursesButton
            defaultCourses={classroom.courses
              .map(({ _id, name, school }) => ({
                courseId: _id,
                courseName: `${school.trim()} / ${name.trim()}`,
              }))
              .sort((a, b) =>
                String(`${a.courseName}`).toUpperCase().trim() <
                String(`${b.courseName}`).toUpperCase().trim()
                  ? -1
                  : 1
              )}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="text-muted d-block">{`Miembros (${classroom.members.length})`}</span>
          <div>
            {classroom.members.length ? (
              <div className="my-2">
                <Row>
                  <Col md={{ offset: 0, span: 8 }}>
                    {classroom.members
                      .sort((a, b) =>
                        String(`${a.name} ${a.firstSurname}`)
                          .toUpperCase()
                          .trim() <
                        String(`${b.name} ${b.firstSurname}`)
                          .toUpperCase()
                          .trim()
                          ? -1
                          : 1
                      )
                      .map((s) => (
                        <ListGroupItem
                          key={s._id}
                          link={`/admin/students/${
                            s._id
                          }${`/comesFrom=/admin/classrooms/edit/${s._id}`}`}
                        >
                          <h4>
                            {String(`${s.name} ${s.firstSurname}`).trim()}
                          </h4>
                          <span>
                            <i className="fas fa-user-graduate mr-2" />
                            {s.email}
                          </span>
                        </ListGroupItem>
                      ))}
                  </Col>
                </Row>
              </div>
            ) : (
              <h5>-</h5>
            )}
          </div>
          <AddStudentsButton
            defaultMembers={classroom.members.map((s) => ({
              studentId: s._id,
              studentName: `${s.name} ${s.firstSurname} ${s.secondName} - ${s.email}`,
            }))}
          />
        </Col>
      </Row>
      {/* delete classroom modal */}
      <Modal centered onHide={handleCloseModal} show={showModal}>
        <Modal.Body className="bg-light rounded shadow text-center py-4">
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
              <Image
                className="mb-3"
                height="130"
                src="/images/trash.png"
                width="130"
              />
              <div className="lead text-center mt-2">{`¿Estás seguro que deseas borrar el salón: ${classroom.name}?`}</div>
              <div className="d-flex flex-row justify-content-center mt-4">
                <Button variant="dark" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  className="ml-2"
                  onClick={handleDeleteClassroom}
                >
                  Borrar
                  <i className="fas fa-trash-alt ml-2" />
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
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
