import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { fetchCourseInfo } from "../../services";
import { StudentLayout } from "../../components";
import { CourseIntro, Topic } from "./components";
import { useSelector, useDispatch } from "react-redux";
import * as examActions from "../../redux/actions/exam";
import * as zenModeActions from "../../redux/actions/zenMode";
import { useClassroom } from "../hooks/useClassroom";

import styles from "./coursepage.module.scss";

export const CoursePage = React.memo((props) => {
  const [course, setCourse] = useState();

  const dispatch = useDispatch();
  const reduxCourse = useSelector((state) => state.course);
  const reduxStudent = useSelector((state) => state.student);
  const reduxExam = useSelector((state) => state.exam);
  const zenMode = useSelector((state) => state.zenMode);

  const { getTeacherNames, isPartOfClassroom } = useClassroom(course?._id);

  useEffect(() => {
    // clearing stuff (if coming from results screen)
    if (reduxExam) dispatch(examActions.clearExam());
    if (zenMode) dispatch(zenModeActions.zenModeOff());

    if (reduxCourse && reduxStudent) {
      fetchCourseInfo(reduxCourse._id, reduxStudent._id)
        .then((res) => setCourse(res.data))
        .catch((err) => {
          console.log(err);
          alert("Ocurrió un error al cargar la información del curso.");
          window.location.href = "/dashboard";
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxCourse]);

  // if there's an error with the redux data, send the user back to the dashboard
  useEffect(() => {
    if (!reduxCourse || !reduxStudent) {
      window.location.href = "/dashboard";
    }
  }, [reduxCourse, reduxStudent]);

  // jump into the course if there's a hash in the url
  useEffect(() => {
    const _hash = props.routeProps.location.hash;
    const hash = _hash ? decodeURI(_hash.replace("#", "")) : null;
    if (hash) {
      const element = document.getElementById(hash);
      if (element) element.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  return (
    <StudentLayout expanded hasScrollButton={true}>
      {course ? (
        <>
          {/* TOP INTRO */}
          <CourseIntro
            name={course.name}
            topics={course.topics.reduce((acc, cv) => {
              acc.push({
                _id: cv._id,
                name: cv.name,
                subject: cv.subject,
                topicOrderNumber: cv.topicOrderNumber,
              });
              return acc;
            }, [])}
            rewards={course.rewards}
            courseId={course._id}
          />
          {/* TOPICS */}
          <div style={{ paddingBottom: "100px" }}>
            {course.topics
              .sort((a, b) => a.topicOrderNumber - b.topicOrderNumber)
              .map((ct) => (
                <React.Fragment key={ct._id}>
                  <hr className={styles.mexmaticasDivider} />
                  <div className={styles.topicSection}>
                    <Container>
                      <Topic
                        {...{
                          courseName: course.name,
                          getTeacherNames,
                          isPartOfClassroom,
                          topic: ct,
                        }}
                      />
                    </Container>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-4 pt-4">
          <Spinner animation="border" variant="success" />
        </div>
      )}
    </StudentLayout>
  );
});

CoursePage.displayName = "CoursePage";
