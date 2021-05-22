import React from "react";
import ReactDOM from "react-dom";
import { number, string } from "prop-types";
import API from "../../../utils/API";
import { useSelector } from "react-redux";

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

export const PayPalButtonComponent = React.memo(({ courseId, coursePrice }) => {
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

  const handleCreateOrder = (data, actions) => {
    console.log("creating order");
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: String(coursePrice),
            currency_code: "MXN",
          },
          payee: {
            email_address: student.email,
          },
        },
      ],
    });
  };

  const handleOnApprove = (data, actions) => {
    console.log("approved!", data);
    return actions.order.capture().then((res) => {
      console.log("after payment, response:", res);
      addCourseToUser();
    });
  };

  const hadnleOnError = (err) => {
    console.log("paypal error:", err);
    return alert(
      "Ocurrió un error al efectuar tu pago. Ponte en contacto con el maestro."
    );
  };

  return (
    <PayPalButton
      createOrder={(data, actions) => handleCreateOrder(data, actions)}
      onApprove={(data, actions) => handleOnApprove(data, actions)}
      onError={(err) => hadnleOnError(err)}
      style={{
        color: "gold",
        label: "pay",
        layout: "vertical",
        shape: "rect",
        tagline: false,
      }}
    />
  );
});

PayPalButtonComponent.propTypes = {
  courseId: string.isRequired,
  coursePrice: number.isRequired,
};

PayPalButtonComponent.displayName = "PayPalButtonComponent";
