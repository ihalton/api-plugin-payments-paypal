import Logger from "@reactioncommerce/logger";
import paypalCheckoutSdk from "@paypal/checkout-server-sdk";
import paypalClient from "../paypalClient.js";

/**
 * @name paypalCreateRefund
 * @method
 * @summary Create a refund for an order for paypal payment method
 * @param {Object} context an object containing the per-request state
 * @param {Object} payment object containing transaction ID
 * @param {Number} amount the amount to be refunded
 * @param {String} [reason] the reason for the refund
 * @returns {Object} refund result
 * @private
 */
export default async function paypalCreateRefund(context, payment, amount, reason) {
  const { currencyCode, transactionId, transactions } = payment;
  // Logger.info(payment);

  let captureId = transactions.length > 0 ? transactions[0].captureId : null;
  if (!captureId) {
    // Logger.info(transactionId, captureId);
    const request = new paypalCheckoutSdk.orders.OrdersGetRequest(transactionId);
    const response = await paypalClient.client().execute(request);
    const responseResult = response.result;
    // Logger.info(response);
    if (responseResult.intent === "CAPTURE" && responseResult.status === "COMPLETED") {
      captureId = responseResult.purchase_units[0].payments.captures[0].id;
      // Logger.error(responseResult.purchase_units[0].payments.captures[0]);
    }
  }

  // Logger.info(transactionId, captureId);
  try {
    const request = new paypalCheckoutSdk.payments.CapturesRefundRequest(captureId);
    request.requestBody({
      amount: {
        value: amount,
        // eslint-disable-next-line camelcase
        currency_code: currencyCode
      }
    });
    const response = await paypalClient.client().execute(request);
    Logger.debug(response.result);
  } catch (error) {
    Logger.error("Failed to capture paypal payment", error);
    return { saved: false };
  }

  await context.collections.PaypalPaymentRefunds.insertOne({
    amount,
    createdAt: new Date(),
    currencyCode,
    reason,
    transactionId
  });
  return { saved: true };
}
