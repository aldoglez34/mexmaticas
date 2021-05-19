import React, { useEffect, useRef } from "react";

export const PayPalButtonComponent = () => {
  const paypalRef = useRef();

  const createPayPalOrder = () => {
    return window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "some course",
                amount: {
                  currency_code: "MXN",
                  value: 1,
                },
              },
            ],
          });
        },
        onApprove: async (data, acitons) => {
          const order = await actions.order.capture();
          console.log("order:", order);
        },
        onError: (err) => {
          console.log("paypal error:", err);
        },
      })
      .render(paypal.current);
  };

  useEffect(() => {
    createPayPalOrder();
  }, []);

  //   const initialOptions = {
  //     "client-id": "KPDLDBZU2R4E2",
  //     currency: "MXN",
  //     intent: "capture",
  //     "data-client-token": "abc123xyz==",
  //   };

  return <div ref={paypalRef}></div>;
};
