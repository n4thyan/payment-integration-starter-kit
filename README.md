# Payment Integration Starter Kit

Reusable Stripe and PayPal checkout widget for small web projects.

This project is a Node.js and Express starter kit for adding a compact payment component to service pages, product pages, booking flows, and small business websites. The frontend is designed as an embeddable widget rather than a full standalone checkout page.

The current version is test and sandbox focused. It is not a complete production payment system. Live payment use needs webhook verification, order records, deployment checks, logging, and a proper fulfilment process.

## What it includes

- Embeddable payment widget
- Stripe Checkout Session flow
- PayPal order create and capture flow
- Separate route and service files for each provider
- Example product configuration
- Success and cancel pages
- Environment variable based configuration
- Manual testing notes
- Security notes
- AI-assisted development notes
- GitHub Actions syntax check

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
│   ├── payment-widget.js
│   └── app.js
├── src/
│   ├── config/
│   │   └── env.js
│   ├── data/
│   │   └── products.js
│   ├── routes/
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

Stripe uses a server-created Checkout Session. PayPal uses the JavaScript SDK on the frontend, while order creation and capture are handled by the Express backend.

## Basic widget embed

```html
<div id="payment-widget"></div>

<script src="/payment-widget.js"></script>
<script>
  window.PaymentIntegrationWidget.mount('#payment-widget', {
    merchantName: 'Example merchant',
    title: 'Complete your deposit',
    subtitle: 'Choose card or PayPal to test the checkout flow.',
    productId: 'website-deposit',
    testMode: true
  });
</script>
```

See `docs/WIDGET_USAGE.md` for all widget options.

## Local setup

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

Edit `.env` with your own Stripe test key and PayPal sandbox configuration.

Run a backend syntax check:

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

## AI-assisted development

AI was used as a development assistant for planning, structure, debugging checks, and documentation wording.

The aim is not to hide AI use. The aim is to show a practical workflow where generated suggestions are reviewed, edited, tested, and documented before they are treated as finished.

See `docs/AI_USAGE.md` for the project-specific notes.

## Documentation

- `docs/WIDGET_USAGE.md` explains how to embed and configure the widget.
- `docs/SETUP.md` explains local setup.
- `docs/STRIPE.md` explains the Stripe flow.
- `docs/PAYPAL.md` explains the PayPal flow.
- `docs/TESTING.md` is the manual testing checklist.
- `docs/SECURITY_NOTES.md` lists security decisions and limitations.
- `docs/PROVIDER_REFERENCES.md` keeps official docs links in one place.
- `docs/CASE_STUDY_DRAFT.md` is a draft portfolio case study.
- `docs/ROADMAP.md` records planned next steps.
- `CHANGELOG.md` records project changes.

## Current status

The repo now has the first embeddable widget foundation in place. Local provider testing still needs to be completed with real Stripe test credentials and PayPal sandbox credentials.

## License

MIT License. See `LICENSE`.
