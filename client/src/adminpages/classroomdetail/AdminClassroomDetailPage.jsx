import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import {
  AdminLayout,
  AdminModal,
  AdminSpinner,
  ExportHistoryToExcel,
} from "../components";
import {
  AddCoursesButton,
  AddStudentsButton,
  ClassroomDescriptionForm,
  ClassroomInstitutionForm,
  ClassroomNameForm,
  ClassroomSchoolForm,
} from "./components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import { StudentItem } from "../students/components";
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
    TeacherAPI.t_fetchOneClassroom(classroomId)
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
      const deleteRes = await TeacherAPI.t_deleteClassroom({ classroomId });
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
      TeacherAPI.t_fetchClassroomHistory(classroomId).then((res) =>
        setHistory(res.data)
      );
    } catch (err) {
      console.log(err);
    }
  }, [classroomId]);

  return classroom && history ? (
    <AdminLayout
      backBttn="/admin/classrooms"
      leftBarActive="Salones"
      optionsDropdown={optionsDropdown}
    >
      <Container fluid>
        {/* name */}
        <Row>
          <Col>
            <span className="text-muted">Nombre</span>
            <h1>
              {classroom.name}
              <AdminModal
                Form={ClassroomNameForm}
                formInitialText={classroom.name}
                formLabel="Nombre"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h1>
          </Col>
        </Row>
        {/* school */}
        <Row>
          <Col>
            <span className="text-muted">Nivel educativo</span>
            <h3>
              {classroom?.school || "-"}
              <AdminModal
                Form={ClassroomSchoolForm}
                formInitialText={classroom?.school || "Elige..."}
                formLabel="Nivel educativo"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h3>
          </Col>
        </Row>
        {/* institution */}
        <Row>
          <Col>
            <span className="text-muted">Escuela</span>
            <h3>
              {classroom?.institution?.name || "-"}
              <AdminModal
                Form={ClassroomInstitutionForm}
                formInitialText={classroom?.institution?._id || "Elige..."}
                formLabel="Escuela"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h3>
          </Col>
        </Row>
        {/* description */}
        <Row>
          <Col>
            <span className="text-muted">Descripción</span>
            <h4>
              {classroom.description || "-"}
              <AdminModal
                Form={ClassroomDescriptionForm}
                formInitialText={classroom.description}
                formLabel="Descripción"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h4>
            <span className="text-muted"></span>
          </Col>
        </Row>
        {/* created at */}
        <Row>
          <Col>
            <span className="text-muted">Fecha de creación</span>
            <h5>
              <i className="far fa-calendar-alt mr-2" />
              {moment(classroom.createdAt).format("LL")}
            </h5>
          </Col>
        </Row>
        {/* courses */}
        <Row className="mt-2">
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
        {/* members */}
        <Row className="mt-3">
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
                          <StudentItem
                            _id={s._id}
                            comesFrom={`/comesFrom=/admin/classrooms/edit/${classroom._id}`}
                            email={s.email}
                            key={s._id}
                            name={`${s.name} ${s.firstSurname}`}
                          />
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
      </Container>
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
