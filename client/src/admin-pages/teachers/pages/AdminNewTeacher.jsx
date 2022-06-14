import React, { useEffect } from "react";
import { AdminLayout } from "../../../components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../redux/actions/admin";
import { NewTeacherForm } from "../components";

export const AdminNewTeacher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Nuevo Maestro"));
  }, [dispatch]);

  return (
    <AdminLayout leftBarActive="Maestros" backBttn="/admin/teachers">
      <h3 className="mb-3">Ingresa los datos del maestro.</h3>
      <NewTeacherForm />
    </AdminLayout>
  );
};
