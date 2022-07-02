import React, { useState } from "react";
import { any, bool, number, object, oneOf, oneOfType, string } from "prop-types";
import { AdminModal } from "../modals/AdminModal";
import { IconButton } from "./IconButton";

export const ModalIconButton = React.memo(
  ({
    Form,
    formInitialText,
    formLabel,
    hoverText,
    initialQuestion,
    isDisabled,
    modalTitle,
    size,
    svg,
  }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <IconButton
          {...{
            hoverText,
            isDisabled,
            onClick: handleShow,
            svg,
          }}
        />

        <AdminModal
          handleClose={handleClose}
          show={show}
          size={size}
          title={modalTitle}
        >
          <Form
            {...{
              ...(formLabel && { formLabel }),
              ...(formInitialText && { formInitialText }),
              ...(initialQuestion && { question: initialQuestion }),
            }}
          />
        </AdminModal>
      </>
    );
  }
);

ModalIconButton.propTypes = {
  Form: any,
  formInitialText: oneOfType([bool, number, string]),
  formLabel: string,
  hoverText: string,
  initialQuestion: object,
  isDisabled: bool,
  modalTitle: string,
  size: oneOf(["sm", "md", "lg", "xl"]),
  svg: oneOf(["add", "anchor", "delete", "edit"]),
};

ModalIconButton.displayName = "ModalIconButton";
