import React from "react";
import { Image, Modal } from "react-bootstrap";
import { bool, node, string } from "prop-types";

import styles from "./alertmodal.module.scss";

export const AlertModal = React.memo(({ children, image, show }) => {
  return (
    <Modal
      backdrop="static"
      className={styles.backgroundPhoto}
      keyboard={false}
      show={show}
    >
      <Modal.Body className="bg-light rounded shadow text-center py-4">
        {image && (
          <Image height="100" src={image} width="100" className="mb-3" />
        )}
        {children}
      </Modal.Body>
    </Modal>
  );
});

AlertModal.propTypes = {
  children: node.isRequired,
  image: string,
  show: bool.isRequired,
};

AlertModal.displayName = "AlertModal";
