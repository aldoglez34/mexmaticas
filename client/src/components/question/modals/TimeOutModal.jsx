import React from "react";
import { bool, string } from "prop-types";
import { Button } from "react-bootstrap";
import { AlertModal } from "../../";

export const TimeOutModal = React.memo(({ showTimeOut, url }) => {
  return (
    <AlertModal image="/images/timeover.png" show={showTimeOut}>
      <h3 className="text-dark mb-3">Se ha acabado tu tiempo.</h3>
      <div className="mt-4">
        <Button
          onClick={() => (window.location.href = url)}
          className="shadow-sm genericButton"
        >
          Volver al curso
        </Button>
      </div>
    </AlertModal>
  );
});

TimeOutModal.propTypes = {
  showTimeOut: bool,
  url: string,
};
