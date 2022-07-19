import React, { useEffect, useState } from "react";
import { StudentLayout } from "../../components";
import { Col, Container, Image, Modal, Row, Spinner } from "react-bootstrap";
import { AdminSpinner } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPurchase } from "../../redux/actions/purchase";
import { fetchOneCourse } from "../../services";
import { buyCourse } from "../../services";
import { PayPalButtonComponent } from "./components/PayPalButtonComponent";

export const PaymentPage = React.memo((props) => {
  const [course, setCourse] = useState();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const strDBError =
    "Ocurrió un error con este curso, ponte en contacto con el maestro.";

  const strPaypalError =
    "Ocurrió un error con tu cuenta de PayPal, no se pudo efectuar el pago. Por favor revisa tus datos.";

  const dispatch = useDispatch();

  const { courseId, school } = props.routeProps.match.params;

  const purchase = useSelector((state) => state.purchase);
  const student = useSelector((state) => state.student);

  useEffect(() => {
    if (purchase) dispatch(clearPurchase());

    fetchOneCourse(courseId).then((res) => setCourse(res.data));
  }, [courseId, dispatch, purchase]);

  const catchError = (error) => {
    console.log("@catchError", error);
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

    // adding course to user if everything went well
    try {
      await buyCourse({ courseId, studentId: student._id });
      setTimeout(() => {
        setShowPaymentModal(false);
        return (window.location.href = "/");
      }, 10000);
    } catch (err) {
      console.log(err);
      alert(strDBError);
    }
  };

  return (
    <StudentLayout isContainer={false}>
      {course ? (
        <Container style={{ marginBottom: "80px" }}>
          <Container>
            <Row>
              <Col md={{ span: 5, offset: 4 }} className="p-0">
                <div className="text-center">
                  <Image className="mb-4 w-75" src="/images/paypal.png" fluid />
                </div>
                <p>{`Al comprar este curso, recibirás acceso a todo el material que contienen sus temas. Se hará un cargo a tu cuenta de PayPal por $${course.price} MXN.`}</p>
                <div className="mb-3">
                  <strong>Nombre:</strong>
                  <p className="lead">{course.name}</p>
                </div>
                <div className="mb-4">
                  <strong>Precio:</strong>
                  <p className="lead">{`$${course.price} MXN`}</p>
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
          <Modal show={showPaymentModal} size="sm" centered>
            <Modal.Body>
              <strong className="d-block">Realizando pago...</strong>
              <strong className="d-block">Asignando curso...</strong>
              <strong className="d-block">Asignando temas...</strong>
              <strong className="d-block mb-3">Asignando ejercicios...</strong>
            </Modal.Body>
            <div className="mb-2 pb-4">
              <AdminSpinner />
            </div>
          </Modal>
        </Container>
      ) : (
        <div className="my-2 text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </StudentLayout>
  );
});

PaymentPage.displayName = "PaymentPage";
