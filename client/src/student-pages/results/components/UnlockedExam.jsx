import React from "react";
import { Image } from "react-bootstrap";
import { object, bool, oneOfType } from "prop-types";
import { useSelector } from "react-redux";
import { ImageFromFirebase } from "../../../components";

export const UnlockedExam = ({ unlockedExam, isFreestyleUnlocked }) => {
  const exam = useSelector((state) => state.exam);

  return (
    <div className="text-center d-flex flex-column">
      {unlockedExam ? (
        <>
          <h3 className="mainMsg">¡Nuevo Examen!</h3>
          <span className="mb-1 lead">
            El examen{" "}
            <span style={{ fontWeight: 600, color: "#3d5257" }}>
              {unlockedExam.name}
            </span>{" "}
            ha sido desbloqueado.
          </span>
          <div className="my-3">
            <Image src="/images/lock.png" width="120" height="120" />
          </div>
        </>
      ) : null}
      {isFreestyleUnlocked ? (
        <>
          <h3 className="mainMsg">¡Felicidades!</h3>
          <span className="lead">
            Has concluido el tema{" "}
            <span style={{ fontWeight: 600, color: "#3d5257" }}>
              {exam.topicName}
            </span>
            .
          </span>
          <div className="my-2">
            <ImageFromFirebase
              className="mb-3"
              path={exam.reward.link}
              width="140"
              height="190"
            />
          </div>
          <h3 className="mainMsg">¡Nuevo Examen!</h3>
          <span className="mb-1 lead">
            El examen{" "}
            <span style={{ fontWeight: 600, color: "#3d5257" }}>
              Modo Rápido
            </span>{" "}
            ha sido desbloqueado.
          </span>
          <div className="my-3">
            <Image src="/images/freestyle.png" width="110" height="150" />
          </div>
        </>
      ) : null}
    </div>
  );
};

UnlockedExam.propTypes = {
  unlockedExam: oneOfType([object, bool]),
  isFreestyleUnlocked: bool,
};
