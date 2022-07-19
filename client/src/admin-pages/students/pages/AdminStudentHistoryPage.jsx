import React, { useEffect, useMemo, useState } from "react";
import { fetchOneStudent, fetchStudentHistory } from "../../../services";
import {
  AdminDataTemplate,
  AdminExportToExcel,
  AdminLayout,
  SearchForm,
} from "../../../components";
import { formatDate, getFullName } from "../../../utils/helpers";
import { errorLogger } from "../../../errors/errorLogger";
import { ADMIN_PAGES } from "../../../utils/constants";
import { useDataUtils } from "../../../hooks/useDataUtils";
import { isEmpty } from "lodash";

export const AdminStudentHistoryPage = (props) => {
  const [student, setStudent] = useState();
  const [history, setHistory] = useState();
  const [showExportToExcel, setShowExportToExcel] = useState(false);

  const studentId = props.routeProps.match.params.studentId;

  const studentName = useMemo(
    () =>
      getFullName(student?.name, student?.firstSurname, student?.secondSurname),
    [student]
  );

  const {
    STUDENTS: { PAGE_SIZE, SORT_OPTIONS },
  } = ADMIN_PAGES;

  useEffect(() => {
    if (!studentId) return;
    try {
      fetchOneStudent(studentId).then(({ data: _student }) => {
        setStudent(_student);
        fetchStudentHistory(_student._id).then(({ data: _history }) =>
          setHistory(
            (_history || []).sort((a, b) => (a.date > b.date ? -1 : 1))
          )
        );
      });
    } catch (err) {
      errorLogger(err);
    }
  }, [studentId]);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef, sort },
    functions: {
      clearFilters,
      handleChangePage,
      handleFilterData,
      handleSortData,
    },
  } = useDataUtils({
    data: history,
    pageSize: PAGE_SIZE,
    searchBarAccessor: "exam",
    sortOptions: SORT_OPTIONS,
  });

  const optionsDropdown = [
    {
      text: "Exportar a .csv",
      fn: () => setShowExportToExcel(true),
    },
  ];

  const tableHeaders = [
    "Fecha",
    "Alumno",
    "Curso",
    "Tema",
    "Examen",
    "Calificación",
  ];

  const mapItemFunc = (item, idx) => (
    <tr key={idx}>
      <td>{formatDate(item.date, "L")}</td>
      <td>{studentName}</td>
      <td>{item.courseName}</td>
      <td>{item.topicName}</td>
      <td>{item.exam}</td>
      <td>{item.grade}</td>
    </tr>
  );

  return (
    <AdminLayout
      backBttn={`/admin/students/${studentId}`}
      leftBarActive="Alumnos"
      optionsDropdown={optionsDropdown}
      topNavTitle="Historial"
      expanded
    >
      <SearchForm
        activeSort={sort}
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        handleSort={handleSortData}
        isDataEmpty={isEmpty(history)}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de examen..."
        sortOptions={SORT_OPTIONS}
      />
      <AdminDataTemplate
        {...{
          activePage,
          data: filtered,
          emptyMessage: "Historial vacío.",
          handleChangePage,
          isTable: true,
          limit,
          mapItemFunc,
          offset,
          pages,
          pageSize: PAGE_SIZE,
          tableHeaders,
        }}
      />
      <AdminExportToExcel
        data={history?.reduce((acc, cv) => {
          acc.push({
            date: cv.date,
            student: studentName,
            course: cv.courseName,
            topic: cv.topicName,
            grade: cv.grade,
            exam: cv.exam,
          });
          return acc;
        }, [])}
        fileName={studentName}
        headers={[
          { label: "Fecha", key: "date" },
          { label: "Alumno", key: "student" },
          { label: "Curso", key: "course" },
          { label: "Tema", key: "topic" },
          { label: "Examen", key: "exam" },
          { label: "Calificación", key: "grade" },
        ]}
        modalText={`Exporta el historial de exámenes de ${studentName} a un archivo .csv`}
        setShow={setShowExportToExcel}
        show={showExportToExcel}
        textIfEmpty="Historial vacío."
      />
    </AdminLayout>
  );
};

AdminStudentHistoryPage.displayName = "AdminStudentHistoryPage";
