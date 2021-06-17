import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { AdminLayout, AdminModal, AdminSpinner } from "../components";
import { ClassroomDescriptionForm, ClassroomNameForm } from "./components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
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

  return classroom ? (
    <AdminLayout backBttn="/admin/classrooms" leftBarActive="Salones">
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
            <span className="text-muted">Fecha de registro</span>
            <h5>
              <i className="far fa-calendar-alt mr-2" />
              {moment(classroom.createdAt).format("LL")}
            </h5>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminClassroomDetailPage.displayName = "AdminClassroomDetailPage";
