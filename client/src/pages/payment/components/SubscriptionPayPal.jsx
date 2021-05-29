import { PayPalButton } from "react-paypal-button-v2";

export const SubscriptionPayPal = React.memo(({ courseId, coursePrice }) => {
  return (
    <PayPalButton
      options={{
        currency: "MXN",
        locale: "es_MX",
        vault: true,
      }}
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: "P-XXXXXXXXXXXXXXXXXXXXXXXX",
        });
      }}
      onApprove={(data, actions) => {
        // Capture the funds from the transaction
        return actions.subscription.get().then((details) => {
          // Show a success message to your buyer
          console.log("details", details);
          alert("Subscription completed");

          // OPTIONAL: Call your server to save the subscription
          // return fetch("/paypal-subscription-complete", {
          //   method: "post",
          //   body: JSON.stringify({
          //     orderID: data.orderID,
          //     subscriptionID: data.subscriptionID,
          //   }),
          // });
        });
      }}
    />
  );
});
