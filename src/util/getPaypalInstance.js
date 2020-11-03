import paypalClient from "../paypalClient.js";

/**
 * @name getPaypalInstance
 * @param {Object} paypalConfig Paypal API Key, see https://paypal.com/docs/keys
 * @returns {Object} The Paypal SDK object
 */
export default function getPaypalInstance() {
  return paypalClient.client();
}
