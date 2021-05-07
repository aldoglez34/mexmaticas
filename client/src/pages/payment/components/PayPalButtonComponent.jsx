import React from "react";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

export const PayPalButtonComponent = () => {
  // const createOrder = (data, actions) => {
  //   return actions.order.create({
  //     purchase_units: [
  //       {
  //         amount: {
  //           value: "0.01",
  //         },
  //       },
  //     ],
  //   });
  // };

  // const onApprove = (data, actions) => {
  //   return actions.order.capture();
  // };

  // const [{ isPending }] = usePayPalScriptReducer();

  const initialOptions = {
    "client-id": "KPDLDBZU2R4E2",
    currency: "MXN",
    intent: "capture",
    "data-client-token": "abc123xyz==",
  };

  return (
    <PayPalScriptProvider deferLoading={true} options={initialOptions}>
      {/* <PayPalButtons style={{ layout: "horizontal" }} /> */}
      {/* {isPending ? <div className="spinner" /> : null} */}
      <PayPalButtons />
    </PayPalScriptProvider>
  );
};
