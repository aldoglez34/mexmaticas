import React, { useEffect, useState } from "react";
import { AdminLayout, AdminSpinner } from "../components";
import { Button, Col, Container, ListGroup, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import TeacherAPI from "../../utils/TeacherAPI";
import { InstitutionItem } from "./components/";

export const AdminInstitutionsPage = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [institutions, setInstitutions] = useState();

  useEffect(() => {
    dispatch(setTitle("Escuelas"));
    //
    TeacherAPI.t_fetchInstitutions()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
        setInstitutions(defaultSorting);
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const optionsDropdown = [
    {
      text: "Nueva Escuela",
      fn: () => (window.location.href = "/admin/institutions/new"),
    },
  ];

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return institutions ? (
    <AdminLayout leftBarActive="Escuelas" optionsDropdown={optionsDropdown}>
      <Container fluid>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {institutions.length ? (
              <>
                <h3 className="mb-3" style={{ color: "#0f5257" }}>
                  Selecciona una escuela...
                </h3>
                <ListGroup>
                  {institutions.map((c) => (
                    <InstitutionItem
                      _id={c._id}
                      description={c.description}
                      key={c._id}
                      name={c.name}
                      onClick={handleShowModal}
                    />
                  ))}
                </ListGroup>
              </>
            ) : (
              <div className="text-center mt-4">No hay escuelas.</div>
            )}
          </Col>
        </Row>
      </Container>
      <Modal
        backdrop="static"
        onHide={handleCloseModal}
        show={showModal}
        size="lg"
      >
        <Modal.Body className="bg-light rounded">
          <div className="d-flex">
            <h3 className="mb-0 text-dark">Escuela</h3>
            <Button
              variant="link"
              className="text-dark ml-auto"
              onClick={handleCloseModal}
            >
              <i className="fas fa-times" />
            </Button>
          </div>
          <div className="my-3">
            <h1>contenido</h1>
          </div>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
