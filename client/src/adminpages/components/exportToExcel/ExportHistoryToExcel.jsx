import React, { memo } from "react";
import { CSVLink } from "react-csv";
import { Modal } from "react-bootstrap";
import { arrayOf, bool, func, object, string } from "prop-types";

export const ExportHistoryToExcel = memo(
  ({ data = [], fileName = "", setShow, show = false }) => {
    const handleOnHide = () => setShow(false);

    const headers = [
      { label: "Alumno", key: "student" },
      { label: "Fecha", key: "date" },
      { label: "Examen", key: "exam" },
      { label: "Calificación", key: "grade" },
    ];

    return (
      <Modal show={show} onHide={handleOnHide}>
        <Modal.Body className="bg-light rounded shadow py-4">
          <h5 className="text-dark my-3">{`Exporta el historial de exámenes de ${fileName} a un archivo .csv`}</h5>
          <div className="text-center mt-4">
            <CSVLink
              className="btn btn-primary"
              data={data}
              filename={`${fileName}.csv`}
              headers={headers}
              target="_blank"
              onClick={() => {
                handleOnHide();
                return true;
              }}
            >
              Exportar
            </CSVLink>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);

ExportHistoryToExcel.propTypes = {
  data: arrayOf(object),
  fileName: string,
  setShow: func,
  show: bool,
};

ExportHistoryToExcel.displayName = "ExportHistoryToExcel";
