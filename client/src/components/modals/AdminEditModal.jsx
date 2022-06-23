import React, { useState } from "react";
import { bool, node, number, oneOfType, string } from "prop-types";
import { AdminModal } from "./AdminModal";

import { IconButton } from "../buttons/IconButton";

export const AdminEditModal = React.memo(
  ({
    Form,
    formInitialText,
    formLabel,
    hoverText,
    icon,
    isDisabled = false,
  }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <IconButton
          hoverText={hoverText}
          icon={icon}
          isDisabled={isDisabled}
          onClick={handleShow}
        />

        <AdminModal handleClose={handleClose} show={show} title="Editar">
          <Form formLabel={formLabel} formInitialText={formInitialText} />
        </AdminModal>
      </>
    );
  }
);

AdminEditModal.propTypes = {
  formInitialText: oneOfType([bool, number, string]),
  formLabel: string,
  hoverText: string,
  icon: node,
  isDisabled: bool,
};

AdminEditModal.displayName = "AdminEditModal";
