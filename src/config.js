import envalid from "envalid";

const { str, bool, testOnly } = envalid;

// -------------------------- SANDBOX
const PAYPAL_USE_SANDBOX = bool({
  desc: "Should use PayPal sandbox?",
  devDefault: true
});

const PAYPAL_SANDBOX_CLIENT_ID = str({
  desc: "PayPal Sandbox Client ID",
  devDefault: testOnly("PAYPAL_SANDBOX_CLIENT_ID")
});

const PAYPAL_SANDBOX_CLIENT_SECRET = str({
  desc: "PayPal Sandbox Client Secret",
  devDefault: testOnly("PAYPAL_SANDBOX_CLIENT_SECRET")
});

// -------------------------- PROD
const PAYPAL_CLIENT_ID = str({
  desc: "PayPal Client ID",
  devDefault: testOnly("PAYPAL_CLIENT_ID")
});

const PAYPAL_CLIENT_SECRET = str({
  desc: "PayPal Client ID",
  devDefault: testOnly("PAYPAL_CLIENT_SECRET")
});

export default envalid.cleanEnv(
  process.env,
  {
    PAYPAL_USE_SANDBOX,
    PAYPAL_SANDBOX_CLIENT_ID,
    PAYPAL_SANDBOX_CLIENT_SECRET,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET
  },
  { dotEnvPath: null }
);
