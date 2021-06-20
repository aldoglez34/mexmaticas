import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { AdminLayout, AdminModal, AdminSpinner } from "../components";
import {
  AddStudentsButton,
  AddCoursesButton,
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

export const AdminClassroomDetailPage = React.memo((props) => {
  const dispatch = useDispatch();

  const [classroom, setClassroom] = useState();

  const classroomId = props.routeProps.match.params.classroomId;

  useEffect(() => {
    TeacherAPI.t_fetchOneClassroom(classroomId)
      .then((res) => {
        console.log(res.data);
        setClassroom(res.data);
        const { name } = res.data;
        dispatch(setTitle(name));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [classroomId, dispatch]);

  const optionsDropdown = [{ text: "Borrar salón", fn: () => undefined }];

  return classroom ? (
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
              classroom.courses.map((c) => (
                <h5 key={c._id} className="mb-0">
                  {c.name}
                </h5>
              ))
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
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminClassroomDetailPage.displayName = "AdminClassroomDetailPage";
