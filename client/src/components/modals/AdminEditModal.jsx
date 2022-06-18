import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { bool, node, number, oneOfType, string } from "prop-types";
import { AdminModal } from "./AdminModal";
import cn from "classnames";

import styles from "./admineditmodal.module.scss";

export const AdminEditModal = React.memo(
  ({ Form, formInitialText, formLabel, icon }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button
          className={cn("ml-1", styles.button)}
          onClick={handleShow}
          size="sm"
        >
          {icon}
        </Button>

        <AdminModal show={show} handleClose={handleClose} title="Editar">
          <Form formLabel={formLabel} formInitialText={formInitialText} />
        </AdminModal>
      </>
    );
  }
);

AdminEditModal.propTypes = {
  formInitialText: oneOfType([bool, number, string]),
  formLabel: string,
  icon: node,
};

AdminEditModal.displayName = "AdminEditModal";
