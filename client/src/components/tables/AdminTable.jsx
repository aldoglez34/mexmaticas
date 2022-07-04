import React, { forwardRef } from "react";
import {
  array,
  arrayOf,
  bool,
  elementType,
  func,
  object,
  string,
} from "prop-types";
import { Table } from "react-bootstrap";
import { useAdminTable } from "../../hooks/useAdminTable";
import { isEmpty } from "lodash";

export const AdminTable = forwardRef(
  (
    {
      hasIdColumn = true,
      headers = [],
      onDeleteFunc,
      onEditForm,
      rowsAccessors = [],
      rowsData = [],
      sortDataBy,
      title,
    },
    ref
  ) => {
    const { renderHeaders, renderRows } = useAdminTable();

    if (isEmpty(rowsData) || isEmpty(rowsAccessors)) return;

    const sortRows = () => {
      if (!sortDataBy) return rowsData;
      return rowsData.sort((a, b) => a[sortDataBy] - b[sortDataBy]);
    };

    return (
      <div>
        {title && (
          <strong className="text-muted d-block mb-1">
            {title.toLocaleUpperCase()}
          </strong>
        )}
        <Table
          {...{
            bordered: true,
            className: "shadow-sm rounded",
            hover: true,
            size: "sm",
            striped: true,
            ...(ref && { ref }),
          }}
        >
          <thead>
            <tr>
              {renderHeaders({
                hasActionColumn: Boolean(onEditForm || onDeleteFunc),
                hasIdColumn,
                headers,
              })}
            </tr>
          </thead>
          <tbody>
            {renderRows({
              hasIdColumn,
              onDeleteFunc,
              onEditForm,
              rowsAccessors,
              rowsData: sortRows(rowsData),
            })}
          </tbody>
        </Table>
      </div>
    );
  }
);

AdminTable.propTypes = {
  hasIdColumn: bool,
  headers: arrayOf(string),
  onDeleteFunc: func,
  onEditForm: elementType,
  rowsAccessors: array,
  rowsData: arrayOf(object),
  sortDataBy: string,
  title: string,
};

AdminTable.displayName = "AdminTable";
