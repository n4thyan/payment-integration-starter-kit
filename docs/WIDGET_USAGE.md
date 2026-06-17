# Widget Usage

The frontend is built around an embeddable payment widget rather than a full checkout page.

The demo page at `public/index.html` is a host page. The reusable component lives in:

```text
public/payment-widget.js
```

The widget renders its own product summary, provider status, Stripe checkout action, PayPal button slot, loading state, error state, and test-mode note.

## Basic embed

Add a host element to any page served by the Express app:

```html
<div id="payment-widget"></div>
```

Load the widget script:

```html
<script src="/payment-widget.js"></script>
```

Mount the widget:

```html
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

## Options

| Option | Purpose | Default |
| --- | --- | --- |
| `apiBase` | Optional API base URL if the widget is hosted separately from the backend. | empty string |
| `productId` | Product ID sent to Stripe and PayPal routes. | `website-deposit` |
| `productEndpoint` | Endpoint used to load the displayed product. | `/api/products/default` |
| `stripeEndpoint` | Endpoint used to create a Stripe Checkout Session. | `/api/stripe/create-checkout-session` |
| `healthEndpoint` | Endpoint used to check provider availability. | `/api/health` |
| `paypalConfigEndpoint` | Endpoint used to load the PayPal client-side config. | `/api/paypal/config` |
| `paypalCreateOrderEndpoint` | Endpoint used to create a PayPal order. | `/api/paypal/create-order` |
| `paypalCaptureOrderEndpoint` | Endpoint base used to capture a PayPal order. The order ID is appended by the widget. | `/api/paypal/capture-order` |
| `title` | Main widget heading. | `Checkout` |
| `subtitle` | Short helper text below the heading. | `Review the deposit and choose a payment method.` |
| `testMode` | Shows or hides the test-mode badge. | `true` |
| `merchantName` | Small merchant label in the widget header. | `Nathan May Web Projects` |

## Provider behaviour

The widget checks `/api/health` before rendering payment actions.

- Stripe is shown as ready when the backend has a Stripe test secret key configured.
- PayPal is shown as ready when the backend has both sandbox values configured.
- Missing providers are shown as unavailable instead of silently failing.

## Styling

The widget uses `.piw-*` class names to keep its styles separate from the host page.

The current stylesheet is still part of the demo app, but the class naming is designed so the widget can later be moved into a standalone CSS file if needed.

## Current scope

This is a starter kit for test-mode and sandbox payment flow development. It is not a production payment package.

Before live use, it would need webhook verification, order records, stricter request validation, rate limiting, deployment hardening, safe logging, and a proper fulfilment flow.
