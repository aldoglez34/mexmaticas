import React, { memo } from "react";
import { bool, string } from "prop-types";
import { Col, Row } from "react-bootstrap";
import cn from "classnames";

export const DivisionRow = memo(({ isTitle = false, text }) => (
  <Row className="mb-2">
    <Col>
      <hr className={cn(isTitle && "mt-0")} />
      <span className="text-muted">{text.toUpperCase()}</span>
      <hr />
    </Col>
  </Row>
));

DivisionRow.propTypes = {
  isFirst: bool,
  text: string.isRequired,
};

DivisionRow.displayName = "DivisionRow";
