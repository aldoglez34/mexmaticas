import React, { useState, useEffect } from "react";
import { AdminLayout, AdminRow, AdminTable } from "../../components";
import { Alert } from "react-bootstrap";
import { fetchExam } from "../../services";
import {
  ExamDescriptionForm,
  ExamDurationForm,
  ExamNameForm,
  ExamQCounterForm,
} from "./components";
import { useDispatch, useSelector } from "react-redux";
import { setExam } from "../../redux/actions/admin";
import { gt } from "lodash";
import { getDifficultyNameInSpanish } from "../../utils/helpers";
import { useExamsData } from "./components/hooks/useExamsData";
import { useDataRefs } from "./components/hooks/useDataRefs";

export const AdminExamDetailPage = (props) => {
  // state
  const [exam, setExamOnState] = useState();

  // redux
  const dispatch = useDispatch();
  const courseName = useSelector((state) => state.admin.course.courseName);
  const topicName = useSelector((state) => state.admin.topic.topicName);

  // url params
  const courseId = props.routeProps.match.params.courseId;
  const topicId = props.routeProps.match.params.topicId;
  const examId = props.routeProps.match.params.examId;

  const { questionTypesData } = useExamsData(exam?.questions, courseId, examId);

  const { dataWithRefs } = useDataRefs(questionTypesData);

  useEffect(() => {
    fetchExam(examId)
      .then((res) => {
        setExamOnState(res.data);
        dispatch(setExam({ examId, examName: res.data.name }));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch, examId]);

  const renderAlert = () =>
    gt(exam?.qCounter, exam?.questions?.length) && (
      <Alert variant="danger">
        {
          <span>
            El <b>total de preguntas</b> debe ser <b>mayor</b> al número de{" "}
            <b>preguntas</b> por examen.
          </span>
        }
      </Alert>
    );

  return (
    <AdminLayout
      backBttn={`/admin/courses/edit/topics/${courseId}/${topicId}`}
      expanded
      leftBarActive="Cursos"
      topNavTitle={`${courseName} | ${topicName} | ${exam?.name ?? ""}`.trim()}
    >
      {renderAlert()}
      <AdminRow
        rowTitle="Nombre"
        value={exam?.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ExamNameForm,
            initialValue: exam?.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Dificultad"
        tooltip="La dificultad no puede cambiarse."
        value={getDifficultyNameInSpanish(exam?.difficulty)}
      />
      <AdminRow
        rowTitle="Duración"
        value={`${exam?.duration} minutos`}
        icon={{
          hoverText: "Editar duración",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ExamDurationForm,
            initialValue: exam?.duration,
          },
        }}
      />
      <AdminRow
        rowTitle="Preguntas"
        tooltip="Cantidad de preguntas que conforman este examen."
        value={`${exam?.qCounter} preguntas`}
        icon={{
          hoverText: "Editar cantidad de preguntas",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ExamQCounterForm,
            initialValue: exam?.duration,
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={exam?.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: ExamDescriptionForm,
            initialValue: exam?.description,
          },
        }}
      />
      <AdminRow
        rowTitle="Tipos de preguntas"
        tooltip="Lista desplazable."
        list={{
          accessor: "nameWithCounter",
          data: dataWithRefs,
          icon: {
            hoverText: "Nueva pregunta",
            svg: "add",
            modal: {
              Form: (item) => item.Form,
              size: "lg",
              title: (item) => item.name,
            },
          },
        }}
      />
      <AdminRow
        rowTitle="Total de preguntas"
        tooltip="Cantidad total de preguntas que hay disponibles para este examen."
        value={`${exam?.questions?.length ?? ""} preguntas`.trim()}
      />
      {(dataWithRefs || []).map((data, index) => (
        <AdminTable
          headers={data.table.headers}
          key={index}
          onDeleteFunc={data.table.onDeleteFunc}
          onEditForm={data.table.onEditForm}
          ref={data.ref}
          rowsAccessors={data.rows.accessors}
          rowsData={data.rows.data}
          sortDataBy="_id"
          title={data.name}
        />
      ))}
    </AdminLayout>
  );
};
