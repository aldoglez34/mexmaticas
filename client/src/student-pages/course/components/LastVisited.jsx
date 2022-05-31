import React from "react";
import moment from "moment";
import "moment/locale/es";

export const LastVisited = React.memo(({ date }) => {
  const formattedDate = date
    ? moment(date).format("LLLL")
    : "No has presentado este examen";

  return (
    <span style={{ fontSize: "14px" }} title="Último intento">
      <i className="fas fa-calendar-alt mr-2" />
      {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
    </span>
  );
});

LastVisited.displayName = "LastVisited";
