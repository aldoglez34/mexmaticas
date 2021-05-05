import React from "react";
import { number } from "prop-types";
import { Image } from "react-bootstrap";
import "./resultsmsg.scss";

export const ResultMsg = React.memo(({ grade }) => {
  return grade >= 8 ? (
    <div className="text-center mt-4">
      {grade === 10 ? (
        <div>
          <h2 className="mainMsg">¡Calificación perfecta!</h2>
          <span className="lead">
            Has recibido una corona por tu desempeño.
          </span>
          <div className="mt-3">
            <Image src="/images/crown.png" width="170" height="170" />
          </div>
        </div>
      ) : (
        <div className="pb-2">
          <h2 className="mainMsg">Resultado satisfactorio.</h2>
          <span className="lead">¡Muy bien!</span>
          <div className="mt-3">
            <Image src="/images/testA.png" width="170" height="170" />
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="text-center mt-4 pb-3">
      <div>
        <h2 className="mainMsg">No satisfactorio.</h2>
        <span className="lead">Debes obtener un mínimo de 8 para aprobar.</span>
        <div className="mt-3">
          <Image src="/images/sadFace.png" width="170" height="170" />
        </div>
      </div>
    </div>
  );
});

ResultMsg.propTypes = {
  grade: number.isRequired,
};
