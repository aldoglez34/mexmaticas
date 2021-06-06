import React, { useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import { Form, Col, Button } from "react-bootstrap";
import { firebaseAuth } from "../../../firebase/firebase";
import fbApp from "firebase/app";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { loginStudent } from "../../../redux/actions/student";
import API from "../../../utils/API";

export const LoginForm = () => {
  const dispatch = useDispatch();

  const purchase = useSelector((state) => state.purchase);
  const student = useSelector((state) => state.student);

  useEffect(() => {
    if (student) window.location.href = "/dashboard";
  }, [student]);

  const yupSchema = yup.object({
    email: yup
      .string()
      .email("Formato de email incorrecto")
      .required("Requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={yupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          // set persistence in firebase
          await firebaseAuth.setPersistence(fbApp.auth.Auth.Persistence.LOCAL);

          // sign in user in firebase
          const fbUser = await firebaseAuth.signInWithEmailAndPassword(
            values.email,
            values.password
          );

          // fetch user info from database
          const dbStudent = await API.fetchStudentByUID(fbUser.user.uid).then(
            (res) => res.data
          );

          // if there's a purchase pending, redirect user to payment page
          if (purchase)
            window.location.href = `/payment/${purchase.school}/${purchase.courseId}`;

          // if not then send user to dashboard
          dispatch(loginStudent(dbStudent));
        } catch (err) {
          console.log("err", err);
          alert(
            "Ha ocurrido un error, por favor verifica que tus datos sean correctos."
          );
          firebaseAuth.signOut();
          setSubmitting(false);
        }
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
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                <strong>Correo</strong>
                <strong className="ml-1 text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                isValid={touched.email && !errors.email}
                maxLength="50"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="ejemplo@email.com"
                type="email"
                value={values.email}
              />
              <ErrorMessage
                className="text-danger"
                name="email"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>
                <strong>Contraseña</strong>
                <strong className="ml-1 text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="25"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.password && !errors.password}
              />
              <ErrorMessage
                className="text-danger"
                name="password"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          <Button
            className="shadow-sm mt-2 genericButton"
            disabled={isSubmitting}
            size="lg"
            type="submit"
            block
          >
            Entrar
          </Button>
          <div className="text-right mt-2">
            <a className="text-success" href="/">
              <small>¿Olvidaste tu contraseña?</small>
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
};
