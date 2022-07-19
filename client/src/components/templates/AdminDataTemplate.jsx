import React, { memo } from "react";
import { AdminPagination, AdminSpinner } from "../";
import { ListGroup, Table as BootstrapTable } from "react-bootstrap";
import { array, arrayOf, bool, func, number, string } from "prop-types";

export const AdminDataTemplate = memo(
  ({
    activePage,
    data,
    emptyMessage,
    handleChangePage,
    isTable = false,
    limit,
    mapItemFunc,
    offset,
    pages,
    pageSize,
    tableHeaders = [],
  }) => {
    const Pagination = () =>
      data.length > pageSize && (
        <div className="mt-3">
          <AdminPagination
            activePage={activePage}
            handleChangePage={(p) => handleChangePage(p)}
            pageCount={pages}
          />
        </div>
      );

    const Table = ({ headers, rows }) => (
      <BootstrapTable striped bordered hover size="sm">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.slice(offset, limit).map(mapItemFunc)}</tbody>
      </BootstrapTable>
    );

    return data ? (
      data.length ? (
        <>
          {isTable && <Table headers={tableHeaders} rows={data} />}
          {!isTable && (
            <ListGroup>{data.slice(offset, limit).map(mapItemFunc)}</ListGroup>
          )}
          <Pagination />
        </>
      ) : (
        <div className="text-center mt-4">{emptyMessage}</div>
      )
    ) : (
      <AdminSpinner />
    );
  }
);

AdminDataTemplate.propTypes = {
  activePage: number.isRequired,
  data: array,
  emptyMessage: string.isRequired,
  handleChangePage: func.isRequired,
  isTable: bool,
  limit: number.isRequired,
  mapItemFunc: func.isRequired,
  offset: number.isRequired,
  pages: number,
  pageSize: number.isRequired,
  tableHeaders: arrayOf(string),
};

AdminDataTemplate.displayName = "AdminDataTemplate";
