import React, { memo } from "react";
import { any, object, string } from "prop-types";
import { Col, Row } from "react-bootstrap";
import { get, isEmpty } from "lodash";

export const ReadOnlyRow = memo(({ icon, list, rowTitle, value }) => {
  const renderList = () => {
    if (isEmpty(list.data)) return <span>-</span>;
    return (
      <ul>
        {list.data.map((item, idx) => (
          <li key={idx}>{get(item, list.accessor)}</li>
        ))}
      </ul>
    );
  };

  return (
    <Row className="mb-2">
      <Col>
        {rowTitle && (
          <span className="text-muted">{rowTitle.toUpperCase()}</span>
        )}
        <h5>
          {icon}
          {value}
          {list && renderList()}
        </h5>
      </Col>
    </Row>
  );
});

ReadOnlyRow.propTypes = {
  icon: any,
  list: object,
  rowTitle: string,
  value: any,
};

ReadOnlyRow.displayName = "ReadOnlyRow";
