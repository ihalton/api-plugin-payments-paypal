/**
 * @summary Called on startup
 * @param {Object} context Startup context
 * @param {Object} context.collections Map of MongoDB collections
 * @returns {undefined}
 */
export default function paypalPaymentsStartup(context) {
  context.collections.PaypalPaymentRefunds = context.app.db.collection("PaypalPaymentRefunds");
}
