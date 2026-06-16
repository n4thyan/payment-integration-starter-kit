# AI-Assisted Development Notes

This project uses AI as a development assistant, not as a replacement for understanding the code.

The point of this repo is to show a practical workflow: use AI to move faster, then review the result, test it, remove weak parts, and document what is actually happening.

## How AI was used

- Planning the project scope and file structure
- Comparing Stripe and PayPal checkout flow approaches
- Drafting first-pass route and service separation
- Checking for missing setup and security notes
- Improving documentation structure
- Reviewing wording so the repo does not sound like generic generated filler

## What was checked manually

- Provider secrets are read from environment variables
- Stripe secret key is only used server-side
- PayPal client secret is only used server-side
- PayPal client ID is the only PayPal value exposed to the browser
- The frontend calls local server routes rather than provider REST APIs directly
- The PayPal button is only rendered when both sandbox values are configured
- Stripe is disabled in the UI when no test key is configured
- The documentation avoids production-ready claims
- Crypto payment support is kept out of this repo

## Rules for this repo

- No real API keys in commits
- No production-ready claims until webhooks and deployment checks are added
- No copied code left in place without being read and understood
- No crypto payment support in this repo; that belongs in a separate future project
- No vague claims like "enterprise-grade", "seamless", or "production-ready"

## Notes to update during testing

Add real issues here as they are found during local setup and provider testing.

```text
No local provider test notes have been recorded yet.
```
