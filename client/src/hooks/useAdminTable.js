import React from "react";
import { get, isEmpty, isEqual } from "lodash";
import {
  askUserToConfirm,
  getAccessorValue,
  isArray,
  isObject,
} from "../utils/helpers";
import cn from "classnames";
import { IconButton, ImageFromFirebase, ModalIconButton } from "../components";

export const useAdminTable = () => {
  const renderHeaders = ({ hasActionColumn, hasIdColumn, headers }) => {
    if (isEmpty(headers)) return null;
    return (
      <>
        {hasIdColumn && <th className="text-center">#</th>}
        {headers.map((header, index) => (
          <th className="text-center" key={index}>
            {header}
          </th>
        ))}
        {hasActionColumn && <th className="text-center" />}
      </>
    );
  };

  const renderWithBreaklines = (value, breakLine) =>
    (value || "").split(breakLine).map((v, idx) => (
      <span key={idx} className="d-block">
        {String(v).trim()}
      </span>
    ));

  const renderImage = (url) => (
    <ImageFromFirebase height="85" path={url} width="85" />
  );

  const getValueFromRow = (row, acc) => {
    if (isEqual(typeof acc, "boolean")) return row;
    if (isEqual(typeof acc, "string")) return get(row, acc);
    if (isArray(acc)) return getAccessorValue(row, acc);
    return "-";
  };

  const renderList = (value, list) =>
    (value || []).map((v, idx) => (
      <span key={idx}>
        {getValueFromRow(v, list)}
        {!isEqual(value.length, idx + 1) && <hr className="my-0" />}
      </span>
    ));

  const renderValue = (accessor, value) => {
    const { breakLine, func, list } = accessor;
    if (accessor.image) return renderImage(value);
    if (func) return func(value);
    if (list) return renderList(value, list);
    if (breakLine) return renderWithBreaklines(value, breakLine);
    return value;
  };

  const createCell = (idx, row, accessor) => {
    if (!accessor || isEmpty(row)) return;
    if (isObject(accessor)) {
      const { acc, image } = accessor;
      if (isEmpty(acc) && isEmpty(image)) return;
      const value = getValueFromRow(row, acc || image);
      return (
        <td
          {...{
            key: idx,
            className: cn("align-middle", accessor.className),
          }}
        >
          {renderValue(accessor, value)}
        </td>
      );
    }

    return (
      <td className="align-middle" key={idx}>
        {getValueFromRow(row, accessor)}
      </td>
    );
  };

  const getRow = (row, rowsAccessors) =>
    rowsAccessors.map((accessor, idx) => createCell(idx, row, accessor));

  const renderActionsColumn = (row, onEditForm, onDeleteFunc) => (
    <td className="align-middle text-center">
      {onEditForm && (
        <ModalIconButton
          {...{
            Form: onEditForm,
            hoverText: "Editar pregunta",
            initialQuestion: row,
            modalTitle: "Editar pregunta",
            size: "lg",
            svg: "edit",
          }}
        />
      )}
      {onDeleteFunc && (
        <IconButton
          {...{
            hoverText: "Borrar pregunta",
            svg: "delete",
            onClick: () =>
              askUserToConfirm(
                "¿Estás seguro que quieres borrar esta pregunta?",
                () => onDeleteFunc(row)
              ),
          }}
        />
      )}
    </td>
  );

  const renderRows = ({
    hasIdColumn,
    onDeleteFunc,
    onEditForm,
    rowsAccessors,
    rowsData,
  }) =>
    rowsData.map((row, idx) => (
      <tr key={row._id}>
        {hasIdColumn && <td className="align-middle text-center">{idx + 1}</td>}
        {getRow(row, rowsAccessors)}
        {(onEditForm || onDeleteFunc) &&
          renderActionsColumn(row, onEditForm, onDeleteFunc)}
      </tr>
    ));

  return { renderHeaders, renderRows };
};
