import React, { memo } from "react";
import { any, array, bool, oneOf, oneOfType, shape, string } from "prop-types";
import { Col, Row } from "react-bootstrap";
import { useAdminRow } from "../../hooks/useAdminRow";

export const AdminRow = memo(({ icon, list, rowTitle, value }) => {
  const { renderIcon, renderList } = useAdminRow();

  return (
    <Row className="mb-2">
      <Col>
        <span className="text-muted">{rowTitle.toUpperCase()}</span>
        <strong className="d-block bg-light">
          {value && !list ? value : null}
          {!value && !list ? <span>-</span> : null}
          {icon && renderIcon(icon)}
          {list && renderList(list)}
        </strong>
      </Col>
    </Row>
  );
});

AdminRow.propTypes = {
  icon: shape({
    hoverText: string,
    isDisabled: bool,
    link: shape({ url: string, urlAccessor: string }),
    modal: shape({ Form: any, initialValue: any, title: string }),
    svg: oneOf(["anchor", "edit"]),
  }),
  list: shape({
    accessor: oneOfType([array, string]),
    data: array,
    icon: shape({
      hoverText: string,
      isDisabled: bool,
      link: shape({ url: string, urlAccessor: string }),
      modal: shape({ Form: any, initialValue: any, title: string }),
      svg: oneOf(["anchor", "edit"]),
    }),
  }),
  rowTitle: string.isRequired,
  value: any,
};

AdminRow.displayName = "AdminRow";
