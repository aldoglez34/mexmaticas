import React, { memo, useEffect, useState } from "react";
import { AssignData } from "../../../../components";
import {
  fetchOneClassroom,
  fetchStudents,
  updateClassroomMembers,
} from "../../../../services";
import { getFullName, sortArrayOfObjects } from "../../../../utils/helpers";
import { errorLogger } from "../../../../errors/errorLogger";
import { isEmpty } from "lodash";

export const AddStudentsModal = memo(({ classroomId }) => {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const _allStudents = await fetchStudents().then((res) =>
        res.data.map((s) => ({
          ...s,
          studentName: `[${s.email}] ${getFullName(
            s.name,
            s.firstSurname,
            s.secondSurname
          )}`,
        }))
      );
      const _assignedStudents = await fetchOneClassroom(classroomId).then(
        (res) =>
          (res.data.members || []).map((s) => ({
            ...s,
            studentName: `[${s.email}] ${getFullName(
              s.name,
              s.firstSurname,
              s.secondSurname
            )}`,
          }))
      );
      return { _allStudents, _assignedStudents };
    };

    try {
      fetchData().then(({ _allStudents, _assignedStudents }) => {
        setAssignedStudents(
          sortArrayOfObjects(_assignedStudents, "studentName")
        );
        setAllStudents(sortArrayOfObjects(_allStudents, "studentName"));
      });
    } catch (err) {
      errorLogger(err);
    }
  }, [classroomId]);

  const getProps = (selectedItems) => {
    const students = selectedItems.map(({ value }) => value);
    return { classroomId, members: students };
  };

  const afterSubmit = () => window.location.reload();

  if (isEmpty(allStudents)) return null;

  return (
    <AssignData
      accessors={{ label: "studentName", value: "_id" }}
      allData={allStudents}
      assignedData={assignedStudents}
      canSearchBy="studentName"
      onSubmitData={{
        afterSubmit,
        onSubmit: updateClassroomMembers,
        getProps,
      }}
    />
  );
});

AddStudentsModal.displayName = "AddStudentsModal";
