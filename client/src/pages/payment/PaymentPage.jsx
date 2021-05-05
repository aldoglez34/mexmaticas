import React, { useEffect } from "react";
import { Layout } from "../../components/Layout";
import { ScrollButton } from "../../components/scrollbutton/ScrollButton";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import API from "../../utils/API";
import { Formik, ErrorMessage } from "formik";
import { BackButton } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPurchase } from "../../redux/actions/purchase";
import * as yup from "yup";
import cn from "classnames";

import styles from "./paymentpage.module.scss";

export const PaymentPage = React.memo((props) => {
  const dispatch = useDispatch();

  const { courseId, school } = props.routeProps.match.params;

  const student = useSelector((state) => state.student);
  const purchase = useSelector((state) => state.purchase);

  // TODO: add required to all fields
  const yupschema = yup.object({
    name: yup.string().min(3, "Nombre demasiado corto"),
    number: yup.number(),
  });

  useEffect(() => {
    if (purchase) dispatch(clearPurchase());
  }, [dispatch, purchase]);

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
            <Col md={{ span: 6, offset: 3 }}>
              <h3>Estás comprando:</h3>
              <h5 className="mb-2">{courseId}</h5>
              <div className="mb-2">
                <i className={cn("fab", "fa-cc-visa", styles.cardIcon)} />
                <i
                  className={cn(
                    "fab",
                    "fa-cc-mastercard",
                    "ml-1",
                    styles.cardIcon
                  )}
                />
              </div>
              <Formik
                initialValues={{
                  name: "",
                  number: "",
                }}
                validationSchema={yupschema}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  console.log(values);

                  API.buyCourse({ courseId, studentId: student._id })
                    .then(() => {
                      alert("Has comprado el curso satisfactoriamente.");
                      window.location.href = "/";
                    })
                    .catch((err) => {
                      console.log(err);
                      alert("Ocurrió un error, vuelve a intentarlo.");
                    });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    {/* name */}
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label>Titular de tarjeta</Form.Label>
                        <Form.Control
                          maxLength="100"
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.name && !errors.name}
                          isInvalid={touched.name && !!errors.name}
                        />
                        <ErrorMessage
                          className="text-danger"
                          name="name"
                          component="div"
                        />
                      </Form.Group>
                    </Form.Row>
                    {/* creadit card number */}
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label>Número de tarjeta</Form.Label>
                        <Form.Control
                          maxLength="100"
                          type="number"
                          name="number"
                          value={values.number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.number && !errors.number}
                          isInvalid={touched.number && !!errors.number}
                        />
                        <ErrorMessage
                          className="text-danger"
                          name="number"
                          component="div"
                        />
                      </Form.Group>
                    </Form.Row>
                    {/* buttons */}
                    <Form.Group>
                      <Button
                        variant="danger"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Pagar
                      </Button>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
      </Container>
      <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
    </Layout>
  );
});
