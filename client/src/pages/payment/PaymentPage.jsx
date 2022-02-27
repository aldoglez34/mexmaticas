import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ScrollButton } from "../../components/scrollbutton/ScrollButton";
import { Col, Container, Image, Modal, Row, Spinner } from "react-bootstrap";
import { BackButton } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPurchase } from "../../redux/actions/purchase";
import TeacherAPI from "../../utils/TeacherAPI";
import API from "../../utils/API";
import { PayPalButtonComponent } from "./components/PayPalButtonComponent";
import { useHistory } from "react-router-dom";
import { AdminSpinner } from "../../adminpages/components";

export const PaymentPage = React.memo((props) => {
  const [course, setCourse] = useState();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const strDBError =
    "Ocurrió un error con este curso, ponte en contacto con el maestro.";

  const strPaypalError =
    "Ocurrió un error con tu cuenta de PayPal, no se pudo efectuar el pago. Por favor revisa tus datos.";

  const { goBack } = useHistory();

  const dispatch = useDispatch();

  const { courseId, school } = props.routeProps.match.params;

  const purchase = useSelector((state) => state.purchase);
  const student = useSelector((state) => state.student);

  useEffect(() => {
    if (purchase) dispatch(clearPurchase());

    TeacherAPI.t_fetchOneCourse(courseId).then((res) => setCourse(res.data));
  }, [courseId, dispatch, purchase]);

  // take the user back if the course doesn't have a paypalId
  useEffect(() => {
    if (course && !course.paypalId) {
      alert(strDBError);
      return goBack();
    }
  }, [course, goBack]);

  const catchError = (error) => {
    console.log("@onError", error);
    alert(strPaypalError);
    window.location.href = `/courses/${school}`;
  };

  const onError = (error) => {
    console.log("@onError", error);
    alert(strPaypalError);
    window.location.href = `/courses/${school}`;
  };

  const onSuccess = async (details, data) => {
    setShowPaymentModal(true);
    console.log("@onSuccess");
    console.log("payment approved", { details, data });

    // adding course to user if everything went well
    try {
      await API.buyCourse({ courseId, studentId: student._id });
      setTimeout(() => (window.location.href = "/"), 10000);
    } catch (err) {
      console.log(err);
      alert(strDBError);
    }
  };

  return (
    <Layout backgroundColor="white">
      {course && course.paypalId ? (
        <Container
          style={{
            paddingTop: "40px",
            marginBottom: "80px",
          }}
        >
          <BackButton to={`/courses/${school}`} />
          <Container>
            <Row>
              <Col md={{ span: 5, offset: 4 }} className="p-0">
                <Image className="mb-4 w-50" src="/images/paypal.png" fluid />
                <p>{`Al comprar este curso, recibirás acceso a todo el material que contienen sus temas. Se hará un cargo a tu cuenta de PayPal por $${course.price} MXN.`}</p>
                <div className="mb-3">
                  <span>Nombre:</span>
                  <h2>{course.name}</h2>
                </div>
                <div className="mb-4">
                  <span>Precio:</span>
                  <h2>{`$${course.price} MXN`}</h2>
                </div>
                <PayPalButtonComponent
                  {...{
                    amount: course.price,
                    catchError,
                    currency: "MXN",
                    locale: "es_MX",
                    onError,
                    onSuccess,
                  }}
                />
              </Col>
            </Row>
          </Container>
          {/* modal */}
          <Modal show={showPaymentModal} size="sm">
            <Modal.Body>
              <strong>Efectuando pago y asignando curso...</strong>
            </Modal.Body>
            <AdminSpinner />
            <br />
          </Modal>
        </Container>
      ) : (
        <div className="my-2 text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
      <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
    </Layout>
  );
});

PaymentPage.displayName = "PaymentPage";
