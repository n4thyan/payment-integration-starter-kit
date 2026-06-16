# Setup

This project is designed for local test-mode development first.

## Requirements

- Node.js 18 or newer
- npm
- Stripe test account
- PayPal developer account with sandbox credentials

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

## Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:4242
```

## Useful endpoints

```text
GET  /api/health
GET  /api/products/default
POST /api/stripe/create-checkout-session
GET  /api/paypal/config
POST /api/paypal/create-order
POST /api/paypal/capture-order/:orderId
```

## Notes

Use test and sandbox credentials only. Do not commit `.env` or real API keys.
