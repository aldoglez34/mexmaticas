import React, { memo } from "react";
import { CSVLink } from "react-csv";
import { Modal } from "react-bootstrap";
import { arrayOf, bool, func, object, string } from "prop-types";
import { AdminSpinner } from "..";

export const ExportHistoryToExcel = memo(
  ({ data = [], fileName = "", setShow, show = false }) => {
    const handleOnHide = () => setShow(false);

    const headers = [
      { label: "Fecha", key: "date" },
      { label: "Alumno", key: "student" },
      { label: "Curso", key: "course" },
      { label: "Tema", key: "topic" },
      { label: "Examen", key: "exam" },
      { label: "Calificación", key: "grade" },
    ];

    return (
      <Modal show={show} onHide={handleOnHide}>
        <Modal.Body className="bg-light rounded shadow py-4">
          <h5 className="text-dark my-3">{`Exporta el historial de exámenes de ${fileName} a un archivo .csv`}</h5>
          <div className="text-center mt-4">
            {data?.length ? (
              <CSVLink
                className="btn btn-primary bg-dark border-dark"
                data={data}
                filename={`${fileName}.csv`}
                headers={headers}
                target="_blank"
                onClick={() => {
                  handleOnHide();
                  return true;
                }}
              >
                <i className="fas fa-file-csv mr-2" />
                Exportar
              </CSVLink>
            ) : (
              <AdminSpinner />
            )}
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
