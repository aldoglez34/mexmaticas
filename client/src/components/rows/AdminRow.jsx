import React, { memo } from "react";
import {
  any,
  array,
  bool,
  elementType,
  func,
  oneOf,
  oneOfType,
  shape,
  string,
} from "prop-types";
import { Col, Row } from "react-bootstrap";
import { useAdminRow } from "../../hooks/useAdminRow";
import { Tooltip } from "../";

export const AdminRow = memo(({ icon, list, rowTitle, tooltip, value }) => {
  const { renderDraggableList, renderIcon, renderList } = useAdminRow();

  const renderValue = () => {
    if (!list) {
      if (value) return value;
      if (!value) return <span>-</span>;
    }
    return null;
  };

  const renderTypeList = (list) => {
    if (list.onOrderChange) return renderDraggableList(list);
    return renderList(list);
  };

  return (
    <Row className="mb-2">
      <Col>
        <span className="text-muted">
          {rowTitle.toUpperCase()}
          {tooltip && <Tooltip text={tooltip} className="ml-1" />}
        </span>
        <div className="d-flex d-row bg-light p-2 rounded">
          <strong>
            {renderValue()}
            {list && renderTypeList(list)}
          </strong>
          {icon && <span>{renderIcon(icon)}</span>}
        </div>
      </Col>
    </Row>
  );
});

const iconType = shape({
  getLink: func,
  hoverText: string,
  isDisabled: bool,
  modal: shape({
    Form: oneOfType([elementType, func]),
    initialValue: any,
    size: oneOf(["sm", "md", "lg", "xl"]),
    title: oneOfType([func, string]),
  }),
  onClick: func,
  svg: oneOf(["add", "anchor", "delete", "edit"]),
});

export const listTypes = shape({
  accessor: oneOfType([array, string]),
  data: array,
  icon: iconType,
  isAnchor: bool,
  onOrderChange: func,
});

AdminRow.propTypes = {
  rowTitle: string.isRequired,
  tooltip: string,
  value: any,
  icon: iconType,
  list: listTypes,
};

AdminRow.displayName = "AdminRow";
