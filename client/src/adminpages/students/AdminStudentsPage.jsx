import React, { useEffect, useRef, useState } from "react";
import { AdminLayout, AdminPagination, AdminSpinner } from "../components";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { StudentItem } from "./components";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

const PAGE_SIZE = 15;
const SORT_OPTIONS = [
  "Más Recientes",
  "Más Antiguos",
  "Por Nombre Asc",
  "Por Nombre Desc",
  "Por Email Asc",
  "Por Email Desc",
];

export const AdminStudentsPage = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState();
  const [students, setStudents] = useState();
  const [filtered, setFiltered] = useState();

  useEffect(() => {
    dispatch(setTitle("Alumnos"));
    setSort(SORT_OPTIONS[0]);
    //
    TeacherAPI.t_fetchStudents()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          a.registeredAt > b.registeredAt ? -1 : 1
        );
        setStudents(defaultSorting);
        setFiltered(defaultSorting);
        setPages(Math.round(defaultSorting.length / PAGE_SIZE));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const handleSortStudents = (criteria) => {
    setSort(criteria);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria === SORT_OPTIONS[0])
      setFiltered((students) =>
        students.sort((a, b) => (a.registeredAt > b.registeredAt ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[1])
      setFiltered((students) =>
        students.sort((a, b) => (a.registeredAt < b.registeredAt ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[2])
      setFiltered((students) =>
        students.sort((a, b) =>
          String(`${a.name} ${a.firstSurname}`).toUpperCase().trim() <
          String(`${b.name} ${b.firstSurname}`).toUpperCase().trim()
            ? -1
            : 1
        )
      );
    if (criteria === SORT_OPTIONS[3])
      setFiltered((students) =>
        students.sort((a, b) =>
          String(`${a.name} ${a.firstSurname}`).toUpperCase().trim() >
          String(`${b.name} ${b.firstSurname}`).toUpperCase().trim()
            ? -1
            : 1
        )
      );
    if (criteria === SORT_OPTIONS[4])
      setFiltered((students) =>
        students.sort((a, b) =>
          String(a.email).toUpperCase().trim() <
          String(b.email).toUpperCase().trim()
            ? -1
            : 1
        )
      );
    if (criteria === SORT_OPTIONS[5])
      setFiltered((students) =>
        students.sort((a, b) =>
          String(a.email).toUpperCase().trim() >
          String(b.email).toUpperCase().trim()
            ? -1
            : 1
        )
      );
  };

  const handleFilterStudents = (criteria) => {
    setSort(SORT_OPTIONS[0]);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria.length < 3) {
      setFiltered(
        students.sort((a, b) => (a.registeredAt > b.registeredAt ? -1 : 1))
      );
    }
    if (criteria.length >= 3) {
      const nameMatches = students.filter((s) =>
        String(`${s.name} ${s.firstSurname}`)
          .toUpperCase()
          .trim()
          .includes(criteria.toUpperCase())
      );
      setFiltered(nameMatches);
    }
  };

  const clearFilters = () => {
    setSort(SORT_OPTIONS[0]);
    setFiltered(
      students.sort((a, b) => (a.registeredAt > b.registeredAt ? -1 : 1))
    );
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

  return (
    <AdminLayout leftBarActive="Alumnos">
      <Container fluid>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <Form className="mb-3">
              <Form.Row>
                <Col md="4" className="d-flex">
                  <div className="d-flex align-items-center mr-2">
                    <i className="fas fa-sort" style={{ fontSize: "19px" }} />
                  </div>
                  <Form.Control
                    as="select"
                    value={sort}
                    onChange={(opt) => handleSortStudents(opt.target.value)}
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
                    onChange={(str) =>
                      handleFilterStudents(String(str.target.value))
                    }
                    placeholder="Buscar..."
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
                  <ListGroup>
                    {filtered.slice(offset, limit).map((s) => (
                      <StudentItem
                        _id={s._id}
                        email={s.email}
                        key={s._id}
                        name={`${s.name} ${s.firstSurname}`}
                      />
                    ))}
                  </ListGroup>
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
                <div className="text-center mt-4">No hay alumnos.</div>
              )
            ) : (
              <AdminSpinner />
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};
