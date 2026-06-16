# Setup

This project is designed for local test-mode and sandbox development first.

## Requirements

- Node.js 18 or newer
- npm
- Stripe account with a test secret key
- PayPal developer account with sandbox REST app credentials

The repo includes `.nvmrc` with Node 20 for convenience, but any supported Node 18+ version should work.

## Install

```bash
npm install
```

## Environment file

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your own test and sandbox values.

Do not commit `.env`.

## Required values

```text
STRIPE_SECRET_KEY=sk_test_replace_me
PAYPAL_CLIENT_ID=replace_me
PAYPAL_CLIENT_SECRET=replace_me
```

The Stripe secret key and PayPal client secret must stay server-side.

## Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:4242
```

## Syntax check

```bash
npm run check
```

This checks the backend JavaScript files for syntax errors. It does not replace real provider testing.

## Useful endpoints

```text
GET  /api/health
GET  /api/products/default
POST /api/stripe/create-checkout-session
GET  /api/paypal/config
POST /api/paypal/create-order
POST /api/paypal/capture-order/:orderId
```

## Provider setup notes

### Stripe

Use a Stripe test mode secret key in `.env`:

```text
STRIPE_SECRET_KEY=sk_test_replace_me
```

The frontend does not need the Stripe secret key. The backend creates the Checkout Session and returns the hosted Checkout URL.

### PayPal

Use sandbox REST app credentials in `.env`:

```text
PAYPAL_CLIENT_ID=replace_me
PAYPAL_CLIENT_SECRET=replace_me
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

The PayPal client ID is used by the browser to load the JavaScript SDK. The PayPal client secret is only used by the backend to request an access token and call the Orders API.

## Local testing order

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Add provider test/sandbox credentials.
4. Run `npm run check`.
5. Run `npm run dev`.
6. Open the checkout page.
7. Test Stripe.
8. Test PayPal.
9. Record results in `docs/TESTING.md`.

## Notes

Use test and sandbox credentials only. Live credentials should not be used until the project has webhook verification, order records, deployment checks, and proper fulfilment logic.
