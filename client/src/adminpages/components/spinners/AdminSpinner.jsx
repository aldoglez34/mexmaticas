import React from "react";
import { Spinner } from "react-bootstrap";

export const AdminSpinner = () => {
  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <Spinner variant="success" animation="border" role="status">
        <span className="sr-only">Cargando...</span>
      </Spinner>
    </div>
  );
};
