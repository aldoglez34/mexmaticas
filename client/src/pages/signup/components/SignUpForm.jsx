import React from "react";
import { Formik, ErrorMessage } from "formik";
import { Button, Col, Form } from "react-bootstrap";
import { firebaseAuth } from "../../../firebase/firebase";
import * as yup from "yup";
import API from "../../../utils/API";
import { useSelector, useDispatch } from "react-redux";
import { loginStudent } from "../../../redux/actions/student";

export const SignUpForm = () => {
  const dispatch = useDispatch();

  const purchase = useSelector((state) => state.purchase);

  const yupSchema = yup.object({
    email: yup
      .string()
      .email("Formato de email incorrecto")
      .required("Requerido"),
    name: yup
      .string()
      .min(2, "Debe ser más largo que 2 letras")
      .matches(
        /^[a-zA-Z-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ ]+$/,
        "Sólo letras"
      )
      .required("Requerido"),
    firstSurname: yup
      .string()
      .min(2, "Debe ser más largo que 2 letras")
      .matches(
        /^[a-zA-Z-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ ]+$/,
        "Sólo letras"
      )
      .required("Requerido"),
    secondSurname: yup
      .string()
      .min(2, "Debe ser más largo que 2 letras")
      .matches(
        /^[a-zA-Z-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ ]+$/,
        "Sólo letras"
      )
      .required("Requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        name: "",
        firstSurname: "",
        secondSurname: "",
        password: "",
      }}
      validationSchema={yupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          // create user in firebase
          const fbRes = await firebaseAuth.createUserWithEmailAndPassword(
            values.email,
            values.password
          );

          // edit user display name to student
          await fbRes.user.updateProfile({ displayName: "Student" });

          // push new user to database
          const newUser = await API.registerNewStudent({
            firebaseUID: fbRes.user.uid,
            name: values.name,
            firstSurname: values.firstSurname,
            secondSurname: values.secondSurname,
            email: values.email,
          }).then((res) => res.data);

          // log user's data to redux
          const newStudentObj = {
            _id: newUser._id,
            email: newUser.email,
            firstSurname: newUser.firstSurname,
            name: newUser.name,
            secondSurname: newUser.secondSurname,
          };

          dispatch(loginStudent(newStudentObj));

          // send the user to either the dashboard or the payment screen
          // depending on wether user has a purchase pending
          if (!purchase) window.location.href = "/dashboard";
          if (purchase)
            window.location.href = `/payment/${purchase.school}/${purchase.courseId}`;
        } catch (err) {
          console.log("err", err);
          alert(
            "Ha ocurrido un error, por favor verifica tus datos.\nEs posible que tu cuenta de correo ya exista en MeXmáticas."
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
                maxLength="50"
                placeholder="ejemplo@ejemplo.com"
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
                <strong>Nombre(s)</strong>
                <strong className="ml-1 text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="50"
                // placeholder="Apellido paterno"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.name && !errors.name}
              />
              <ErrorMessage
                className="text-danger"
                name="name"
                component="div"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md={6}>
              <Form.Label>
                <strong>Apellido Paterno</strong>
                <strong className="ml-1 text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="50"
                // placeholder="Apellido paterno"
                type="text"
                name="firstSurname"
                value={values.firstSurname}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.firstSurname && !errors.firstSurname}
              />
              <ErrorMessage
                className="text-danger"
                name="firstSurname"
                component="div"
              />
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label>
                <strong>Apellido Materno</strong>
                <strong className="ml-1 text-danger" title="Requerido">
                  *
                </strong>
              </Form.Label>
              <Form.Control
                maxLength="50"
                // placeholder="Apellido paterno"
                type="text"
                name="secondSurname"
                value={values.secondSurname}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.secondSurname && !errors.secondSurname}
              />
              <ErrorMessage
                className="text-danger"
                name="secondSurname"
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
                <br />
                <small className="text-muted">
                  Las contraseñas deben tener por lo menos 6 caracteres
                </small>
              </Form.Label>
              <Form.Control
                maxLength="25"
                // placeholder="Apellido paterno"
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
            className="shadow-sm mt-3 genericButton"
            type="submit"
            disabled={isSubmitting}
          >
            Registrarme
          </Button>
        </Form>
      )}
    </Formik>
  );
};
