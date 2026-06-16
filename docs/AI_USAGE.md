# AI-Assisted Development Notes

This project uses AI as a development assistant, not as a replacement for understanding the code.

## How AI was used

- Planning the project scope and file structure
- Comparing Stripe and PayPal checkout flow approaches
- Drafting first-pass route and service separation
- Suggesting documentation sections
- Reviewing wording for clarity and avoiding generic filler

## What was checked manually

- Provider secrets are read from environment variables
- Stripe secret key is only used server-side
- PayPal client secret is only used server-side
- PayPal client ID is the only PayPal value exposed to the browser
- The frontend calls server routes rather than calling provider APIs directly
- The project avoids live-payment claims in the documentation

## Rules for this repo

- No real API keys in commits
- No production-ready claims until webhooks and deployment checks are added
- No copied code left in place without being read and understood
- No crypto payment support in this repo; that belongs in a separate future project

## Notes to update during testing

Add real issues here as they are found during local setup and provider testing.
