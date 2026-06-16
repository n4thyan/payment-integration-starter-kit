# Stripe Checkout Notes

This project uses Stripe Checkout Sessions for the Stripe flow.

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

## Important limitation

The success page is not proof that a real order should be fulfilled. Production use should verify payment events with Stripe webhooks before delivering anything or marking an order as paid.
