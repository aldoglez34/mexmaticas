import React, { useEffect, useState } from "react";
import { AssignData } from "../../../../components/assignation/AssignData";
import { fetchCourses, fetchOneClassroom } from "../../../../services";
import { sortArrayOfObjects } from "../../../../utils/helpers";

export const AddCoursesModal = ({ classroomId }) => {
  const [assignedCourses, setAssignedCourses] = useState();
  const [allCourses, setAllCourses] = useState();

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
          res.data.courses.map((c) => ({
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
      console.log(err);
      alert("Ocurrió un error.");
    }
  }, [classroomId]);

  const handleSubmit = (values) => console.log("submitting", values);

  return (
    <AssignData
      accessors={{ label: "courseName", value: "_id" }}
      allData={{ data: allCourses, title: "Cursos disponibles" }}
      assignedData={{ data: assignedCourses, title: "Cursos asignados" }}
      buttonLabels={["Todos los cursos", "Cursos asignados"]}
      onSubmit={handleSubmit}
    />
  );
};
