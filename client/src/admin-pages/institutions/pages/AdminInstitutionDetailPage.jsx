import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { deleteInstitution, fetchOneInstitution } from "../../../services";
import {
  AdminLayout,
  AdminModal,
  AdminRow,
  AdminSpinner,
  Button,
} from "../../../components";
import { InstitutionDescriptionForm, InstitutionNameForm } from "../components";
import { formatDate } from "../../../utils/helpers";

export const AdminInstitutionDetailPage = React.memo((props) => {
  const [institution, setInstitution] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const institutionId = props.routeProps.match.params.institutionId;

  useEffect(() => {
    fetchOneInstitution(institutionId)
      .then((res) => setInstitution(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [institutionId]);

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
      expanded
      leftBarActive="Escuelas"
      optionsDropdown={optionsDropdown}
      topNavTitle={institution?.name}
    >
      <AdminRow
        rowTitle="Nombre"
        value={institution.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: InstitutionNameForm,
            initialValue: institution.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={institution.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: InstitutionDescriptionForm,
            initialValue: institution.description,
          },
        }}
      />
      <AdminRow
        rowTitle="Fecha de creación"
        value={formatDate(institution.createdAt, "LL")}
      />
      {/* delete institution modal */}
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
            <p className="text-center">{`¿Estás seguro que deseas borrar la escuela: ${institution.name}?`}</p>
            <div className="d-flex flex-row justify-content-center">
              <Button onClick={handleCloseModal} size="sm">
                Cancelar
              </Button>
              <Button
                className="ml-2"
                onClick={handleDeleteInstitution}
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
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminInstitutionDetailPage.displayName = "AdminInstitutionDetailPage";
