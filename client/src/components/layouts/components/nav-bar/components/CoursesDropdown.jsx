import React, { useState, useEffect } from "react";
import { NavDropdown, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { fetchSchoolDropdownItems } from "../../../../../services";
import "./navbardropdowns.scss";

export const CoursesDropdown = () => {
  const zenMode = useSelector((state) => state.zenMode);

  const [courses, setCourses] = useState();

  useEffect(() => {
    fetchSchoolDropdownItems()
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <NavDropdown
      id="navDropdownToggle"
      title={
        <span id="navDropdownText" className="px-0">
          {zenMode ? <s>Cursos</s> : <span>Cursos</span>}
          <i
            className="fas fa-chevron-down ml-1"
            style={{ fontSize: "13px" }}
          />
        </span>
      }
      disabled={zenMode}
    >
      {courses ? (
        courses.length ? (
          courses.map((c) => (
            <NavDropdown.Item
              key={c}
              href={`/courses/${c}`}
              className="dropdownItem"
            >
              {c}
            </NavDropdown.Item>
          ))
        ) : null
      ) : (
        <div className="my-2 text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </NavDropdown>
  );
};
