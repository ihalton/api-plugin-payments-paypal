import pkg from "../package.json";
import i18n from "./i18n/index.js";
import schemas from "./schemas/index.js";
import { PaypalPackageName } from "./util/constants.js";
import paypalCapturePayment from "./util/paypalCapturePayment.js";
import paypalCreateAuthorizedPayment from "./util/paypalCreateAuthorizedPayment.js";
import paypalCreateRefund from "./util/paypalCreateRefund.js";
import paypalListRefunds from "./util/paypalListRefunds.js";
import startup from "./startup.js";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "Paypal Payments",
    name: PaypalPackageName,
    version: pkg.version,
    i18n,
    graphQL: {
      schemas
    },
    functionsByType: {
      startup: [startup]
    },
    paymentMethods: [{
      name: "paypal",
      canRefund: true,
      displayName: "Paypal Payments",
      functions: {
        capturePayment: paypalCapturePayment,
        createAuthorizedPayment: paypalCreateAuthorizedPayment,
        createRefund: paypalCreateRefund,
        listRefunds: paypalListRefunds
      }
    }]
  });
}
