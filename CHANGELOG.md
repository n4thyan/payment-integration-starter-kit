# Changelog

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
- Add screenshots after browser testing.
- Improve frontend error states based on real provider responses.
- Add webhook examples in a later version.
