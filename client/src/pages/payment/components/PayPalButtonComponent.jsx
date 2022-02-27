import React, { memo } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { func, number, string } from "prop-types";

export const PayPalButtonComponent = memo(
  ({ amount, catchError, currency, locale, onError, onSuccess }) => {
    const paypalKey = process.env.REACT_APP_API_KEY;

    return (
      <PayPalButton
        amount={amount}
        catchError={catchError}
        currency={currency}
        locale={locale}
        onError={onError}
        onSuccess={onSuccess}
        options={{ clientId: paypalKey, vault: true }}
        style={{
          color: "gold",
          label: "pay",
          layout: "horizontal",
          shape: "rect",
        }}
      />
    );
  }
);

PayPalButtonComponent.propTypes = {
  amount: number.isRequired,
  catchError: func.isRequired,
  currency: string.isRequired,
  locale: string.isRequired,
  onError: func.isRequired,
  onSuccess: func.isRequired,
};

PayPalButtonComponent.displayName = "PayPalButtonComponent";
