# PayPal Checkout Notes

This project uses PayPal sandbox checkout with server-side order creation and capture.

## Local routes

```text
GET  /api/paypal/config
POST /api/paypal/create-order
POST /api/paypal/capture-order/:orderId
```

## Server flow

1. The frontend requests PayPal public config.
2. The frontend loads the PayPal JavaScript SDK with the sandbox client ID.
3. When the buyer clicks the PayPal button, the frontend calls `/api/paypal/create-order`.
4. The server requests a PayPal OAuth access token using the client ID and client secret.
5. The server creates an order through the PayPal Orders API.
6. After approval, the frontend calls `/api/paypal/capture-order/:orderId`.
7. The server captures the order through the PayPal Orders API.
8. The frontend redirects to the success page.

## Environment variables

```text
PAYPAL_CLIENT_ID=replace_me
PAYPAL_CLIENT_SECRET=replace_me
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CURRENCY=GBP
```

The client ID can be used by the browser. The client secret must stay server-side.

## Important limitation

This first version captures sandbox orders, but it is not a complete production payment system. Live use should include webhook verification, proper order records, logging, and deployment checks.
