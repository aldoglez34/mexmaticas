import React, { memo } from "react";
import { CSVLink } from "react-csv";
import { AdminModal } from "../../components";
import { arrayOf, bool, func, object, string } from "prop-types";
import { isEmpty } from "lodash";

export const ExportHistoryToExcel = memo(
  ({ data = [], fileName = "", setShow, show = false }) => {
    const handleCloseModal = () => setShow(false);

    const headers = [
      { label: "Fecha", key: "date" },
      { label: "Alumno", key: "student" },
      { label: "Curso", key: "course" },
      { label: "Tema", key: "topic" },
      { label: "Examen", key: "exam" },
      { label: "Calificación", key: "grade" },
    ];

    return (
      <AdminModal handleClose={handleCloseModal} show={show} title="Exportar">
        <p>{`Exporta el historial de exámenes de ${fileName} a un archivo .csv`}</p>
        <div>
          {isEmpty(data) ? (
            <div className="mt-3 text-center">Historial vacío.</div>
          ) : (
            <CSVLink
              className="btn btn-primary bg-dark border-dark"
              data={data}
              filename={`${fileName}.csv`}
              headers={headers}
              target="_blank"
              onClick={() => {
                handleCloseModal();
                return true;
              }}
            >
              <i className="fas fa-file-csv mr-2" />
              Exportar
            </CSVLink>
          )}
        </div>
      </AdminModal>
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
