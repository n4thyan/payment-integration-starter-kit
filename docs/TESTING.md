# Testing Notes

Use this file as the manual test record for the project.

## Local setup

- Operating system:
- Node version:
- npm version:
- Date tested:

## Install test

```bash
npm install
npm run dev
```

Expected result:

- Server starts on `http://localhost:4242`
- Homepage loads
- `/api/health` returns JSON

## Stripe test

Before testing:

- `STRIPE_SECRET_KEY` is set in `.env`
- The key is a Stripe test key
- `.env` has not been committed

Checklist:

- Stripe button is visible
- Clicking the button creates a Checkout Session
- Browser redirects to Stripe Checkout
- Test payment returns to `success.html`
- Cancelling checkout returns to `cancel.html`
- Server logs do not expose the secret key

## PayPal sandbox test

Before testing:

- `PAYPAL_CLIENT_ID` is set in `.env`
- `PAYPAL_CLIENT_SECRET` is set in `.env`
- `PAYPAL_BASE_URL` points to the sandbox API
- `.env` has not been committed

Checklist:

- PayPal button renders
- Clicking the button creates a PayPal order
- Sandbox approval works
- Capture route is called after approval
- Success page receives the PayPal order reference
- Server logs do not expose the client secret

## Security checks

- `.env` is ignored by Git
- `.env.example` contains placeholders only
- Secret keys are only used in `src/services`
- Frontend does not contain provider secrets
- Documentation clearly states this is not production-certified

## Known issues

Add issues here during real local testing.
