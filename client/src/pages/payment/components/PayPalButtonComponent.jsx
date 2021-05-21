import React from "react";
import ReactDOM from "react-dom";
import { number, string } from "prop-types";
import API from "../../../utils/API";
import { useSelector } from "react-redux";

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

export const PayPalButtonComponent = React.memo(({ courseId, price }) => {
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

  const createOrder = (data, actions) => {
    console.log("creating order...", data);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: String(price),
            currency_code: "MXN",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    console.log("data on approve:", data);
    return actions.order.capture().then((res) => {
      console.log("after payment, response:", res);
      addCourseToUser();
    });
  };

  const onError = (err) => {
    console.log("paypal error:", err);
    return alert("Ocurrió un error al efectuar tu pago.");
  };

  return (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      onError={(err) => onError(err)}
    />
  );
});

PayPalButtonComponent.propTypes = {
  courseId: string.isRequired,
  price: number.isRequired,
};

PayPalButtonComponent.displayName = "PayPalButtonComponent";
