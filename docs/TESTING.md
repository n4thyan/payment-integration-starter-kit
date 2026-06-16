# Testing Notes

Use this file as the manual test record for the project.

Do not mark the project as portfolio-ready until the provider flows have been tested locally with real test/sandbox credentials.

## Local setup

- Operating system:
- Node version:
- npm version:
- Date tested:

## Install and syntax test

Commands:

```bash
npm install
npm run check
```

Expected result:

- Dependencies install without errors
- Backend JavaScript syntax check passes

Result:

- [ ] Passed
- [ ] Failed

Notes:

```text
Add notes here.
```

## Server startup test

Command:

```bash
npm run dev
```

Expected result:

- Server starts on `http://localhost:4242`
- Homepage loads
- `/api/health` returns JSON
- Unknown browser routes show the frontend error page

Result:

- [ ] Passed
- [ ] Failed

Notes:

```text
Add notes here.
```

## Stripe test

Before testing:

- `STRIPE_SECRET_KEY` is set in `.env`
- The key is a Stripe test key
- `.env` has not been committed

Checklist:

- [ ] Stripe button is visible when configured
- [ ] Stripe button is disabled when no test key is configured
- [ ] Clicking the button creates a Checkout Session
- [ ] Browser redirects to Stripe Checkout
- [ ] Test payment returns to `success.html`
- [ ] Cancelling checkout returns to `cancel.html`
- [ ] Server logs do not expose the secret key

Result:

- [ ] Passed
- [ ] Failed

Notes:

```text
Add notes here.
```

## PayPal sandbox test

Before testing:

- `PAYPAL_CLIENT_ID` is set in `.env`
- `PAYPAL_CLIENT_SECRET` is set in `.env`
- `PAYPAL_BASE_URL` points to the sandbox API
- `.env` has not been committed

Checklist:

- [ ] PayPal button renders when both sandbox values are configured
- [ ] PayPal button does not render when credentials are incomplete
- [ ] Clicking the button creates a PayPal order
- [ ] Sandbox approval works
- [ ] Capture route is called after approval
- [ ] Success page receives the PayPal order reference
- [ ] Server logs do not expose the client secret

Result:

- [ ] Passed
- [ ] Failed

Notes:

```text
Add notes here.
```

## Security checks

- [ ] `.env` is ignored by Git
- [ ] `.env.example` contains placeholders only
- [ ] Secret keys are only used server-side
- [ ] Frontend does not contain provider secrets
- [ ] Documentation clearly states this is not production-certified
- [ ] Success page text does not claim server-side fulfilment has happened

## Known issues

Add issues here during real local testing.

```text
None recorded yet.
```

## Fixes made after testing

Record any fixes made after local testing.

```text
No local provider testing has been recorded yet.
```
