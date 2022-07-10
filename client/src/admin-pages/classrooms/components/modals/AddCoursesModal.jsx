import React, { memo, useEffect, useState } from "react";
import { AssignData } from "../../../../components";
import {
  fetchCourses,
  fetchOneClassroom,
  updateClassroomCourses,
} from "../../../../services";
import { sortArrayOfObjects } from "../../../../utils/helpers";
import { errorLogger } from "../../../../errors/errorLogger";
import { isEmpty } from "lodash";

export const AddCoursesModal = memo(({ classroomId }) => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const _allCourses = await fetchCourses().then((res) =>
        res.data.map((c) => ({
          ...c,
          courseName: `[${c.school}] ${c.name.trim()}`,
        }))
      );
      const _assignedCourses = await fetchOneClassroom(classroomId).then(
        (res) =>
          (res.data.courses || []).map((c) => ({
            ...c,
            courseName: `[${c.school}] ${c.name.trim()}`,
          }))
      );
      return { _allCourses, _assignedCourses };
    };

    try {
      fetchData().then(({ _allCourses, _assignedCourses }) => {
        setAssignedCourses(sortArrayOfObjects(_assignedCourses, "courseName"));
        setAllCourses(sortArrayOfObjects(_allCourses, "courseName"));
      });
    } catch (err) {
      errorLogger(err);
    }
  }, [classroomId]);

  const getProps = (selectedItems) => {
    const courses = selectedItems.map(({ value }) => value);
    return { classroomId, courses };
  };

  const afterSubmit = () => window.location.reload();

  if (isEmpty(allCourses)) return null;

  return (
    <AssignData
      accessors={{ label: "courseName", value: "_id" }}
      allData={allCourses}
      assignedData={assignedCourses}
      canSearchBy="courseName"
      onSubmitData={{
        afterSubmit,
        onSubmit: updateClassroomCourses,
        getProps,
      }}
    />
  );
});

AddCoursesModal.displayName = "AddCoursesModal";
