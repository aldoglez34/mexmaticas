import React, { memo } from "react";
import { any, object, string } from "prop-types";
import { Col, Row } from "react-bootstrap";
import { AdminEditModal } from "../";

export const EditableRow = memo(
  ({ formInitialText, ModalFormComponent, modalLabel, rowTitle, value }) => (
    <Row className="mb-2">
      <Col>
        {rowTitle && <span className="text-muted">{rowTitle.toUpperCase()}</span>}
        <div className="d-flex align-items-center">
          <h4 className="d-inline mb-0">{value || "-"}</h4>
          <AdminEditModal
            Form={ModalFormComponent}
            formInitialText={formInitialText ?? ""}
            formLabel={modalLabel || ""}
            icon={<i className="fas fa-pen-alt" />}
          />
        </div>
      </Col>
    </Row>
  )
);

EditableRow.propTypes = {
  formInitialText: any,
  ModalFormComponent: object,
  modalLabel: string,
  rowTitle: string,
  value: any,
};

EditableRow.displayName = "EditableRow";
