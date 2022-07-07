import React, { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../../components";
import * as yup from "yup";
import { fetchInstitutions, newClassroom } from "../../../services";
import { useForm } from "../../../hooks/useForm";

export const AdminNewClassroomPage = () => {
  const [institutions, setInstitutions] = useState();

  const { renderForm } = useForm();

  const yupSchema = yup.object({
    description: yup.string(),
    institution: yup.string(),
    name: yup.string().min(3, "Nombre demasiado corto").required("Requerido"),
    school: yup.string(),
  });

  useEffect(() => {
    fetchInstitutions()
      .then((res) => {
        const defaultSorting = res?.data?.sort((a, b) =>
          String(a.name).toUpperCase().trim() <
          String(b.name).toUpperCase().trim()
            ? -1
            : 1
        );
        setInstitutions(defaultSorting);
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, []);

  const formData = useMemo(
    () => [
      [
        {
          isRequired: true,
          label: "Nombre",
          maxLength: 40,
          name: "name",
          size: 7,
        },
        {
          as: "select",
          hasBlankOption: true,
          label: "Nivel escolar",
          name: "school",
          options: ["Primaria", "Secundaria", "Preparatoria", "Universidad"],
          size: 5,
        },
      ],
      {
        as: "select",
        hasBlankOption: true,
        label: "Escuela",
        name: "institution",
        options: institutions,
        optionsAccessors: { label: "name", value: "_id" },
      },
      {
        as: "select",
        hasBlankOption: true,
        label: "Maestro",
        name: "teacher",
        options: ["uno", "dos", "tres"],
      },
      {
        as: "textarea",
        label: "Descripción",
        maxLength: 1000,
        name: "description",
        rows: 4,
      },
    ],
    [institutions]
  );

  return (
    <AdminLayout
      backBttn="/admin/classrooms"
      leftBarActive="Salones"
      topNavTitle="Nuevo Salón"
    >
      {renderForm({
        data: formData,
        doTrimValues: true,
        handleSubmit: newClassroom,
        onSubmitSuccess: () => (window.location.href = "/admin/classrooms"),
        yupSchema,
      })}
    </AdminLayout>
  );
};
