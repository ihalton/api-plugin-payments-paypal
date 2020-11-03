// eslint-disable-next-line node/no-extraneous-import
import Logger from "@reactioncommerce/logger";
import paypalCheckoutSdk from "@paypal/checkout-server-sdk";
import paypalClient from "../paypalClient.js";

/**
 * @name paypalCapturePayment
 * @method
 * @summary Capture payment for Paypal payment method
 * @param {Object} context an object containing the per-request state
 * @param {Object} payment object containing authorization ID
 * @returns {Object} result for capturing a payment
 * @private
 */
export default async function paypalCapturePayment(context, payment) {
  const results = { saved: false, response: {} };
  const paypalOrderId = payment.transactionId;
  const request = new paypalCheckoutSdk.orders.OrdersGetRequest(paypalOrderId);
  try {
    const response = await paypalClient.client().execute(request);
    if (response.intent === "CAPTURE" && response.status === "COMPLETED" && response.purchase_units[0].payments.captures[0].status === "COMPLETED") {
      results.saved = true;
    }
  } catch (error) {
    if (error.message && error.message.includes("AUTHORIZATION_ALREADY_CAPTURED")) {
      results.saved = true;
    } else {
      Logger.error("Failed to capture paypal payment", error);
      results.error = error;
      results.errorCode = error.code;
      results.errorMessage = error.message;
    }
  }

  // const request = new paypalCheckoutSdk.payments.AuthorizationsCaptureRequest(payment.transactions[0].authorizationCode);
  // request.requestBody({});
  // try {
  //   const capture = await paypalClient.client().execute(request);
  //   if (capture.status === "COMPLETED") {
  //     results.saved = true;
  //   }
  // } catch (error) {
  //   if (error.message && error.message.includes("AUTHORIZATION_ALREADY_CAPTURED")) {
  //     results.saved = true;
  //   } else {
  //     Logger.error("Failed to capture paypal payment", error);
  //     results.error = error;
  //     results.errorCode = error.code;
  //     results.errorMessage = error.message;
  //   }
  // }
  return results;
}
