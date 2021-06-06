import React, { useState, useEffect } from "react";
import { AdminLayout, AdminSpinner } from "../components";
import { ClassroomItem } from "./components";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

export const AdminClassroomsPage = () => {
  const dispatch = useDispatch();

  const [classrooms, setClassrooms] = useState();
  const [filtered, setFiltered] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    dispatch(setTitle("Salones"));
    //
    TeacherAPI.t_fetchClassrooms()
      .then((res) => {
        console.log(res.data);
        const defaultSorting = res?.data?.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
        setClassrooms(defaultSorting);
        setFiltered(defaultSorting);
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

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
            {filtered.length ? (
              <>
                <h3 className="mb-3" style={{ color: "#0f5257" }}>
                  Selecciona un salón...
                </h3>
                <ListGroup>
                  {filtered.map((c) => (
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
