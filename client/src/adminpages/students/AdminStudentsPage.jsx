import React, { useEffect, useRef, useState } from "react";
import { AdminLayout, AdminSpinner } from "../components";
import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import { StudentItem } from "./components";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

// const PAGE_SIZE = 5;
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
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const handleSortStudents = (criteria) => {
    setSort(criteria);
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
      const emailMatches = students.filter((s) =>
        String(s.email).toUpperCase().trim().includes(criteria.toUpperCase())
      );
      setFiltered([...nameMatches, ...emailMatches]);
    }
  };

  const clearFilters = () => {
    setSort(SORT_OPTIONS[0]);
    setFiltered(
      students.sort((a, b) => (a.registeredAt > b.registeredAt ? -1 : 1))
    );
    searchRef.current.value = "";
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
                      <option key={so}>{so}</option>
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
                <React.Fragment>
                  <ListGroup>
                    {filtered.map((s) => (
                      <StudentItem
                        _id={s._id}
                        email={s.email}
                        key={s._id}
                        name={`${s.name} ${s.firstSurname}`}
                      />
                    ))}
                  </ListGroup>
                  <div className="mt-3">
                    <Pagination>
                      <Pagination.First />
                      <Pagination.Prev />
                      <Pagination.Item>{1}</Pagination.Item>
                      <Pagination.Ellipsis />

                      <Pagination.Item>{10}</Pagination.Item>
                      <Pagination.Item>{11}</Pagination.Item>
                      <Pagination.Item active>{12}</Pagination.Item>
                      <Pagination.Item>{13}</Pagination.Item>
                      <Pagination.Item disabled>{14}</Pagination.Item>

                      <Pagination.Ellipsis />
                      <Pagination.Item>{20}</Pagination.Item>
                      <Pagination.Next />
                      <Pagination.Last />
                    </Pagination>
                  </div>
                </React.Fragment>
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
