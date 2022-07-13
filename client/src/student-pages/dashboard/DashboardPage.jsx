import React, { useState, useEffect } from "react";
import { Button, CardColumns, Image, Spinner } from "react-bootstrap";
import { StudentLayout } from "../../components";
import { useSelector } from "react-redux";
import { fetchDashboard, fetchSchoolDropdownItems } from "../../services";
import { useDispatch } from "react-redux";
import * as courseActions from "../../redux/actions/course";
import * as examActions from "../../redux/actions/exam";
import * as zenModeActions from "../../redux/actions/zenMode";
import { errorLogger } from "../../errors/errorLogger";
import { isEmpty } from "lodash";
import { DashboardCourseCard } from "./components/DashboardCourseCard";
import { useClassroom } from "../hooks/useClassroom";

import styles from "./dashboardpage.module.scss";

export const DashboardPage = () => {
  const [courses, setCourses] = useState();
  const [coursesForSale, setCoursesForSale] = useState();

  const dispatch = useDispatch();
  const student = useSelector((state) => state.student);
  const course = useSelector((state) => state.course);
  const exam = useSelector((state) => state.exam);
  const zenMode = useSelector((state) => state.zenMode);

  const { hasClassrooms, myClassrooms } = useClassroom();

  const isLoading = !courses;
  const areCoursesEmpty = Boolean(!courses?.length);
  const thereAreCourses = Boolean(courses?.length);

  useEffect(() => {
    // clear redux stuff
    if (course) dispatch(courseActions.clearCourse());
    if (exam) dispatch(examActions.clearExam());
    if (zenMode) dispatch(zenModeActions.zenModeOff());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // fetch student's courses
    if (student) {
      fetchDashboard(student._id)
        .then((res) => setCourses(res.data.courses))
        .catch((err) => errorLogger(err));
    }
  }, [student, dispatch]);

  useEffect(() => {
    // fetch stuff only if there are no courses
    if (!areCoursesEmpty) return;
    fetchSchoolDropdownItems()
      .then((res) => setCoursesForSale(res.data))
      .catch((err) => errorLogger(err));
  }, [areCoursesEmpty]);

  const renderCourses = (courses) => (
    <CardColumns>
      {courses.map((c) => (
        <DashboardCourseCard key={c._id} course={c} />
      ))}
    </CardColumns>
  );

  const renderEmptyCourses = () => (
    <div className="text-center mt-4">
      <Image src="/images/emptybox.png" className={styles.emptyBox} />
      <em className="d-block lead" style={{ color: "#b3b3b3" }}>
        No tienes cursos en tu cuenta...
      </em>
      <div className="d-flex mt-4 justify-content-center">
        {!isEmpty(coursesForSale) &&
          coursesForSale.map((c) => (
            <Button
              className="shadow mr-3 genericButton"
              href={"/courses/" + c}
              key={c}
            >
              {c}
            </Button>
          ))}
      </div>
    </div>
  );

  return (
    <StudentLayout hasScrollButton>
      {hasClassrooms && (
        <section>
          <h3>Mis salones</h3>
          <ul>
            {myClassrooms.map((classroom, idx) => (
              <li key={idx}>
                {classroom.institution && (
                  <strong>{`${classroom.institution} / `}</strong>
                )}
                {classroom.name && <strong>{`${classroom.name} / `}</strong>}
                {classroom.teacher && <strong>{classroom.teacher}</strong>}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h3>Mis cursos</h3>
        {isLoading && (
          <div className="text-center mt-4 pt-4">
            <Spinner animation="border" variant="success" />
          </div>
        )}
        {thereAreCourses && renderCourses(courses)}
        {areCoursesEmpty && renderEmptyCourses()}
      </section>
    </StudentLayout>
  );
};
