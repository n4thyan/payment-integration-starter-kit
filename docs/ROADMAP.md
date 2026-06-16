# Roadmap

## Version 0.1

Core starter-kit foundation.

Status: scaffolded, not locally provider-tested yet.

- Express server
- Static checkout page
- Example product configuration
- Stripe Checkout Session route
- PayPal order create route
- PayPal order capture route
- Success, cancel, and frontend error pages
- Environment variable setup
- Setup, testing, security, provider, roadmap, changelog, and AI usage documentation

## Version 0.2

Testing and polish.

- Run `npm install`
- Run `npm run check`
- Run local server
- Test Stripe with a real test secret key
- Test PayPal with real sandbox REST app credentials
- Record completed Stripe test flow in `docs/TESTING.md`
- Record completed PayPal sandbox flow in `docs/TESTING.md`
- Add screenshots
- Improve frontend error states after real local testing
- Add a short case study summary for portfolio use

## Version 0.3

Production-awareness improvements.

- Stripe webhook example
- Stripe webhook signature verification notes
- PayPal webhook notes or example
- Server-side order record example
- Safer fulfilment notes
- Deployment notes for a small hosted demo

## Version 0.4

Adaptation examples.

- Digital product example
- Service deposit example
- One-off invoice-style payment example
- Notes on adapting product data

## Separate future project

Cryptocurrency payment experiments should live in a separate repo. That project would need a different scope, including wallets, testnets, transaction confirmation, exchange rate handling, and a different risk model.
