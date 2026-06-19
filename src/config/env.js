const path = require('path');
const dotenv = require('dotenv');


dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function toInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const port = toInteger(process.env.PORT, 4242);

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${port}`,
  demo: {
    enabled: process.env.DEMO_CHECKOUT_ENABLED !== 'false'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    currency: (process.env.STRIPE_CURRENCY || 'gbp').toLowerCase()
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    baseUrl: process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com',
    currency: (process.env.PAYPAL_CURRENCY || 'GBP').toUpperCase()
  }
};

function isPlaceholder(value) {
  if (!value) return true;
  return value.includes('replace_me') || value.includes('your_') || value.includes('example');
}

function assertProviderConfigured(provider) {
  if (provider === 'stripe' && isPlaceholder(config.stripe.secretKey)) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in your .env file.');
  }

  if (provider === 'paypal') {
    if (isPlaceholder(config.paypal.clientId) || isPlaceholder(config.paypal.clientSecret)) {
      throw new Error('PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.');
    }
  }
}

function getPublicConfigStatus() {
  return {
    demoConfigured: config.demo.enabled,
    stripeConfigured: !isPlaceholder(config.stripe.secretKey),
    paypalConfigured: !isPlaceholder(config.paypal.clientId) && !isPlaceholder(config.paypal.clientSecret),
    paypalClientIdAvailable: !isPlaceholder(config.paypal.clientId),
    currency: {
      stripe: config.stripe.currency,
      paypal: config.paypal.currency
    }
  };
}

module.exports = {
  config,
  assertProviderConfigured,
  getPublicConfigStatus
};
