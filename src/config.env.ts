const {
  PAYPAL_SANDBOX_ACCOUNT,
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET_KEY,
  PAYPAL_BASE_API,
} = process.env;

console.log(process.env.PAYPAL_BASE_API)

export const configEnv = {
  paypal: {
    PAYPAL_SANDBOX_ACCOUNT: "sb-04pyu25480495@business.example.com",
    PAYPAL_CLIENT_ID: "AX5gWeQJY5HfwFUUWZ9dSHzkH56b0FL6CTNaf3pxWlQxmRMeeRQ1rEhKreZyj8J0TkflwiZXhNItm22E",
    PAYPAL_SECRET_KEY: "EJdcX6pWijCmMEtdqQN4A5CL1mvLF8NtysI9bbPcbcrjrTPsYAJVhOHRchYCxe9TuZOTxZs2CDY3FYL-",
    PAYPAL_BASE_API: PAYPAL_BASE_API || "https://api-m.sandbox.paypal.com",
  },
};
