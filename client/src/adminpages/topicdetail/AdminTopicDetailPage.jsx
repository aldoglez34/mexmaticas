import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import TeacherAPI from "../../utils/TeacherAPI";
import {
  AdminLayout,
  AdminModal,
  AdminPrimaryButton,
  AdminSpinner,
  ImageFromFirebase,
} from "../components";
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
    if (!topic)
      TeacherAPI.t_fetchTopic(courseId, topicId)
        .then((res) => {
          const topicName = res.data.name;
          dispatch(adminActions.setTopic({ topicId, topicName }));
          dispatch(adminActions.setTitle(`${courseName} | ${topicName}`));
          setTopic(res.data);
        })
        .catch((err) => {
          console.log(err);
          alert("Ocurrió un error, vuelve a intentarlo.");
        });
  }, [courseId, courseName, dispatch, topic, topicId]);

  const handleDeleteMaterialItem = (materialType, materialId, materialLink) => {
    TeacherAPI.t_deleteMaterial({
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
      const deleteRes = await TeacherAPI.t_deleteTopic({ courseId, topicId });

      if (deleteRes.status === 200)
        window.location.href = `/admin/courses/edit/${courseId}`;
    } catch (err) {
      console.log(err);
      alert("Ocurrió un error al intentar borrar el tema.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const optionsDropdown = [{ text: "Borrar tema", fn: handleShowModal }];

  return topic ? (
    <AdminLayout
      leftBarActive="Cursos"
      backBttn={`/admin/courses/edit/${courseId}`}
      optionsDropdown={optionsDropdown}
    >
      <Container fluid>
        {/* topic name */}
        <Row>
          <Col>
            <span className="text-muted">Nombre</span>
            <h1>
              {topic.name}
              <AdminModal
                Form={TopicNameForm}
                formInitialText={topic.name}
                formLabel="Nombre"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h1>
          </Col>
        </Row>
        {/* subject */}
        <Row>
          <Col>
            <span className="text-muted">Materia</span>
            <h2>
              {topic.subject}
              <AdminModal
                Form={TopicSubjectForm}
                formInitialText={topic.subject}
                formLabel="Materia"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h2>
          </Col>
        </Row>
        {/* description */}
        <Row>
          <Col>
            <span className="text-muted">Descripción</span>
            <h5>
              {topic.description}
              <AdminModal
                Form={TopicDescriptionForm}
                formInitialText={topic.description}
                formLabel="Descripción"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h5>
          </Col>
        </Row>
        {/* freestyle */}
        <Row>
          <Col>
            <span className="text-muted">Modo rápido</span>
            <h5>
              {topic.freestyle.timer}{" "}
              {topic.freestyle.timer === 1 ? " minuto" : " minutos"}
              <AdminModal
                Form={TopicFreestyleTimerForm}
                formInitialText={topic.freestyle.timer}
                formLabel="Modo rápido"
                icon={<i className="fas fa-pen-alt" />}
              />
            </h5>
          </Col>
        </Row>
        {/* reward */}
        <Row>
          <Col>
            <span className="text-muted">Recompensa</span>
            <div className="d-flex">
              <h5>
                {`Medalla de ${topic.name}`}
                <AdminModal
                  Form={TopicRewardForm}
                  formLabel="Medalla"
                  icon={<i className="fas fa-pen-alt" />}
                />
              </h5>
            </div>
            <ImageFromFirebase
              className="mb-3"
              height="100"
              path={topic.reward.link}
              width="70"
            />
          </Col>
        </Row>
        {/* material */}
        <Row>
          <Col>
            <span className="text-muted">
              Material <small>(lista reordenable)</small>
            </span>
            <DraggableMaterial
              {...{ courseId, handleDeleteMaterialItem, topicId }}
              material={topic.material
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
              {topic.exams
                .sort((a, b) => a.examOrderNumber - b.examOrderNumber)
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
                        <AdminPrimaryButton
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
      </Container>
      {/* delete topic modal */}
      <Modal centered onHide={handleCloseModal} show={showModal}>
        <Modal.Body className="bg-light rounded shadow text-center py-4">
          {isDeleting ? (
            <div className="py-4">
              <strong className="mb-2">Borrando...</strong>
              <br />
              <br />
              <Spinner variant="danger" animation="border" role="status">
                <span className="sr-only">Borrando...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <Image
                className="mb-3"
                height="130"
                src="/images/trash.png"
                width="130"
              />
              <div className="lead text-center mt-2">{`¿Estás seguro que deseas borrar el tema: ${reduxTopic.topicName}?`}</div>
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
            </>
          )}
        </Modal.Body>
      </Modal>
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
});

AdminTopicDetailPage.displayName = "AdminTopicDetailPage";
