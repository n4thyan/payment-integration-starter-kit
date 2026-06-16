# Widget Usage

The frontend is now built around an embeddable payment widget rather than a full checkout page.

The demo page at `public/index.html` is only a host page. The reusable component lives in:

```text
public/payment-widget.js
```

The widget renders its own product summary, card checkout button, PayPal button slot, loading state, provider status, and test-mode note.

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
| `paypalCaptureOrderEndpoint` | Endpoint used to capture a PayPal order. | `/api/paypal/capture-order` |
| `title` | Main widget heading. | `Secure checkout` |
| `subtitle` | Short helper text below the heading. | `Choose a payment method to continue.` |
| `testMode` | Shows or hides the test-mode badge. | `true` |
| `merchantName` | Small merchant label in the widget header. | `Example merchant` |

## Styling

The widget uses `.piw-*` class names to keep its styles separate from the host page.

The current stylesheet is still part of the demo app, but the class naming is designed so the widget can later be moved into a standalone CSS file if needed.

## Current limitations

This is still a starter kit, not a production payment package.

Before live use, it would need webhook verification, order records, better validation, rate limiting, deployment hardening, and a proper fulfilment flow.
