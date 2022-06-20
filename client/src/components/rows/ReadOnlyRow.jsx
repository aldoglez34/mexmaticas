import React, { memo } from "react";
import { any, object, string } from "prop-types";
import { Col, Row } from "react-bootstrap";

export const ReadOnlyRow = memo(({ icon, rowTitle, value }) => (
  <Row className="mb-2">
    <Col>
      {rowTitle && <span className="text-muted">{rowTitle.toUpperCase()}</span>}
      <h5>
        {icon}
        {value}
      </h5>
    </Col>
  </Row>
));

ReadOnlyRow.propTypes = {
  icon: object,
  rowTitle: string,
  value: any,
};

ReadOnlyRow.displayName = "ReadOnlyRow";
