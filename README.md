# Payment Integration Starter Kit

Reusable Node.js payment starter kit for adding Stripe Checkout, PayPal sandbox checkout, and a local demo checkout flow to small web projects.

This repo is built as a practical, readable starter kit rather than a fake production payment platform. It shows how to separate provider logic, keep secrets on the backend, expose a small frontend checkout widget, handle missing provider credentials safely, and document the checks that need to happen before live payment use.

## Current status

| Area | Status |
| --- | --- |
| Embeddable frontend widget | Built and locally browser-tested |
| Express backend routes | Built |
| Local demo checkout flow | Built and locally validated |
| Stripe Checkout Session flow | Built, pending provider-account validation |
| PayPal order create and capture flow | Built, pending provider-account validation |
| Documentation | Public-facing starter docs in place |
| Live payment readiness | Not production-certified |

The project is currently intended for **test mode, sandbox development, and portfolio demonstration**. Live payment use needs webhook verification, server-side order records, deployment checks, logging, rate limiting, and a fulfilment flow that does not rely on the frontend success page.

## Why this repo exists

This project is designed to be useful in real small-project scenarios, including:

- Service deposit pages
- Small business booking forms
- Digital product payment prototypes
- Reusable checkout widget experiments
- Portfolio examples showing payment flow structure

It is intentionally small enough to read and adapt, while still separating the parts that matter: frontend widget code, provider routes, provider services, product data, environment configuration, testing notes, and security notes.

## What it includes

- Embeddable payment widget
- Local demo checkout flow for testing the full widget path without provider accounts
- Stripe Checkout Session route
- PayPal sandbox order create and capture routes
- Separate route and service files for each provider
- Example product configuration
- Success, cancel, and frontend error pages
- Environment variable based configuration
- Manual validation checklist
- Security notes and limitations
- AI-assisted development notes
- GitHub Actions syntax check
- npm lockfile for reproducible installs

## Tech stack

- Node.js
- Express
- Stripe Node SDK
- PayPal REST API calls
- Plain HTML, CSS, and JavaScript
- dotenv for local environment variables

## Project structure

```text
payment-integration-starter-kit/
├── .github/
│   └── workflows/
│       └── check.yml
├── public/
│   ├── index.html
│   ├── success.html
│   ├── cancel.html
│   ├── error.html
│   ├── styles.css
│   ├── polish.css
│   ├── rounding.css
│   ├── payment-widget.js
│   └── app.js
├── src/
│   ├── config/
│   │   └── env.js
│   ├── data/
│   │   └── products.js
│   ├── routes/
│   │   ├── demo.routes.js
│   │   ├── health.routes.js
│   │   ├── paypal.routes.js
│   │   ├── products.routes.js
│   │   └── stripe.routes.js
│   ├── services/
│   │   ├── paypal.service.js
│   │   └── stripe.service.js
│   └── server.js
├── docs/
│   ├── AI_USAGE.md
│   ├── CASE_STUDY_DRAFT.md
│   ├── PAYPAL.md
│   ├── PROVIDER_REFERENCES.md
│   ├── ROADMAP.md
│   ├── SECURITY_NOTES.md
│   ├── SETUP.md
│   ├── STRIPE.md
│   ├── TESTING.md
│   └── WIDGET_USAGE.md
├── screenshots/
├── .env.example
├── .gitignore
├── .nvmrc
├── CHANGELOG.md
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## How the widget works

The example product is a small service deposit:

```text
Starter Website Deposit
£25.00 GBP
```

`public/payment-widget.js` renders the checkout component into a host element. The demo page at `public/index.html` is only there to show how the widget would look inside another website.

The widget loads the product from the local API, checks which providers are configured, and renders the available checkout options.

Stripe uses a server-created Checkout Session. PayPal uses the JavaScript SDK on the frontend, while order creation and capture are handled by the Express backend. The demo checkout flow simulates a successful checkout locally so the widget, redirect path, and success page can be tested without external provider accounts.

## Basic widget embed

```html
<div id="payment-widget"></div>

<script src="/payment-widget.js"></script>
<script>
  window.PaymentIntegrationWidget.mount('#payment-widget', {
    merchantName: 'Example merchant',
    title: 'Complete your deposit',
    subtitle: 'Choose card, PayPal, or demo checkout to test the flow.',
    productId: 'website-deposit',
    testMode: true
  });
</script>
```

See `docs/WIDGET_USAGE.md` for all widget options.

## Quick start

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your own Stripe test key and PayPal sandbox configuration if you want to test the real provider flows. The local demo checkout flow can run without Stripe or PayPal accounts.

Run a backend and frontend syntax check:

```bash
npm run check
```

Run the server:

```bash
npm run dev
```

Open:

```text
http://localhost:4242
```

## Environment variables

```text
PORT=4242
APP_BASE_URL=http://localhost:4242
NODE_ENV=development

DEMO_CHECKOUT_ENABLED=true

STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_CURRENCY=gbp

PAYPAL_CLIENT_ID=replace_me
PAYPAL_CLIENT_SECRET=replace_me
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CURRENCY=GBP
```

Do not commit `.env` or real provider credentials.

## Local API routes

```text
GET  /api/health
GET  /api/products/default
POST /api/demo/checkout
POST /api/stripe/create-checkout-session
GET  /api/paypal/config
POST /api/paypal/create-order
POST /api/paypal/capture-order/:orderId
```

## Security position

This project keeps provider secret keys server-side and uses environment variables for local configuration.

The frontend success page is not treated as proof of payment. In a real project, fulfilment should only happen after a verified server-side payment event.

Before live use, the project would need at minimum:

- HTTPS deployment
- Stripe webhook signature verification
- PayPal webhook verification or event validation
- Server-side order records
- Request validation
- Rate limiting
- Safe logging
- A real fulfilment flow

## Documentation

- `docs/SETUP.md` explains local setup.
- `docs/WIDGET_USAGE.md` explains how to embed and configure the widget.
- `docs/STRIPE.md` explains the Stripe flow.
- `docs/PAYPAL.md` explains the PayPal flow.
- `docs/TESTING.md` records manual validation results and remaining provider checks.
- `docs/SECURITY_NOTES.md` lists security decisions and limitations.
- `docs/PROVIDER_REFERENCES.md` keeps official docs links in one place.
- `docs/CASE_STUDY_DRAFT.md` is a draft portfolio case study.
- `docs/AI_USAGE.md` explains how AI was used during development.
- `docs/ROADMAP.md` records planned next steps.
- `CHANGELOG.md` records project changes.

## AI-assisted development

AI was used as a development assistant for planning, structure, documentation, and review. The code and documentation are intended to be read, tested, and edited before being treated as finished.

The repo keeps AI usage visible because the aim is to show a practical workflow: use AI to move faster, then validate the result properly.

## Next validation step

The local demo checkout flow has been validated. The next provider-specific step is to run the starter kit with real Stripe test credentials and PayPal sandbox credentials, then record those provider results in `docs/TESTING.md`.

## License

MIT License. See `LICENSE`.
