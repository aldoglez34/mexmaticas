import React, { memo } from "react";
import { AdminPagination, AdminSpinner } from "../";
import { ListGroup } from "react-bootstrap";
import { array, func, number, string } from "prop-types";

export const AdminDataTemplate = memo(
  ({
    activePage,
    data,
    emptyMessage,
    handleChangePage,
    limit,
    mapItemFunc,
    offset,
    pages,
    pageSize,
  }) => {
    return data ? (
      data.length ? (
        <>
          <ListGroup>{data.slice(offset, limit).map(mapItemFunc)}</ListGroup>
          {data.length > pageSize && (
            <div className="mt-3">
              <AdminPagination
                activePage={activePage}
                handleChangePage={(p) => handleChangePage(p)}
                pageCount={pages}
              />
            </div>
          )}
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
  limit: number.isRequired,
  mapItemFunc: func.isRequired,
  offset: number.isRequired,
  pages: number,
  pageSize: number.isRequired,
};

AdminDataTemplate.displayName = "AdminDataTemplate";
