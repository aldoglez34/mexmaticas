import React, { useState, useEffect } from "react";
import { Badge, Button, Col, Image, Row, Spinner } from "react-bootstrap";
import { deleteMaterial, deleteTopic, fetchTopic } from "../../services";
import {
  AdminButton,
  AdminLayout,
  AdminModal,
  EditableRow,
  ImageFromFirebase,
} from "../../components";
import {
  AddPDF,
  AddVideo,
  DraggableMaterial,
  TopicDescriptionForm,
  TopicFreestyleTimerForm,
  TopicNameForm,
  TopicRewardForm,
  TopicSubjectForm,
} from "./components";
import { useDispatch, useSelector } from "react-redux";
import * as adminActions from "../../redux/actions/admin";
import { firebaseStorage } from "../../firebase/firebase";

export const AdminTopicDetailPage = React.memo((props) => {
  const dispatch = useDispatch();

  const courseName = useSelector((state) => state.admin.course.courseName);
  const reduxTopic = useSelector((state) => state.admin.topic);

  const [topic, setTopic] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const courseId = props.routeProps.match.params.courseId;
  const topicId = props.routeProps.match.params.topicId;

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

  const handleDeleteMaterialItem = (materialType, materialId, materialLink) => {
    deleteMaterial({
      courseId,
      materialId,
      topicId,
    })
      .then(() => {
        if (materialType === "video") {
          alert("Borrado con éxito.");
          window.location.reload();
        }

        if (materialType === "pdf") {
          const storageRef = firebaseStorage.ref();
          const fileRef = storageRef.child(materialLink);

          fileRef
            .delete()
            .then(() => {
              alert("El artículo seleccionado ha sido eliminado con éxito.");
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
  };

  const handleDeleteTopic = async () => {
    setIsDeleting(true);
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const optionsDropdown = [{ text: "Borrar Tema", fn: handleShowModal }];

  return (
    <AdminLayout
      backBttn={`/admin/courses/edit/${courseId}`}
      expanded
      leftBarActive="Cursos"
      optionsDropdown={optionsDropdown}
      topNavTitle={`${courseName} | ${topic?.name ?? ""}`.trim()}
    >
      <EditableRow
        {...{
          formInitialText: topic?.name,
          ModalFormComponent: TopicNameForm,
          modalLabel: "Nombre",
          rowTitle: "Nombre",
          value: topic?.name,
        }}
      />
      <EditableRow
        {...{
          formInitialText: topic?.subject,
          ModalFormComponent: TopicSubjectForm,
          modalLabel: "Materia",
          rowTitle: "Materia",
          value: topic?.subject,
        }}
      />
      <EditableRow
        {...{
          formInitialText: topic?.description,
          ModalFormComponent: TopicDescriptionForm,
          modalLabel: "Descripción",
          rowTitle: "Descripción",
          value: topic?.description,
        }}
      />
      <EditableRow
        {...{
          formInitialText: topic?.freestyle?.timer || 0,
          ModalFormComponent: TopicFreestyleTimerForm,
          modalLabel: "Modo Rápido",
          rowTitle: "Modo Rápido",
          value: `${topic?.freestyle?.timer} minutos`,
        }}
      />
      <EditableRow
        {...{
          formInitialText: topic?.name,
          ModalFormComponent: TopicRewardForm,
          modalLabel: "Recompensa",
          rowTitle: "Recompensa",
          value: `Medalla de ${topic?.name}`,
        }}
      />
      <ImageFromFirebase
        className="mb-3"
        height="100"
        path={topic?.reward?.link}
        width="70"
      />
      {/* material */}
      <Row>
        <Col>
          <span className="text-muted">
            Material <small>(lista reordenable)</small>
          </span>
          <DraggableMaterial
            {...{ courseId, handleDeleteMaterialItem, topicId }}
            material={(topic?.material || [])
              .sort((a, b) => a.materialOrderNumber - b.materialOrderNumber)
              .map((m) => ({
                _id: m._id,
                id: m.materialOrderNumber,
                link: m.link,
                name: m.name,
                type: m.type,
              }))}
          />
          <div className="mb-3">
            <AddVideo {...{ courseId, topicId }} />
            <AddPDF {...{ courseId, topicId }} />
          </div>
        </Col>
      </Row>
      {/* exams */}
      <Row>
        <Col>
          <span className="text-muted">Exámenes</span>
          <div className="d-flex flex-column mb-1">
            {(topic?.exams || [])
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((e) => {
                const path = `/admin/courses/edit/exam/${courseId}/${topicId}/${e._id}`;
                const badgeText = `${e.actualQCounter}/${e.qCounter}`;
                const variant =
                  e.actualQCounter >= e.qCounter ? "success" : "warning";
                return (
                  <span key={e._id}>
                    <strong style={{ color: "#0f5257" }}>
                      <Badge pill variant={variant} className="mr-1">
                        {badgeText}
                      </Badge>
                      {e.name}
                      <AdminButton
                        href={path}
                        icon={<i className="fas fa-arrow-alt-circle-right" />}
                      />
                    </strong>
                  </span>
                );
              })}
          </div>
        </Col>
      </Row>
      {/* delete topic modal */}
      <AdminModal
        handleClose={handleCloseModal}
        show={showModal}
        title="Borrar"
      >
        {isDeleting ? (
          <div className="text-center py-4">
            <p className="lead">Borrando...</p>
            <Spinner variant="danger" animation="border" role="status">
              <span className="sr-only">Borrando...</span>
            </Spinner>
          </div>
        ) : (
          <div className="text-center">
            <Image height="130" src="/images/trash.png" width="130" />
            <div className="lead text-center mt-2">{`¿Estás seguro que deseas borrar el tema: ${reduxTopic?.topicName}?`}</div>
            <div className="d-flex flex-row justify-content-center mt-4">
              <Button variant="dark" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="ml-2"
                onClick={handleDeleteTopic}
              >
                Borrar
                <i className="fas fa-trash-alt ml-2" />
              </Button>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
});

AdminTopicDetailPage.displayName = "AdminTopicDetailPage";
