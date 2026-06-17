# Changelog

## 0.2.2

Public-facing documentation polish.

- Reworked the README so the repo presents as a practical sandbox starter kit with a clear validation status.
- Clarified the difference between built starter-kit foundations, pending provider validation, and production readiness.
- Updated widget usage docs so default option values match the actual widget code.
- Reframed testing notes as a manual validation checklist.
- Updated the roadmap around staged validation and production-awareness work.
- Aligned `package.json` version with the existing 0.2.x changelog line.

## 0.2.1

Checkout widget interaction polish.

- Reworked the widget payment area into method rows with live Ready, Off, and Error states.
- Added clearer card checkout loading behaviour.
- Removed the static divider/disabled-message layout that made the widget feel like a flat mockup.
- Tuned the demo copy so the host page feels less like a generated landing page.

## 0.2.0

Widget-focused frontend refactor.

- Added `public/payment-widget.js` as the reusable checkout component.
- Converted `public/index.html` into a lightweight host page for the widget.
- Reduced `public/app.js` to a small widget mount example.
- Reworked frontend styles around scoped `.piw-*` widget classes.
- Added `docs/WIDGET_USAGE.md` with embed instructions and widget options.
- Updated README to describe the project as an embeddable payment widget rather than a full checkout page.

## 0.1.0

Initial starter-kit foundation.

- Added Express server and static frontend.
- Added example product configuration.
- Added Stripe Checkout Session route and service.
- Added PayPal order create/capture routes and service.
- Added provider configuration status endpoint.
- Added success, cancel, and frontend error pages.
- Added setup, testing, security, provider, roadmap, changelog, and AI usage documentation.
- Added provider reference notes using official Stripe and PayPal documentation links.
- Added a draft portfolio case study note.
- Added `.env.example`, `.gitignore`, `.nvmrc`, and MIT license.
- Added GitHub Actions syntax check workflow.

## Next

- Run local testing with real Stripe test credentials.
- Run local testing with PayPal sandbox credentials.
- Record validation results in `docs/TESTING.md`.
- Add screenshots after browser testing.
- Improve frontend error states based on real provider responses.
- Add webhook examples in a later version.
