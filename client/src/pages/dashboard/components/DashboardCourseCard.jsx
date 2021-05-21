import React from "react";
import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { object } from "prop-types";
import { useDispatch } from "react-redux";
import * as courseActions from "../../../redux/actions/course";
import cn from "classnames";

import styles from "./dashboardcoursecard.module.scss";

export const DashboardCourseCard = React.memo(({ course }) => {
  const dispatch = useDispatch();

  const buttonClicked = async (courseId, courseName) => {
    dispatch(courseActions.setCourse({ _id: courseId, name: courseName }));
  };

  return (
    <Card className={cn("shadow-sm", styles.card)}>
      <Card.Body>
        <Card.Title className="d-flex flex-row">
          <h2 className="mb-0">{course.name}</h2>
        </Card.Title>
        <Card.Text>{course.description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        {course.topics
          .sort((a, b) => a.topicOrderNumber - b.topicOrderNumber)
          .map((ct) => (
            <ListGroupItem
              key={ct._id}
              className="d-flex flex-row align-items-center"
            >
              <Button
                variant="link"
                className={cn("p-0", "text-left", styles.link)}
                onClick={() =>
                  buttonClicked(course._id, course.name).then(
                    () => (window.location.href = "/course/#" + ct.name)
                  )
                }
                title={"Ir a " + ct.name}
              >
                <strong>
                  <i
                    className="fas fa-location-arrow mr-2"
                    style={{ fontSize: "13px" }}
                  />
                  {ct.name}
                </strong>
              </Button>

              {ct.hasReward ? (
                <i
                  className="fas fa-medal text-warning ml-2"
                  title="Aprobado"
                />
              ) : null}
            </ListGroupItem>
          ))}
      </ListGroup>
      <Card.Body>
        <Button
          className="shadow-sm genericButton"
          onClick={() =>
            buttonClicked(course._id, course.name).then(
              () => (window.location.href = "/course")
            )
          }
        >
          <strong>Abrir</strong>
        </Button>
      </Card.Body>
    </Card>
  );
});

DashboardCourseCard.propTypes = {
  course: object.isRequired,
};

DashboardCourseCard.displayName = "DashboardCourseCard";
