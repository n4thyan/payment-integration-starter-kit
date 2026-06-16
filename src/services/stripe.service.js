const Stripe = require('stripe');
const { config, assertProviderConfigured } = require('../config/env');
const { getProduct } = require('../data/products');

let stripeClient;

function getStripeClient() {
  assertProviderConfigured('stripe');

  if (!stripeClient) {
    stripeClient = Stripe(config.stripe.secretKey);
  }

  return stripeClient;
}

async function createCheckoutSession(productId) {
  const product = getProduct(productId);
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description
          },
          unit_amount: product.unitAmount
        },
        quantity: 1
      }
    ],
    success_url: `${config.appBaseUrl}/success.html?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.appBaseUrl}/cancel.html?provider=stripe`,
    metadata: {
      product_id: product.id
    }
  });

  return session;
}

module.exports = {
  createCheckoutSession
};
