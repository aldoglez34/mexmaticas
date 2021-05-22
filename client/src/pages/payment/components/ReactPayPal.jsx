import React from "react";
import { number, string } from "prop-types";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import PaypalExpressBtn from "react-paypal-express-checkout";

export const ReactPayPal = React.memo(({ courseId, coursePrice }) => {
  const student = useSelector((state) => state.student);

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

  const handleOnSuccess = (payment) => {
    // Congratulation, it came here means everything's fine!
    console.log("The payment was succeeded!", payment);
    addCourseToUser();
    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
  };

  const handleOnCancel = (data) => {
    // User pressed "cancel" or close Paypal's popup!
    console.log("The payment was cancelled!", data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
  };

  const handleOnError = (err) => {
    // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    console.log("Error!", err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    alert(
      "Ocurrió un error al efectuar tu pago. Ponte en contacto con el maestro."
    );
  };

  const env = "sandbox"; // you can set here to 'production' for production
  const currency = "MXN"; // you can set here to 'production' for production
  const style = {
    color: "gold",
    label: "pay",
    layout: "vertical",
    shape: "rect",
    tagline: false,
  };
  const locale = "es_MX";

  const client = {
    sandbox:
      "AeGi4T7oe3UXVh58-BgT0mxlROIpMthTNn4rF0i_qbGnQy2xnERH4nMwEc5pSUB9zu8Y7ptQEkD5eB4o",
    production: "YOUR-PRODUCTION-APP-ID",
  };
  // In order to get production's app-ID, you will have to send your app to Paypal for approval first
  // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
  //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
  // For production app-ID:
  //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

  // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
  return (
    <PaypalExpressBtn
      client={client}
      currency={currency}
      env={env}
      locale={locale}
      onCancel={handleOnCancel}
      onError={handleOnError}
      onSuccess={handleOnSuccess}
      shipping={1}
      style={style}
      total={coursePrice}
    />
  );
});

ReactPayPal.propTypes = {
  courseId: string.isRequired,
  coursePrice: number.isRequired,
};

ReactPayPal.displayName = "PayPalButtonComponent";
