import React from "react";
import { Card, Col } from "react-bootstrap";
import { array, string } from "prop-types";

export const HomeCard = React.memo(({ courses }) => {
  return (
    <Card
      className="border rounded shadow-sm"
      style={{ backgroundColor: "#f4fbf8" }}
    >
      <Card.Body>
        <Card.Text as={Col}>
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
      </Card.Body>
    </Card>
  );
});

HomeCard.propTypes = {
  courses: array.isRequired,
  link: string.isRequired,
};

HomeCard.displayName = "HomeCard";
