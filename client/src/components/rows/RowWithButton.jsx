import React, { memo } from "react";
import { any, string } from "prop-types";
import { Col, Row } from "react-bootstrap";

export const RowWithButton = memo(({ button, rowTitle, value }) => (
  <Row className="mb-2">
    <Col>
      {rowTitle && <span className="text-muted">{rowTitle.toUpperCase()}</span>}
      {value && <div>{value}</div>}
      {button && <div>{button}</div>}
    </Col>
  </Row>
));

RowWithButton.propTypes = {
  button: any,
  rowTitle: string,
  value: any,
};

RowWithButton.displayName = "RowWithButton";
