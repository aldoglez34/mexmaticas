import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ScrollButton } from "../../components/scrollbutton/ScrollButton";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { BackButton } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPurchase } from "../../redux/actions/purchase";
import TeacherAPI from "../../utils/TeacherAPI";
import API from "../../utils/API";
import { PayPalButtonComponent } from "./components/PayPalButtonComponent";
import { useHistory } from "react-router-dom";

export const PaymentPage = React.memo((props) => {
  const [course, setCourse] = useState();

  const { goBack } = useHistory();

  const dispatch = useDispatch();

  const { courseId, school } = props.routeProps.match.params;

  const purchase = useSelector((state) => state.purchase);
  const student = useSelector((state) => state.student);

  console.log(course);

  useEffect(() => {
    if (purchase) dispatch(clearPurchase());

    TeacherAPI.t_fetchOneCourse(courseId).then((res) => setCourse(res.data));
  }, [courseId, dispatch, purchase]);

  // take the user back if the course doesn't have a paypalId
  useEffect(() => {
    if (course && !course.paypalId) return goBack();
  }, [course, goBack]);

  const addCourseToUser = async () => {
    try {
      await API.buyCourse({ courseId, studentId: student._id });
      alert("Has comprado el curso satisfactoriamente.");
      window.location.href = "/";
    } catch (err) {
      console.log(err);
      alert(
        "Ocurrió un error con la aplicación, ponte en contacto con el maestro."
      );
    }
  };

  const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
      plan_id: course.paypalId,
    });
  };
  const paypalOnError = (err) => {
    console.log("Error");
    alert(
      "Ocurrió un error con la aplicación, ponte en contacto con el maestro."
    );
  };
  const paypalOnApprove = (data, detail) => {
    console.log({ data });
    console.log({ detail });
    addCourseToUser();
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
                <p>{`Al comprar este curso, recibirás acceso a todo el material que contienen sus temas. Se cargará una cantidad mensual de $${course.price} a tu cuenta.`}</p>
                <Image className="mb-4" src="/images/paypal.png" fluid />
                <div className="mb-3">
                  <span className="lead">Curso:</span>
                  <h2>{course.name}</h2>
                </div>
                <div className="mb-4">
                  <span className="lead">Precio:</span>
                  <h2>{`$${course.price} MXN`}</h2>
                </div>
                <PayPalButtonComponent
                  amount={course.price}
                  catchError={paypalOnError}
                  createSubscription={paypalSubscribe}
                  currency="MXN"
                  locale="es_MX"
                  onApprove={paypalOnApprove}
                  onCancel={paypalOnError}
                  onError={paypalOnError}
                />
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
