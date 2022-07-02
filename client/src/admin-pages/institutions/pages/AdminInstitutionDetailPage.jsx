import React, { useState, useEffect } from "react";
import { deleteInstitution, fetchOneInstitution } from "../../../services";
import { AdminLayout, AdminRow, AdminSpinner } from "../../../components";
import { InstitutionDescriptionForm, InstitutionNameForm } from "../components";
import { formatDate } from "../../../utils/helpers";
import { AdminDeleteModal } from "../../../components/modals/AdminDeleteModal";

export const AdminInstitutionDetailPage = React.memo((props) => {
  const [institution, setInstitution] = useState();
  const [showModal, setShowModal] = useState(false);

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
      <AdminDeleteModal
        handleCloseModal={handleCloseModal}
        handleDelete={handleDeleteInstitution}
        modalText={`¿Estás seguro que deseas borrar la escuela: ${institution.name}?`}
        show={showModal}
      />
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminInstitutionDetailPage.displayName = "AdminInstitutionDetailPage";
