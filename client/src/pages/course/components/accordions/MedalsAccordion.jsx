import React, { useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { MedalTable } from "../";
import { array } from "prop-types";

export const MedalsAccordion = ({ rewards }) => {
  const [iconClicked, setIconClicked] = useState(false);

  const icon = iconClicked
    ? "fas fa-chevron-up ml-2"
    : "fas fa-chevron-down ml-2";

  return (
    <Accordion>
      <Card className="bg-transparent border-0">
        <Card.Header className="bg-transparent p-0 border-0">
          <Accordion.Toggle
            as={Button}
            className="p-0"
            eventKey="0"
            style={{ boxShadow: "none", textDecoration: "none" }}
            variant="link"
          >
            <h3
              style={{ color: "#828c90" }}
              className="mb-3"
              onClick={() => setIconClicked((prevState) => !prevState)}
            >
              Medallero
              <small>
                <i className={icon} />
              </small>
            </h3>
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="p-0">
            <MedalTable rewards={rewards} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

MedalsAccordion.propTypes = {
  rewards: array.isRequired,
};
