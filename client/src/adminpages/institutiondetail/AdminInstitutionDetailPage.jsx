import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { AdminLayout, AdminModal, AdminSpinner } from "../components";
import { InstitutionDescriptionForm, InstitutionNameForm } from "./components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import moment from "moment";
import "moment/locale/es";

export const AdminInstitutionDetailPage = React.memo((props) => {
  const dispatch = useDispatch();

  const [institution, setInstitution] = useState();

  const institutionId = props.routeProps.match.params.institutionId;

  useEffect(() => {
    TeacherAPI.t_fetchOneInstitution(institutionId)
      .then((res) => {
        setInstitution(res.data);
        const { name } = res.data;
        dispatch(setTitle(name));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [institutionId, dispatch]);

  return institution ? (
    <AdminLayout backBttn="/admin/institutions" leftBarActive="Escuelas">
      <Container fluid>
        {/* name */}
        <Row>
          <Col>
            <span className="text-muted">Nombre</span>
            <h1>
              {institution.name}
              <AdminModal
                Form={InstitutionNameForm}
                formInitialText={institution.name}
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
              {institution.description || "-"}
              <AdminModal
                Form={InstitutionDescriptionForm}
                formInitialText={institution.description}
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
              {moment(institution.createdAt).format("LL")}
            </h5>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminInstitutionDetailPage.displayName = "AdminInstitutionDetailPage";
