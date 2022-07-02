import React, { memo, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Table } from "react-bootstrap";
import { fetchStudentHistory } from "../../../services";
import {
  AdminExportToExcel,
  AdminLayout,
  AdminPagination,
  AdminSpinner,
} from "../../../components";
import { formatDate } from "../../../utils/helpers";

const PAGE_SIZE = 25;
const SORT_OPTIONS = ["Más Recientes", "Más Antiguos"];

export const AdminStudentHistoryPage = memo((props) => {
  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState();
  const [history, setHistory] = useState();
  const [filtered, setFiltered] = useState();
  const [showExportToExcel, setShowExportToExcel] = useState(false);

  const studentId = props.routeProps.match.params.studentId;
  // TODO do this logic
  const studentName = "nombre del estudiante";

  const searchRef = useRef(null);

  useEffect(() => {
    setSort(SORT_OPTIONS[0]);
    //
    fetchStudentHistory(studentId)
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          a.date > b.date ? -1 : 1
        );
        setHistory(res.data);
        setFiltered(defaultSorting);
        setPages(Math.round(defaultSorting.length / PAGE_SIZE));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [studentId]);

  const handleSortHistory = (criteria) => {
    setSort(criteria);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria === SORT_OPTIONS[0])
      setFiltered((history) =>
        history.sort((a, b) => (a.date > b.date ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[1])
      setFiltered((history) =>
        history.sort((a, b) => (a.date < b.date ? -1 : 1))
      );
  };

  const handleFilterHistory = (criteria) => {
    setSort(SORT_OPTIONS[0]);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria.length < 3) {
      setFiltered(history.sort((a, b) => (a.date > b.date ? -1 : 1)));
    }
    if (criteria.length >= 3) {
      const examNameMatches = history.filter((s) =>
        String(`${s.exam}`)
          .toUpperCase()
          .trim()
          .includes(criteria.toUpperCase())
      );
      setFiltered(examNameMatches);
    }
  };

  const clearFilters = () => {
    setSort(SORT_OPTIONS[0]);
    setFiltered(history.sort((a, b) => (a.date > b.date ? -1 : 1)));
    searchRef.current.value = "";
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
  };

  const handleChangePage = (p) => {
    setActivePage(p);
    if (p === 1) {
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (p > 1) {
      const _offset = (p - 1) * PAGE_SIZE;
      setOffset(_offset);
      setLimit(_offset + PAGE_SIZE);
    }
  };

  const optionsDropdown = [
    {
      text: "Exportar a .csv",
      fn: () => setShowExportToExcel(true),
    },
  ];

  const headers = [
    { label: "Fecha", key: "date" },
    { label: "Alumno", key: "student" },
    { label: "Curso", key: "course" },
    { label: "Tema", key: "topic" },
    { label: "Examen", key: "exam" },
    { label: "Calificación", key: "grade" },
  ];

  return (
    <AdminLayout
      backBttn={`/admin/students/${studentId}`}
      leftBarActive="Alumnos"
      optionsDropdown={optionsDropdown}
      topNavTitle="Historial"
    >
      <Form className="mb-3">
        <Form.Row>
          <Col md="4" className="d-flex">
            <div className="d-flex align-items-center mr-2">
              <i className="fas fa-sort" style={{ fontSize: "19px" }} />
            </div>
            <Form.Control
              as="select"
              value={sort}
              onChange={(opt) => handleSortHistory(opt.target.value)}
            >
              {SORT_OPTIONS.map((so) => (
                <option key={so} value={so}>
                  {so}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col md="8" className="d-flex">
            <div className="d-flex align-items-center mr-2">
              <i className="fas fa-search" style={{ fontSize: "19px" }} />
            </div>
            <Form.Control
              onChange={(str) => handleFilterHistory(String(str.target.value))}
              placeholder="Buscar exámenes..."
              type="text"
              ref={searchRef}
            />
            <Button
              size="sm"
              variant="dark"
              className="ml-2"
              onClick={clearFilters}
            >
              <i className="fas fa-sync-alt px-1" />
            </Button>
          </Col>
        </Form.Row>
      </Form>
      {filtered ? (
        filtered.length ? (
          <>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th
                    className="py-3 text-center"
                    style={{ backgroundColor: "#f4fbf8" }}
                  >
                    <h5 className="mb-0">Fecha</h5>
                  </th>
                  <th
                    className="py-3 text-center"
                    style={{ backgroundColor: "#f4fbf8" }}
                  >
                    <h5 className="mb-0">Curso</h5>
                  </th>
                  <th
                    className="py-3 text-center"
                    style={{ backgroundColor: "#f4fbf8" }}
                  >
                    <h5 className="mb-0">Tema</h5>
                  </th>
                  <th
                    className="py-3 text-center"
                    style={{ backgroundColor: "#f4fbf8" }}
                  >
                    <h5 className="mb-0">Examen</h5>
                  </th>
                  <th
                    className="py-3 text-center"
                    style={{ backgroundColor: "#f4fbf8" }}
                  >
                    <h5 className="mb-0">Calificación</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(offset, limit).map((h) => {
                  return (
                    <tr key={h._id}>
                      <td className="align-middle">
                        <span className="d-block">
                          {formatDate(h.date, "L")}
                        </span>
                        <span className="d-block">
                          {formatDate(h.date, "h:mm:ss a")}
                        </span>
                      </td>
                      <td className="align-middle">{h.courseName}</td>
                      <td className="align-middle">{h.topicName}</td>
                      <td className="align-middle">{h.exam}</td>
                      <td className="align-middle text-center">{h.grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {filtered.length > PAGE_SIZE && (
              <div className="mt-3">
                <AdminPagination
                  activePage={activePage}
                  handleChangePage={(p) => handleChangePage(p)}
                  pageCount={pages}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-4">No hay registros de exámenes.</div>
        )
      ) : (
        <AdminSpinner />
      )}
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
        headers={headers}
        modalText={`Exporta el historial de exámenes de ${studentName} a un archivo .csv`}
        setShow={setShowExportToExcel}
        show={showExportToExcel}
        textIfEmpty="Historial vacío"
      />
    </AdminLayout>
  );
});

AdminStudentHistoryPage.displayName = "AdminStudentHistoryPage";
