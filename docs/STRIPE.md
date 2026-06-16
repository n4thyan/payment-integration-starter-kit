# Stripe Checkout Notes

This project uses Stripe Checkout Sessions for the Stripe flow.

The backend creates the Checkout Session using the Stripe secret key. The browser receives the hosted Checkout URL and redirects to Stripe.

## Local route

```text
POST /api/stripe/create-checkout-session
```

The frontend calls this route when the Stripe button is clicked.

## Server flow

1. The route receives the selected product ID.
2. The Stripe service loads the product from `src/data/products.js`.
3. The Stripe service creates a Checkout Session using the server-side secret key.
4. The route returns the hosted Checkout URL.
5. The browser redirects to Stripe Checkout.
6. Stripe redirects back to the success or cancel page.

## Environment variables

```text
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_CURRENCY=gbp
```

The secret key must stay server-side.

## Files involved

```text
src/routes/stripe.routes.js
src/services/stripe.service.js
src/data/products.js
public/app.js
```

## Why this structure is used

The frontend does not create a Stripe Checkout Session directly. It asks the backend to create one. This keeps the Stripe secret key out of the browser and makes the payment flow easier to adapt later.

## What is not included yet

- Stripe webhook endpoint
- Stripe webhook signature verification
- Server-side order records
- Fulfilment logic
- Live mode deployment notes

## Important limitation

The success page is not proof that a real order should be fulfilled. Production use should verify payment events with Stripe webhooks before delivering anything or marking an order as paid.

## Official reference

- https://docs.stripe.com/api/checkout/sessions/create
