/* eslint-disable no-unused-vars */
// eslint-disable-next-line node/no-extraneous-import
import Random from "@reactioncommerce/random";
import Logger from "@reactioncommerce/logger";
import paypalCheckoutSdk from "@paypal/checkout-server-sdk";
import paypalClient from "../paypalClient.js";
import { PaypalPackageName } from "./constants.js";

const METHOD = "paypal";
const PAYMENT_METHOD_NAME = "paypal";

// NOTE: The "processor" value is lowercased and then prefixed to various payment Meteor method names,
// so for example, if this is "Example", the list refunds method is expected to be named "example/refund/list"
const PROCESSOR = "Paypal";

/**
 * @summary As an example and for demos, this non-production payment method creates a payment
 *   without charging any credit card
 * @param {Object} context The request context
 * @param {Object} input Input necessary to create a payment
 * @returns {Object} The payment object in schema expected by the orders plugin
 */
export default async function paypalCreateAuthorizedPayment(context, input) {
  const {
    amount,
    billingAddress,
    shopId,
    paymentData: {
      paypalOrderId
    }
  } = input;


  const request = new paypalCheckoutSdk.orders.OrdersGetRequest(paypalOrderId);
  const response = await paypalClient.client().execute(request);
  const responseResult = response.result;
  // Logger.info(responseResult);
  let captureId = null;
  if (responseResult.intent === "CAPTURE" && responseResult.status === "COMPLETED") {
    captureId = responseResult.purchase_units[0].payments.captures[0].id;
  }


  // const authorizeRequest = new paypalCheckoutSdk.orders.OrdersAuthorizeRequest(paypalOrderId);
  // authorizeRequest.requestBody({});
  // const authorizeResponse = await paypalClient.client().execute(authorizeRequest);
  // Logger.info({ authorizeResponse }, "authorizeRequest has been submitted");

  return {
    _id: Random.id(),
    address: billingAddress,
    amount,
    createdAt: new Date(),
    data: {
      gqlType: "PaypalPaymentData" // GraphQL union resolver uses this
    },
    displayName: "PayPal",
    method: METHOD,
    mode: "authorize",
    name: PAYMENT_METHOD_NAME,
    paymentPluginName: PaypalPackageName,
    processor: PROCESSOR,
    riskLevel: "normal",
    shopId,
    status: "created",
    transactionId: paypalOrderId,
    transactions: [{ captureId }]
    // transactions: [{ authorizationCode: authorizeResponse.result.purchase_units[0].payments.authorizations[0].id }]
  };
}
