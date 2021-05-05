import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { string } from "prop-types";
import { AlertModal } from "../../";

export const ExitButton = React.memo(({ url }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        size="sm"
        variant="danger"
        className="shadow-sm"
        onClick={handleShow}
      >
        Abandonar
      </Button>

      <AlertModal image="/images/warning.png" show={show}>
        <h5 className="text-dark mb-3 mt-3">
          ¿Estás seguro que deseas abandonar el examen? Tu avance será borrado y
          tendrás que empezar de nuevo.
        </h5>
        <div className="d-flex flex-row justify-content-center mt-4">
          <Button variant="dark shadow-sm" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="danger shadow-sm ml-2"
            onClick={() => (window.location.href = url)}
          >
            Abandonar
            <i className="fas fa-door-open ml-1" />
          </Button>
        </div>
      </AlertModal>
    </>
  );
});

ExitButton.propTypes = {
  url: string.isRequired,
};
