import React from "react";
import { AdminModal } from "../";
import { array, bool, func, string } from "prop-types";
import { CSVLink } from "react-csv";
import { isEmpty } from "lodash";

export const AdminExportToExcel = ({
  data = [],
  fileName = "export",
  headers,
  modalText = "Exportar a archivo .csv",
  setShow,
  show,
  textIfEmpty = "Vacío",
}) => (
  <AdminModal handleClose={() => setShow(false)} show={show} title="Exportar">
    <p>{modalText}</p>
    <div>
      {isEmpty(data) ? (
        <div className="mt-4 text-center">
          <strong>{textIfEmpty}</strong>
        </div>
      ) : (
        <CSVLink
          className="btn btn-primary bg-dark border-dark shadow"
          data={data}
          filename={`${fileName}.csv`}
          headers={headers}
          target="_blank"
          onClick={() => {
            setShow(false);
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
AdminExportToExcel.propTypes = {
  data: array,
  fileName: string,
  headers: array.isRequired,
  modalText: string,
  setShow: func.isRequired,
  show: bool.isRequired,
  textIfEmpty: string,
};

AdminExportToExcel.displayName = "AdminExportToExcel";
