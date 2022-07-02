import React, { memo } from "react";
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

export const AdminTable = memo(
  ({
    hasIdColumn = true,
    headers = [],
    name,
    onDeleteFunc,
    onEditForm,
    rowsAccessors = [],
    rowsData = [],
    sortDataBy,
    title,
  }) => {
    const { renderHeaders, renderRows } = useAdminTable();

    if (isEmpty(rowsData) || isEmpty(rowsAccessors)) return;

    const sortRows = () => {
      if (!sortDataBy) return rowsData;
      return rowsData.sort((a, b) => a[sortDataBy] - b[sortDataBy]);
    };

    return (
      <div {...(name && { id: name })}>
        {title && (
          <strong className="text-muted d-block mb-1">
            {title.toLocaleUpperCase()}
          </strong>
        )}
        <Table bordered className="shadow-sm rounded" hover size="sm" striped>
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
  name: string,
  onDeleteFunc: func,
  onEditForm: elementType,
  rowsAccessors: array,
  rowsData: arrayOf(object),
  sortDataBy: string,
  title: string,
};

AdminTable.displayName = "AdminTable";
