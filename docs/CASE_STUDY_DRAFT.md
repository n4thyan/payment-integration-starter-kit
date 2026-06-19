# Case Study Draft

This file is a working project summary for later use on a portfolio site. It should be updated again after real Stripe and PayPal provider validation is complete.

## Project

Payment Integration Starter Kit

## Summary

A reusable Node.js and Express starter kit for adding Stripe Checkout, PayPal sandbox checkout, and a local demo checkout flow to small web projects.

The project uses an embeddable frontend widget, separated backend provider routes, environment-based configuration, and documentation that clearly distinguishes demo testing, sandbox development, and production payment readiness.

## Why I built it

I wanted a practical GitHub project that shows how a small payment flow is structured without pretending to be a complete production payment system.

The aim was to build something useful, readable, and adaptable: a starter kit that could become the foundation for service deposits, digital product pages, booking forms, or one-off payments after proper production checks are added.

## What it demonstrates

- Node.js and Express project structure
- Frontend widget to backend API flow
- Local demo checkout flow
- Stripe Checkout Session creation structure
- PayPal order creation and capture structure
- Environment variable handling
- Separating provider routes and services
- Manual validation documentation
- Security-aware limitations
- AI-assisted development with manual review

## Technical decisions

- Keep provider secrets on the backend
- Keep product data in one small configuration file
- Use a hosted Stripe Checkout flow instead of handling card data directly
- Use PayPal's browser SDK only for the public checkout component
- Keep PayPal order creation and capture on the backend
- Add a local demo checkout flow so the UI and redirect path can be tested without external payment accounts
- Treat the frontend success page as user feedback, not payment proof
- Keep production webhook work as a later milestone instead of overclaiming readiness

## How AI helped

AI was used for planning the file structure, comparing provider flow options, drafting documentation sections, and reviewing the repo for missing setup or security notes.

The project keeps AI usage visible because the workflow is part of the point: use AI to move faster, then review, test, edit, and document the result honestly.

## What has been checked so far

- Local install completed successfully
- `npm run check` passed
- The Express server starts locally on port 4242
- `/api/health` returns valid JSON
- The widget renders in the browser
- Product data loads into the widget
- Stripe is disabled in the UI when the secret key is missing
- PayPal is disabled in the UI when sandbox credentials are missing
- Demo checkout shows as ready when enabled
- Demo checkout redirects to the success page
- The success page clearly marks the provider as `demo`
- Secret keys are kept server-side
- The frontend only calls local backend routes
- Documentation avoids production-ready claims
- Crypto payment work is kept out of this repo
- Widget usage docs match the current widget defaults

## What still needs to be validated with provider accounts

- Stripe test checkout flow using a real Stripe test account and `sk_test_` secret key
- PayPal sandbox order creation and capture using a PayPal developer account
- Webhook verification examples before any production use
- Server-side order records before any fulfilment flow

## Portfolio position

This project should be presented as a practical payment integration starter kit, not as a production payment processor.

The honest portfolio wording is:

> Built a reusable Node.js payment starter kit with an embeddable checkout widget, separated Stripe and PayPal provider logic, safe environment-based configuration, local demo checkout validation, and clear documentation of production limitations.

## Next improvements

- Add screenshots to the repo
- Add webhook examples
- Add order record example
- Add deployment notes
- Add a short demo video if the final browser flow is clean
