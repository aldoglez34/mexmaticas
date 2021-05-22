import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ScrollButton } from "../../components/scrollbutton/ScrollButton";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { BackButton } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPurchase } from "../../redux/actions/purchase";
import TeacherAPI from "../../utils/TeacherAPI";
import { PayPalButtonComponent } from "./components/PayPalButtonComponent";
import { ReactPayPal } from "./components/ReactPayPal";

export const PaymentPage = React.memo((props) => {
  const [course, setCourse] = useState();

  const dispatch = useDispatch();

  const { courseId, school } = props.routeProps.match.params;

  const purchase = useSelector((state) => state.purchase);

  useEffect(() => {
    if (purchase) dispatch(clearPurchase());

    TeacherAPI.t_fetchOneCourse(courseId).then((res) => setCourse(res.data));
  }, [courseId, dispatch, purchase]);

  return (
    <Layout backgroundColor="white">
      {course ? (
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
                <Image className="mb-4" src="/images/paypal.png" fluid />
                <div className="mb-3">
                  <span className="lead">Curso:</span>
                  <h2>{course?.name}</h2>
                </div>
                <div className="mb-4">
                  <span className="lead">Precio:</span>
                  <h2>{`$${course?.price} MXN`}</h2>
                </div>
                <PayPalButtonComponent
                  courseId={courseId}
                  coursePrice={course.price}
                />
                <h3>¿Necesitas ayuda?</h3>
                <p>
                  Para soliticar ayuda, incluyendo pagos en efectivo, contacta
                  al M.C. Luis Rodrigo López Utrera al 229 909 1675.
                </p>
                <h3>¿Por qué PayPal?</h3>
                <p>PayPal es más cómodo, más seguro y más protegido.</p>
                {/* <ReactPayPal courseId={courseId} coursePrice={course.price} /> */}
              </Col>
            </Row>
          </Container>
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
