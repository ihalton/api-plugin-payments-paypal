/* eslint-disable no-prototype-builtins */
/* eslint-disable no-await-in-loop */
/* eslint-disable radix */
/* eslint-disable require-jsdoc */
import paypalCheckout from "@paypal/checkout-server-sdk";
import config from "./config.js";

function environment() {
  if (config.PAYPAL_USE_SANDBOX) {
    return new paypalCheckout.core.SandboxEnvironment(
      config.PAYPAL_SANDBOX_CLIENT_ID,
      config.PAYPAL_SANDBOX_CLIENT_SECRET
    );
  }

  return new paypalCheckout.core.LiveEnvironment(
    config.PAYPAL_CLIENT_ID,
    config.PAYPAL_CLIENT_SECRET
  );
}

async function prettyPrint(jsonData, pre = "") {
  let pretty = "";
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      if (isNaN(key)) pretty += `${pre + capitalize(key)}: `;
      else pretty += `${pre + (parseInt(key) + 1)}: `;
      if (typeof jsonData[key] === "object") {
        pretty += "\n";
        pretty += await prettyPrint(jsonData[key], `${pre}\t`);
      } else {
        pretty += `${jsonData[key]}\n`;
      }
    }
  }
  return pretty;
}


// eslint-disable-next-line valid-jsdoc
/**
 * Returns PayPal HTTP client instance with environment which has access
 * credentials context. This can be used invoke PayPal API's provided the
 * credentials have the access to do so.
 */
function client() {
  return new paypalCheckout.core.PayPalHttpClient(environment());
}

export default { client, prettyPrint };


// const paypalClient = new paypalCheckout.core.PayPalHttpClient(environment());

// export default paypalClient;
