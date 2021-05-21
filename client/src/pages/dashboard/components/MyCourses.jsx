import React from "react";
import { array } from "prop-types";
import { DashboardCourseCard } from "./";
import { CardColumns } from "react-bootstrap";

export const MyCourses = React.memo(({ courses }) => {
  return (
    <CardColumns className="mt-4">
      {courses.map((c) => (
        <DashboardCourseCard key={c._id} course={c} />
      ))}
    </CardColumns>
  );
});

MyCourses.propTypes = {
  courses: array.isRequired,
};

MyCourses.displayName = "MyCourses";
