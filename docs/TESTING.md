# Testing Notes

This file records manual validation for the starter kit.

Current validation status: **local demo validation passed; provider validation pending**.

The project should stay in test-mode and sandbox scope until the Stripe and PayPal flows have been run locally with real test credentials. Local testing on 2026-06-19 confirmed the app runs, the widget renders, the health endpoint reports provider state correctly, and the demo checkout flow reaches the success page without external accounts.

## Local setup record

| Field | Value |
| --- | --- |
| Operating system | Windows desktop, PowerShell |
| Node version | v22.18.0 |
| npm version | 10.9.3 |
| Date tested | 2026-06-19 |

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

- [x] Passed
- [ ] Failed

Notes:

```text
npm install completed successfully.
0 vulnerabilities reported.
npm run check completed successfully.
Checked server, config, data, route, service, frontend widget, and app JavaScript files.
PowerShell required npm.cmd because npm.ps1 was blocked by the local execution policy.
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

- [x] Passed
- [ ] Failed

Notes:

```text
Server started at http://localhost:4242.
Homepage loaded successfully.
Checkout widget rendered correctly.
/api/health returned valid JSON.
Health response confirmed demoConfigured=true, stripeConfigured=false, paypalConfigured=false, and paypalClientIdAvailable=false.
Product data returned correctly for the Starter Website Deposit test product.
```

## Demo checkout validation

The demo checkout flow exists for local portfolio/testing use when external Stripe or PayPal accounts are not available.

Checklist:

- [x] Demo checkout shows as ready when enabled
- [x] Stripe and PayPal can remain disabled without crashing the widget
- [x] Clicking the demo button redirects to the success page
- [x] Success page identifies the provider as `demo`
- [x] Success page uses a simulated reference, not a real payment claim
- [x] Success page warns that real fulfilment must be verified server-side before delivering goods or marking an order as paid

Result:

- [x] Passed
- [ ] Failed

Notes:

```text
Demo checkout button displayed as "Run local demo checkout".
Clicking it redirected to success.html.
Success page displayed Provider: demo and Reference: simulated_success.
This validates the local widget flow but does not represent a real payment.
```

## Stripe test-mode validation

Before testing:

- `STRIPE_SECRET_KEY` is set in `.env`
- The key is a Stripe test key
- `.env` has not been committed

Checklist:

- [ ] Stripe button is visible when configured
- [x] Stripe button is disabled when no test key is configured
- [ ] Clicking the button creates a Checkout Session
- [ ] Browser redirects to Stripe Checkout
- [ ] Test payment returns to `success.html`
- [ ] Cancelling checkout returns to `cancel.html`
- [x] Server logs do not expose the secret key during no-credential local testing

Result:

- [ ] Passed
- [ ] Failed
- [x] Provider-ready, not fully provider-tested

Notes:

```text
Stripe account/test credentials were not available during this local test session.
No real Stripe Checkout Session was created.
The widget correctly handled missing Stripe credentials by showing Card as OFF and displaying "Server credentials are missing."
Full Stripe validation still requires a Stripe test-mode secret key beginning with sk_test_ in the local .env file.
```

## PayPal sandbox validation

Before testing:

- `PAYPAL_CLIENT_ID` is set in `.env`
- `PAYPAL_CLIENT_SECRET` is set in `.env`
- `PAYPAL_BASE_URL` points to the sandbox API
- `.env` has not been committed

Checklist:

- [ ] PayPal button renders when both sandbox values are configured
- [x] PayPal button does not render when credentials are incomplete
- [ ] Clicking the button creates a PayPal order
- [ ] Sandbox approval works
- [ ] Capture route is called after approval
- [ ] Success page receives the PayPal order reference
- [x] Server logs do not expose the client secret during no-credential local testing

Result:

- [ ] Passed
- [ ] Failed
- [x] Provider-ready, not fully provider-tested

Notes:

```text
PayPal login/sandbox credentials were not available during this local test session.
No real PayPal sandbox order was created or captured.
The widget correctly handled missing PayPal credentials by showing PayPal as OFF and displaying "PayPal sandbox is not configured."
Full PayPal validation still requires a sandbox client ID and client secret in the local .env file.
```

## Security checks

- [x] `.env` is ignored by Git
- [x] `.env.example` contains placeholders only
- [x] Secret keys are only used server-side
- [x] Frontend does not contain provider secrets
- [x] Documentation clearly states this is not production-certified
- [x] Success page text does not claim server-side fulfilment has happened

## Known issues

```text
No runtime issues observed during local demo validation.
Real Stripe and PayPal provider flows remain untested because provider accounts/credentials were not available.
```

## Fixes made after testing

```text
Added/validated local demo checkout mode so the widget can be tested end-to-end without external Stripe or PayPal accounts.
Recorded local validation results and provider testing limits in this document.
```
