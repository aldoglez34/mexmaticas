import React, { useEffect } from "react";
import { AdminLayout } from "../components";
import * as yup from "yup";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import { NewTeacherForm } from "./components/NewTeacherForm";

export const AdminNewTeacher = () => {
  const dispatch = useDispatch();

  const yupschema = yup.object({
    description: yup.string(),
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
  });

  useEffect(() => {
    dispatch(setTitle("Nuevo Maestro"));
  }, [dispatch]);

  return (
    <AdminLayout leftBarActive="Maestros" backBttn="/admin/teachers">
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <h3 className="mb-3">Ingresa los datos del maestro.</h3>
            <NewTeacherForm />
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};
