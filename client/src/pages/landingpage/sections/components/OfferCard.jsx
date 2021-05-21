import React from "react";
import { string } from "prop-types";
import { Card } from "react-bootstrap";

export const OfferCard = React.memo(({ img, title, text }) => {
  return (
    <Card className="bg-transparent border-0">
      <div className="text-center mt-4">
        <Card.Img variant="top" src={img} alt="cursos" className="tc_pic" />
      </div>
      <Card.Body>
        <Card.Title>
          <strong>{title}</strong>
        </Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
});

OfferCard.propTypes = {
  img: string.isRequired,
  title: string.isRequired,
  text: string.isRequired,
};

OfferCard.displayName = "OfferCard";
