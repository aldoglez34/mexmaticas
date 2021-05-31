import React from "react";
import { PayPalButton } from "react-paypal-button-v2";

export const PayPalButtonComponent = (props) => {
  const {
    amount,
    catchError,
    createSubscription,
    currency,
    locale,
    onApprove,
    onCancel,
    onError,
  } = props;

  const paypalKey = process.env.REACT_APP_API_KEY;

  return (
    <PayPalButton
      locale={locale}
      amount={amount}
      currency={currency}
      createSubscription={(data, details) => createSubscription(data, details)}
      onApprove={(data, details) => onApprove(data, details)}
      onError={(err) => onError(err)}
      catchError={(err) => catchError(err)}
      onCancel={(err) => onCancel(err)}
      options={{
        clientId: paypalKey,
        vault: true,
      }}
      style={{
        color: "blue",
        label: "subscribe",
        layout: "horizontal",
        shape: "rect",
      }}
    />
  );
};
