# Security Notes

Payment code needs stricter handling than a normal static website. This starter kit keeps the first version small, but it still follows basic safety rules.

## Current safety decisions

- Secret keys are loaded from environment variables
- `.env.example` only contains placeholders
- `.env` is ignored by Git
- Stripe Checkout Session creation happens server-side
- PayPal access token requests happen server-side
- PayPal order capture happens server-side
- The browser only receives the PayPal client ID, which is intended to be public
- The frontend checks provider configuration before showing usable payment controls

## Not production-certified yet

This starter kit is not a finished production payment system.

Before using a payment flow with real money, add and review:

- HTTPS deployment
- Stripe webhook signature verification
- PayPal webhook verification or event validation
- Server-side order records
- Fulfilment logic that waits for verified payment events
- Request validation
- Rate limiting
- Logging without leaking secrets
- Deployment-specific environment checks
- Provider dashboard configuration
- Refund and dispute handling notes

## Provider keys

Never commit:

- Stripe secret keys
- PayPal client secrets
- Live mode credentials
- `.env` files
- Webhook signing secrets

Safe to commit:

- `.env.example` with placeholders
- Setup notes
- Test-mode documentation
- Public frontend code that does not contain secrets

## Fulfilment warning

Do not deliver a product, send a file, mark an order as paid, or trigger a real service action from the frontend success page alone.

Success pages are useful for user feedback, but payment fulfilment should be based on verified server-side events.

## Current known limitation

This version proves the checkout route structure. It does not yet persist an order record before redirecting to a provider. That means it is useful as a starter kit, but not enough for live fulfilment without the planned webhook and order-record work.
