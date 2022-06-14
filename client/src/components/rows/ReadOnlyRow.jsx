import React, { memo } from "react";
import { object, string } from "prop-types";
import { Col, Row } from "react-bootstrap";

export const ReadOnlyRow = memo(({ icon, rowTitle, value }) => (
  <Row className="mb-2">
    <Col>
      {rowTitle && <span className="text-muted">{rowTitle}</span>}
      <h4>
        {icon}
        {value}
      </h4>
    </Col>
  </Row>
));

ReadOnlyRow.propTypes = {
  icon: object,
  rowTitle: string,
  value: string,
};

ReadOnlyRow.displayName = "ReadOnlyRow";
