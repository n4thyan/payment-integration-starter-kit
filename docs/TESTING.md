# Testing Notes

This file records manual validation for the starter kit.

Current validation status: **provider validation pending**.

The project should stay in test-mode and sandbox scope until the Stripe and PayPal flows have been run locally with real test credentials.

## Local setup record

| Field | Value |
| --- | --- |
| Operating system | Not recorded yet |
| Node version | Not recorded yet |
| npm version | Not recorded yet |
| Date tested | Not recorded yet |

## Install and syntax check

Commands:

```bash
npm install
npm run check
```

Expected result:

- Dependencies install without errors
- Backend JavaScript syntax check passes
- Frontend widget JavaScript syntax check passes

Result:

- [ ] Passed
- [ ] Failed

Notes:

```text
Add notes here after local testing.
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
Add notes here after local testing.
```

## Stripe test-mode validation

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
Add notes here after local testing.
```

## PayPal sandbox validation

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
Add notes here after local testing.
```

## Security checks

- [ ] `.env` is ignored by Git
- [ ] `.env.example` contains placeholders only
- [ ] Secret keys are only used server-side
- [ ] Frontend does not contain provider secrets
- [ ] Documentation clearly states this is not production-certified
- [ ] Success page text does not claim server-side fulfilment has happened

## Known issues

```text
No local provider issues recorded yet.
```

## Fixes made after testing

```text
No local provider testing has been recorded yet.
```
