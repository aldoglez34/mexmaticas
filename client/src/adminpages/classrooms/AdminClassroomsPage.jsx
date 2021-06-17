import React, { useEffect, useRef, useState } from "react";
import { AdminLayout, AdminPagination, AdminSpinner } from "../components";
import { ClassroomItem } from "./components";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

const PAGE_SIZE = 10;
const SORT_OPTIONS = [
  "Más Recientes",
  "Más Antiguos",
  "Por Nombre Asc",
  "Por Nombre Desc",
];

export const AdminClassroomsPage = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState();
  const [classrooms, setClassrooms] = useState();
  const [filtered, setFiltered] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    dispatch(setTitle("Salones"));
    //
    TeacherAPI.t_fetchClassrooms()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
        setClassrooms(defaultSorting);
        setFiltered(defaultSorting);
        setPages(Math.round(defaultSorting.length / PAGE_SIZE));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const handleSortClassrooms = (criteria) => {
    setSort(criteria);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria === SORT_OPTIONS[0])
      setFiltered((classrooms) =>
        classrooms.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[1])
      setFiltered((classrooms) =>
        classrooms.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[2])
      setFiltered((classrooms) =>
        classrooms.sort((a, b) =>
          String(`${a.name}`).toUpperCase().trim() <
          String(`${b.name}`).toUpperCase().trim()
            ? -1
            : 1
        )
      );
    if (criteria === SORT_OPTIONS[3])
      setFiltered((classrooms) =>
        classrooms.sort((a, b) =>
          String(`${a.name}`).toUpperCase().trim() >
          String(`${b.name}`).toUpperCase().trim()
            ? -1
            : 1
        )
      );
  };

  const handleFilterClassrooms = (criteria) => {
    setSort(SORT_OPTIONS[0]);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria.length < 3) {
      setFiltered(
        classrooms.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      );
    }
    if (criteria.length >= 3) {
      const nameMatches = classrooms.filter((s) =>
        String(`${s.name}`)
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
      classrooms.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
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

  const filterClassrooms = (criteria) => {
    setFilter(criteria === filter ? null : criteria);
    setFiltered(
      criteria === filter
        ? classrooms
        : classrooms.filter((c) => c.school === criteria)
    );
  };

  const filters = (
    <div className="d-flex">
      <Button
        disabled={classrooms ? false : true}
        active={filter === "Primaria" ? true : false}
        variant="outline-light"
        className="shadow-sm"
        onClick={() => filterClassrooms("Primaria")}
      >
        Primaria
      </Button>
      <Button
        disabled={classrooms ? false : true}
        active={filter === "Secundaria" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterClassrooms("Secundaria")}
      >
        Secundaria
      </Button>
      <Button
        disabled={classrooms ? false : true}
        active={filter === "Preparatoria" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterClassrooms("Preparatoria")}
      >
        Preparatoria
      </Button>
      <Button
        disabled={classrooms ? false : true}
        active={filter === "Universidad" ? true : false}
        variant="outline-light"
        className="shadow-sm ml-2"
        onClick={() => filterClassrooms("Universidad")}
      >
        Universidad
      </Button>
    </div>
  );

  const optionsDropdown = [
    {
      text: "Nuevo Salón",
      fn: () => (window.location.href = "/admin/classrooms/new"),
    },
  ];

  return filtered ? (
    <AdminLayout
      buttons={filters}
      leftBarActive="Salones"
      optionsDropdown={optionsDropdown}
    >
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
                    onChange={(opt) => handleSortClassrooms(opt.target.value)}
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
                      handleFilterClassrooms(String(str.target.value))
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
            {filtered.length ? (
              <>
                <ListGroup>
                  {filtered.slice(offset, limit).map((c) => (
                    <ClassroomItem
                      _id={c._id}
                      description={c.description}
                      institution={c.institution?.name}
                      key={c._id}
                      membersCounter={c.members.length}
                      name={c.name}
                      school={c.school}
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
              <div className="text-center mt-4">No hay salones.</div>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
