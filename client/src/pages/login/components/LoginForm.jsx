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
              </Form.Label>
              <Form.Control
                maxLength="50"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.email && !errors.email}
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
            className="shadow-sm mt-4 genericButton"
            type="submit"
            disabled={isSubmitting}
          >
            Entrar
          </Button>
        </Form>
      )}
    </Formik>
  );
};
