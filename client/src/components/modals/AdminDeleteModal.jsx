import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Button } from "../";
import { AdminModal } from "./AdminModal";
import { bool, func, string } from "prop-types";

export const AdminDeleteModal = ({
  handleCloseModal,
  handleDelete,
  modalText = "¿Estás seguro que deseas borrar este elemento?",
  show,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleting(true);
    handleDelete();
  };

  return (
    <AdminModal handleClose={handleCloseModal} show={show} title="Borrar">
      <p className="text-center">{modalText}</p>
      {isDeleting && (
        <div className="my-4 text-center">
          <strong className="mb-2">Borrando...</strong>
          <div className="d-block">
            <Spinner animation="grow" role="status" variant="danger" />
          </div>
        </div>
      )}
      <div className="d-flex flex-row justify-content-center">
        <Button
          className="ml-2"
          isDisabled={isDeleting}
          isLoading={isDeleting}
          onClick={handleDeleteClick}
          variant="danger"
        >
          Borrar
        </Button>
      </div>
    </AdminModal>
  );
};

AdminDeleteModal.propTypes = {
  handleCloseModal: func.isRequired,
  handleDelete: func.isRequired,
  modalText: string,
  show: bool.isRequired,
};

AdminDeleteModal.displayName = "AdminDeleteModal";
