import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteMaterial,
  deleteTopic,
  fetchTopic,
  updateMaterialOrder,
} from "../../services";
import { AdminLayout, AdminRow, ImageFromFirebase } from "../../components";
import {
  AddPDFModal,
  AddVideoModal,
  TopicDescriptionForm,
  TopicFreestyleTimerForm,
  TopicNameForm,
  TopicRewardForm,
  TopicSubjectForm,
} from "./components";
import { useDispatch, useSelector } from "react-redux";
import * as adminActions from "../../redux/actions/admin";
import { firebaseStorage } from "../../firebase/firebase";
import { AdminDeleteModal } from "../../components/modals/AdminDeleteModal";
import { isEmpty } from "lodash";
import { askUserToConfirm } from "../../utils/helpers";

export const AdminTopicDetailPage = React.memo((props) => {
  const [topic, setTopic] = useState();
  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [showAddPDFModal, setShowAddPDFModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  const courseId = props.routeProps.match.params.courseId;
  const topicId = props.routeProps.match.params.topicId;

  const dispatch = useDispatch();
  const courseName = useSelector((state) => state.admin.course.courseName);
  const reduxTopic = useSelector((state) => state.admin.topic);

  useEffect(() => {
    fetchTopic(courseId, topicId)
      .then((res) => {
        setTopic(res.data);
        dispatch(adminActions.setTopic({ topicId, topicName: res.data.name }));
      })
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [courseId, dispatch, topicId]);

  const handleDeleteMaterialItem = useCallback(
    (item) => {
      const { type: materialType, _id: materialId, link: materialLink } = item;

      deleteMaterial({
        courseId,
        materialId,
        topicId,
      })
        .then(() => {
          if (materialType === "video") {
            alert("Borrado con éxito.");
            window.location.reload();
            return;
          }

          if (materialType === "pdf") {
            const storageRef = firebaseStorage.ref();
            const fileRef = storageRef.child(materialLink);

            fileRef
              .delete()
              .then(() => {
                alert("Borrado con éxito.");
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
                alert("Ocurrió un error, vuelve a intentarlo.");
              });
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Ocurrió un error, vuelve a intentarlo.");
        });
    },
    [courseId, topicId]
  );

  const handleDeleteTopic = async () => {
    try {
      // delete topic from database
      const deleteRes = await deleteTopic({ courseId, topicId });

      if (deleteRes.status === 200)
        window.location.href = `/admin/courses/edit/${courseId}`;
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error al intentar borrar el tema.");
    }
  };

  const optionsDropdown = [
    { text: "Agregar PDF", fn: () => setShowAddPDFModal(true) },
    { text: "Agregar video", fn: () => setShowAddVideoModal(true) },
    "divider",
    { text: "Borrar Tema", fn: () => setShowDeleteTopicModal(true) },
  ];

  const sortedMaterial = useMemo(
    () =>
      (topic?.material || [])
        .sort((a, b) => a.materialOrderNumber - b.materialOrderNumber)
        .map((m) => ({
          _id: m._id,
          id: m.materialOrderNumber,
          link: m.link,
          name: m.name,
          type: m.type,
          nameWithType: `[${m.type}] ${m.name}`,
        })),
    [topic]
  );

  const sortedExams = useMemo(
    () =>
      (topic?.exams || [])
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((e) => ({
          ...e,
          nameWithQCounter: `[${e.actualQCounter}/${e.qCounter}] ${e.name}`,
        })),
    [topic]
  );

  const handleOnChangeDraggableMaterial = async (data) => {
    const changes = data.reduce((acc, cv, idx) => {
      if (cv.id !== idx + 1)
        acc.push({
          _id: cv._id,
          name: cv.name,
          lastId: cv.id,
          newOrderNumber: idx + 1,
        });
      return acc;
    }, []);

    if (isEmpty(changes)) return;

    try {
      await updateMaterialOrder({ courseId, newList: changes, topicId });
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error en el servidor");
    }
  };

  return (
    <AdminLayout
      backBttn={`/admin/courses/edit/${courseId}`}
      expanded
      leftBarActive="Cursos"
      optionsDropdown={optionsDropdown}
      topNavTitle={`${courseName} | ${topic?.name ?? ""}`.trim()}
    >
      <AdminDeleteModal
        handleCloseModal={() => setShowDeleteTopicModal(false)}
        handleDelete={handleDeleteTopic}
        modalText={`¿Estás seguro que deseas borrar el tema: ${reduxTopic?.topicName}?`}
        show={showDeleteTopicModal}
      />
      <AddPDFModal
        courseId={courseId}
        handleCloseModal={() => setShowAddPDFModal(false)}
        show={showAddPDFModal}
        topicId={topicId}
      />
      <AddVideoModal
        courseId={courseId}
        handleCloseModal={() => setShowAddVideoModal(false)}
        show={showAddVideoModal}
        topicId={topicId}
      />
      <AdminRow
        rowTitle="Nombre"
        value={topic?.name}
        icon={{
          hoverText: "Editar nombre",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: TopicNameForm,
            initialValue: topic?.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Materia"
        value={topic?.subject}
        icon={{
          hoverText: "Editar materia",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: TopicSubjectForm,
            initialValue: topic?.subject,
          },
        }}
      />
      <AdminRow
        rowTitle="Descripción"
        value={topic?.description}
        icon={{
          hoverText: "Editar descripción",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: TopicDescriptionForm,
            initialValue: topic?.description,
          },
        }}
      />
      <AdminRow
        rowTitle="Modo Rápido"
        value={`${topic?.freestyle?.timer} minutos`}
        icon={{
          hoverText: "Editar modo rápido",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: TopicFreestyleTimerForm,
            initialValue: topic?.freestyle?.timer || 0,
          },
        }}
      />
      <AdminRow
        rowTitle="Recompensa"
        value={
          <div>
            <span>{`Medalla de ${topic?.name}`}</span>
            <ImageFromFirebase
              className="mt-2 d-block"
              height="100"
              path={topic?.reward?.link}
              width="70"
            />
          </div>
        }
        icon={{
          hoverText: "Editar recompensa",
          svg: "edit",
          modal: {
            title: "Editar",
            Form: TopicRewardForm,
            initialValue: topic?.name,
          },
        }}
      />
      <AdminRow
        rowTitle="Exámenes"
        list={{
          accessor: "nameWithQCounter",
          data: sortedExams,
          icon: {
            getLink: (item) =>
              `/admin/courses/edit/exam/${courseId}/${topicId}/${item._id}`,
            hoverText: "Ir a examen",
            svg: "anchor",
          },
        }}
      />
      <AdminRow
        rowTitle="Material"
        tooltip="Lista reordenable"
        list={{
          accessor: "nameWithType",
          data: sortedMaterial,
          onOrderChange: handleOnChangeDraggableMaterial,
          icon: {
            hoverText: "Borrar material",
            onClick: (item) =>
              askUserToConfirm(
                "¿Estás seguro que quieres eliminar este material?",
                () => handleDeleteMaterialItem(item)
              ),
            svg: "delete",
          },
        }}
      />
    </AdminLayout>
  );
});

AdminTopicDetailPage.displayName = "AdminTopicDetailPage";
