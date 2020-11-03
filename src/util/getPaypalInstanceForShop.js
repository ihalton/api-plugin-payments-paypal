/* eslint-disable no-unused-vars */
import getPaypalInstance from "./getPaypalInstance.js";

/**
 * @summary Given a shop ID, gets an instance of the paypal API configured with that shop's API key.
 * @param {Object} context The context object
 * @returns {Object} The paypal SDK object
 */
export default async function getpaypalInstanceForShop(context) {
  return getPaypalInstance();
}
