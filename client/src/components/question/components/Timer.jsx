import React from "react";
import Flash from "react-reveal/Flash";

export const Timer = React.memo(({ minutesLeft, secondsLeft }) => {
  return (
    <div
      title="Tiempo restante"
      className="d-inline"
      style={{ color: "#0f5257" }}
    >
      <Flash>
        <i className="fas fa-stopwatch mr-1" />
        <strong>
          {minutesLeft > 1
            ? `${minutesLeft} minutos`
            : `${secondsLeft} segundos`}
        </strong>
      </Flash>
    </div>
  );
});

Timer.displayName = "Timer";
