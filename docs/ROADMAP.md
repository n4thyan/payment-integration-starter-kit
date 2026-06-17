# Roadmap

## Version 0.1

Core starter-kit foundation.

Status: complete.

- Express server
- Static frontend host page
- Example product configuration
- Stripe Checkout Session route
- PayPal order create route
- PayPal order capture route
- Success, cancel, and frontend error pages
- Environment variable setup
- Setup, testing, security, provider, roadmap, changelog, and AI usage documentation

## Version 0.2

Embeddable widget and public documentation polish.

Status: complete.

- Add `public/payment-widget.js` as the reusable checkout component
- Convert `public/index.html` into a lightweight host page for the widget
- Keep provider logic separated between routes and services
- Rework frontend styles around scoped `.piw-*` widget classes
- Add widget usage documentation
- Tune README and docs so the repo reads as a practical starter kit
- Keep the project clearly scoped to test-mode and sandbox development

## Version 0.3

Local provider validation.

Status: next.

- Run `npm install`
- Run `npm run check`
- Run the local server
- Test Stripe with a real test secret key
- Test PayPal with real sandbox REST app credentials
- Record completed Stripe test flow in `docs/TESTING.md`
- Record completed PayPal sandbox flow in `docs/TESTING.md`
- Add screenshots after successful browser testing
- Improve frontend error states based on real provider responses
- Update the portfolio case study summary with tested results

## Version 0.4

Production-awareness improvements.

Status: planned.

- Stripe webhook example
- Stripe webhook signature verification notes
- PayPal webhook notes or example
- Server-side order record example
- Safer fulfilment notes
- Request validation improvements
- Rate limiting notes
- Deployment notes for a small hosted demo

## Version 0.5

Adaptation examples.

Status: planned.

- Digital product example
- Service deposit example
- One-off invoice-style payment example
- Notes on adapting product data
- Notes on embedding the widget into an existing small-business page

## Separate future project

Cryptocurrency payment experiments should live in a separate repo. That project would need a different scope, including wallets, testnets, transaction confirmation, exchange rate handling, and a different risk model.
