import React from "react";
import { Button } from "react-bootstrap";
import { bool, number, string } from "prop-types";
import { AlertModal } from "../../../components";

export const ScoreModal = React.memo(({ image, score, show, url }) => {
  return (
    <AlertModal image={image} show={show}>
      <h5 className="text-dark mb-3 mt-3">
        Tu tiempo se ha terminado, tu puntuación final es:
      </h5>
      <h1 className="display-1">{`[ ${score} ]`}</h1>
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

ScoreModal.propTypes = {
  image: string.isRequired,
  score: number.isRequired,
  show: bool.isRequired,
  url: string.isRequired,
};

ScoreModal.displayName = "ScoreModal";
