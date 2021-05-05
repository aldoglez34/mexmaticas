import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

export const NotAvailableBttn = () => {
  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-disabled">
            Para iniciar este examen es necesario aprobar el nivel previo con 8
            o más
          </Tooltip>
        }
      >
        <span className="d-inline-block">
          <Button
            className="shadow-sm genericButton"
            style={{ pointerEvents: "none" }}
            disabled
          >
            <i className="fas fa-lock px-3" />
          </Button>
        </span>
      </OverlayTrigger>
    </>
  );
};
