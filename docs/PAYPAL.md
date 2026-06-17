# PayPal Checkout Notes

This project uses PayPal sandbox checkout with server-side order creation and capture structure.

The browser loads the PayPal JavaScript SDK using the sandbox client ID. The backend uses the PayPal client ID and client secret to request an access token, create the order, and capture the order after approval.

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

## Files involved

```text
src/routes/paypal.routes.js
src/services/paypal.service.js
src/data/products.js
public/payment-widget.js
public/app.js
```

## Why this structure is used

The PayPal button is a browser component, but the sensitive work happens on the backend. The browser never receives the PayPal client secret.

The frontend creates and captures orders by calling local Express routes instead of calling the PayPal REST API directly.

## Current scope

This route is built for sandbox validation. It should be tested locally with PayPal sandbox REST app credentials before being presented as a completed provider flow.

## What is not included yet

- PayPal webhook verification
- Server-side order records
- Detailed funding failure handling
- Refund flow
- Live mode deployment notes

## Important limitation

This starter kit is not a complete production payment system. Live use should include webhook verification, proper order records, logging, deployment checks, and fulfilment logic that does not rely on the frontend success page alone.

## Official references

- https://developer.paypal.com/docs/checkout/standard/integrate/
- https://developer.paypal.com/docs/api/orders/v2/
