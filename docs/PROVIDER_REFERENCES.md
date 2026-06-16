# Provider References

These are the official provider docs used as the baseline for this starter kit.

## Stripe

- Stripe Checkout Sessions API
  - https://docs.stripe.com/api/checkout/sessions/create

The Stripe route creates a Checkout Session server-side and redirects the browser to the hosted Checkout URL.

## PayPal

- PayPal Standard Checkout integration
  - https://developer.paypal.com/docs/checkout/standard/integrate/

- PayPal Orders API v2
  - https://developer.paypal.com/docs/api/orders/v2/

The PayPal flow renders the JavaScript SDK button on the frontend, then calls backend routes to create and capture the order.

## Project notes

Provider docs change over time. Before adapting this starter kit for live payments, re-check the latest official Stripe and PayPal documentation, especially webhook handling, production credentials, SDK versions, and go-live requirements.
