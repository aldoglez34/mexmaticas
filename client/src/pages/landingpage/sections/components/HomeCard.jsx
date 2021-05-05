import React from "react";
import { Card, Col, Button } from "react-bootstrap";
import { array, string } from "prop-types";

export const HomeCard = React.memo(({ courses, link }) => {
  return (
    <Card
      className="border rounded shadow-sm"
      style={{ backgroundColor: "#f4fbf8" }}
    >
      <Card.Body>
        <Card.Text className="px-0" as={Col}>
          {courses.map((l, idx) => {
            return (
              <div key={idx}>
                <div className="lead">
                  <i
                    className="fas fa-check-circle mr-2"
                    style={{ color: "#48bf84" }}
                  />
                  <span style={{ fontWeight: 700 }}>{l.title}</span>
                </div>
                <ul>
                  {l.list.map((ll, idx) => {
                    return <li key={idx}>{ll}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </Card.Text>
        <Card.Text className="mt-4">
          <Button href={link} className="shadow-sm seemorebttn">
            Ir a compras
            <i className="fas fa-long-arrow-alt-right ml-2" />
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
});

HomeCard.propTypes = {
  courses: array.isRequired,
  link: string.isRequired,
};
