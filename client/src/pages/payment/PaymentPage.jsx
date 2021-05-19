import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ScrollButton } from "../../components/scrollbutton/ScrollButton";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { BackButton } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPurchase } from "../../redux/actions/purchase";
import TeacherAPI from "../../utils/TeacherAPI";
import { PayPalButtonComponent } from "./components/PayPalButtonComponent";

export const PaymentPage = React.memo((props) => {
  const [course, setCourse] = useState();
  const [isPaying, setIsPaying] = useState(false);

  const dispatch = useDispatch();

  const { courseId, school } = props.routeProps.match.params;

  const purchase = useSelector((state) => state.purchase);

  useEffect(() => {
    if (purchase) dispatch(clearPurchase());

    TeacherAPI.t_fetchOneCourse(courseId).then((res) => setCourse(res.data));
  }, [courseId, dispatch, purchase]);

  return (
    <Layout backgroundColor="white">
      <Container
        style={{
          paddingTop: "40px",
          marginBottom: "80px",
        }}
      >
        <BackButton to={`/courses/${school}`} />
        <Container>
          <Row>
            <Col md={{ span: 5, offset: 4 }} className="mt-0 mt-md-4">
              <Image className="mb-4" src="/images/paypal.png" fluid />
              <div className="mb-3">
                <span className="lead">Curso:</span>
                <h2>{course?.name}</h2>
              </div>
              <div className="mb-4">
                <span className="lead">Precio:</span>
                <h1>{`$${course?.price}`}</h1>
              </div>
              <div>
                {!isPaying ? (
                  <Button
                    block
                    className="mt-2 shadow-sm"
                    size="lg"
                    onClick={() => setIsPaying(true)}
                    variant="primary"
                  >
                    Pagar con PayPal
                  </Button>
                ) : (
                  <PayPalButtonComponent />
                )}
              </div>
              <small className="d-block mt-4">
                *Por el momento sólo contamos con pagos con PayPal.
              </small>
              <small className="d-block  mb-2">
                *Contacta al administrador para conocer más formas de pago.
              </small>
            </Col>
          </Row>
        </Container>
      </Container>
      <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
    </Layout>
  );
});
