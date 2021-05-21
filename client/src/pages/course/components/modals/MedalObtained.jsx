import React, { useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ImageFromFirebase } from "../../../../adminpages/components";
import { object } from "prop-types";
import cn from "classnames";

import styles from "./medalobtained.module.scss";

export const MedalObtained = React.memo(({ reward }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <OverlayTrigger
        key={reward.medalName}
        placement="top"
        onClick={handleShow}
        overlay={
          <Tooltip>
            <strong>{reward.medalName}</strong>
          </Tooltip>
        }
      >
        <ImageFromFirebase
          className={cn("my-1", "mx-3", styles.medal)}
          height="120"
          onClick={handleShow}
          path={reward.link}
          width="80"
        />
      </OverlayTrigger>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="d-flex flex-column mb-2">
            <div className="d-flex align-items-start">
              <h4 className="text-dark mb-3">{reward.medalName}</h4>
              <Button
                className="ml-auto text-dark"
                variant="link"
                size="sm"
                title="Cerrar"
                onClick={handleClose}
              >
                <i className="fas fa-times" style={{ fontSize: "22px" }} />
              </Button>
            </div>
            <div className="text-center mt-3">
              <ImageFromFirebase height="80%" path={reward.link} width="80%" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

MedalObtained.propTypes = {
  reward: object.isRequired,
};

MedalObtained.displayName = "MedalObtained";
