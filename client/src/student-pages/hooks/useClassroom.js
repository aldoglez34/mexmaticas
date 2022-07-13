import { useCallback, useEffect, useMemo, useState } from "react";
import { isEmpty, isEqual } from "lodash";
import { useSelector } from "react-redux";
import { fetchStudentClassrooms } from "../../services";
import { errorLogger } from "../../errors/errorLogger";

export const useClassroom = (courseId) => {
  const [myClassrooms, setMyClassrooms] = useState();

  const studentId = useSelector((state) => state.student?._id);

  useEffect(() => {
    if (!studentId) return;
    fetchStudentClassrooms(studentId)
      .then((res) => setMyClassrooms(res.data))
      .catch((err) => errorLogger(err));
  }, [studentId]);

  const isPartOfClassroom = useMemo(
    () =>
      (myClassrooms || []).some(({ courses }) =>
        (courses || []).some((course) =>
          isEqual(String(course._id), String(courseId))
        )
      ),
    [courseId, myClassrooms]
  );

  const getTeacherNames = useCallback(
    (topicId) => {
      if (isEmpty(myClassrooms)) return null;
      const teachers = myClassrooms.reduce((acc, cv) => {
        if (isEmpty(cv.courses)) return null;
        const teacherName = cv.teacher;
        const teacherId = cv.teacherId;
        cv.courses.forEach((c) => {
          if (isEmpty(c.topics)) return;
          c.topics.forEach((t) => {
            if (isEqual(String(t._id), String(topicId)))
              acc.push({ name: teacherName, id: teacherId });
          });
        });
        return acc;
      }, []);
      // remove duplicates if any
      const uniqueTeachers = [...new Set(teachers)];
      return uniqueTeachers;
    },
    [myClassrooms]
  );

  return { getTeacherNames, isPartOfClassroom, myClassrooms };
};
