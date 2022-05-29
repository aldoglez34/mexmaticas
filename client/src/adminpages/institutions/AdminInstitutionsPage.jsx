import React, { useEffect, useRef, useState } from "react";
import { AdminLayout, AdminPagination, AdminSpinner } from "../components";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import { fetchInstitutions } from "../../services";
import { InstitutionItem } from "./components/";

const PAGE_SIZE = 15;
const SORT_OPTIONS = [
  "Más Recientes",
  "Más Antiguos",
  "Por Nombre Asc",
  "Por Nombre Desc",
];

export const AdminInstitutionsPage = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState();
  const [institutions, setInstitutions] = useState();
  const [filtered, setFiltered] = useState();

  useEffect(() => {
    dispatch(setTitle("Escuelas"));
    setSort(SORT_OPTIONS[0]);
    //
    fetchInstitutions()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
        setInstitutions(defaultSorting);
        setFiltered(defaultSorting);
        setPages(Math.round(defaultSorting.length / PAGE_SIZE));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const optionsDropdown = [
    {
      text: "Nueva Escuela",
      fn: () => (window.location.href = "/admin/institutions/new"),
    },
  ];

  const handleSortInstitutions = (criteria) => {
    setSort(criteria);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria === SORT_OPTIONS[0])
      setFiltered((institutions) =>
        institutions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[1])
      setFiltered((institutions) =>
        institutions.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      );
    if (criteria === SORT_OPTIONS[2])
      setFiltered((institutions) =>
        institutions.sort((a, b) =>
          String(`${a.name}`).toUpperCase().trim() <
          String(`${b.name}`).toUpperCase().trim()
            ? -1
            : 1
        )
      );
    if (criteria === SORT_OPTIONS[3])
      setFiltered((institutions) =>
        institutions.sort((a, b) =>
          String(`${a.name}`).toUpperCase().trim() >
          String(`${b.name}`).toUpperCase().trim()
            ? -1
            : 1
        )
      );
  };

  const handleFilterInstitutions = (criteria) => {
    setSort(SORT_OPTIONS[0]);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (criteria.length < 3) {
      setFiltered(
        institutions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      );
    }
    if (criteria.length >= 3) {
      const nameMatches = institutions.filter((s) =>
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
      institutions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
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
    <AdminLayout leftBarActive="Escuelas" optionsDropdown={optionsDropdown}>
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
                    onChange={(opt) => handleSortInstitutions(opt.target.value)}
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
                      handleFilterInstitutions(String(str.target.value))
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
                    {filtered.slice(offset, limit).map((c) => (
                      <InstitutionItem
                        _id={c._id}
                        description={c.description}
                        key={c._id}
                        name={c.name}
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
                </React.Fragment>
              ) : (
                <div className="text-center mt-4">No hay escuelas.</div>
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
