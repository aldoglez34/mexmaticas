import React from "react";
import { string } from "prop-types";

export const DifficultyStars = React.memo(({ difficulty }) => {
  const calculateDifficulty = () => {
    switch (difficulty) {
      case "Basic":
        return (
          <>
            <i className="fas fa-star" />
            <i className="far fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <br />
            <span className="text-info">
              <strong>Básico</strong>
            </span>
          </>
        );
      case "Basic-Intermediate":
        return (
          <>
            <i className="fas fa-star" />
            <i className="fas fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <br />
            <span className="text-info">
              <strong>Básico-Intermedio</strong>
            </span>
          </>
        );
      case "Intermediate":
        return (
          <>
            <i className="fas fa-star" />
            <i className="fas fa-star ml-1" />
            <i className="fas fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <br />
            <span className="text-info">
              <strong>Intermedio</strong>
            </span>
          </>
        );
      case "Intermediate-Advanced":
        return (
          <>
            <i className="fas fa-star" />
            <i className="fas fa-star ml-1" />
            <i className="fas fa-star ml-1" />
            <i className="fas fa-star ml-1" />
            <i className="far fa-star ml-1" />
            <br />
            <span className="text-info">
              <strong>Intermedio-Avanzado</strong>
            </span>
          </>
        );
      case "Advanced":
        return (
          <>
            <i className="fas fa-star" />
            <i className="fas fa-star ml-1" />
            <i className="fas fa-star ml-1" />
            <i className="fas fa-star ml-1" />
            <i className="fas fa-star ml-1" />
            <br />
            <span className="text-info">
              <strong>Avanzado</strong>
            </span>
          </>
        );
      default:
        break;
    }
  };

  return (
    <span className="text-info" title="Dificultad">
      {calculateDifficulty()}
    </span>
  );
});

DifficultyStars.propTypes = {
  difficulty: string.isRequired,
};

DifficultyStars.displayName = "DifficultyStars";
