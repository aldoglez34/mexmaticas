import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { deleteInstitution, fetchOneInstitution } from "../../../services";
import { AdminLayout, AdminModal, AdminSpinner } from "../../../components";
import { InstitutionDescriptionForm, InstitutionNameForm } from "../components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../redux/actions/admin";
import moment from "moment";
import "moment/locale/es";

export const AdminInstitutionDetailPage = React.memo((props) => {
  const dispatch = useDispatch();

  const [institution, setInstitution] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const institutionId = props.routeProps.match.params.institutionId;

  useEffect(() => {
    fetchOneInstitution(institutionId)
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

  const handleDeleteInstitution = async () => {
    setIsDeleting(true);
    try {
      // delete classroom from database
      const deleteRes = await deleteInstitution({ institutionId });
      if (deleteRes.status === 200)
        return (window.location.href = "/admin/institutions");
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error al intentar borrar la escuela.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const optionsDropdown = [{ text: "Borrar Escuela", fn: handleShowModal }];

  return institution ? (
    <AdminLayout
      backBttn="/admin/institutions"
      leftBarActive="Escuelas"
      optionsDropdown={optionsDropdown}
    >
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
      {/* delete institution modal */}
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
              <div className="lead text-center mt-2">{`¿Estás seguro que deseas borrar la escuela: ${institution.name}?`}</div>
              <div className="d-flex flex-row justify-content-center mt-4">
                <Button variant="dark" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  className="ml-2"
                  onClick={handleDeleteInstitution}
                >
                  Borrar
                  <i className="fas fa-trash-alt ml-2" />
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminInstitutionDetailPage.displayName = "AdminInstitutionDetailPage";
