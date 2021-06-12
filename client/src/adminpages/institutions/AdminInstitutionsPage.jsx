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
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import TeacherAPI from "../../utils/TeacherAPI";
import { InstitutionItem } from "./components/";

const SORT_OPTIONS = [
  "Más Recientes",
  "Más Antiguos",
  "Por Nombre Asc",
  "Por Nombre Desc",
];

export const AdminInstitutionsPage = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const [sort, setSort] = useState();
  const [institutions, setInstitutions] = useState();
  const [filtered, setFiltered] = useState();

  useEffect(() => {
    dispatch(setTitle("Escuelas"));
    //
    TeacherAPI.t_fetchInstitutions()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
        setInstitutions(defaultSorting);
        setFiltered(defaultSorting);
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
                    {filtered.map((c) => (
                      <InstitutionItem
                        _id={c._id}
                        description={c.description}
                        key={c._id}
                        name={c.name}
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
