import React from "react";
import { AdminLayout } from "../../../components";
import { NewTeacherForm } from "../components";

export const AdminNewTeacher = () => (
  <AdminLayout
    backBttn="/admin/teachers"
    leftBarActive="Maestros"
    topNavTitle="Nuevo Maestro"
  >
    <h3 className="mb-3">Ingresa los datos del maestro.</h3>
    <NewTeacherForm />
  </AdminLayout>
);
