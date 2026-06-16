const { config, assertProviderConfigured } = require('../config/env');
const { getProduct, formatAmount } = require('../data/products');

async function parsePayPalResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    return { raw: text };
  }
}

async function requestPayPalAccessToken() {
  assertProviderConfigured('paypal');

  const credentials = Buffer.from(`${config.paypal.clientId}:${config.paypal.clientSecret}`).toString('base64');

  const response = await fetch(`${config.paypal.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await parsePayPalResponse(response);

  if (!response.ok) {
    throw new Error(data.error_description || data.message || 'Unable to request PayPal access token.');
  }

  return data.access_token;
}

async function createPayPalOrder(productId) {
  const product = getProduct(productId);
  const accessToken = await requestPayPalAccessToken();

  const response = await fetch(`${config.paypal.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: product.id,
          description: product.description,
          amount: {
            currency_code: product.currency.toUpperCase(),
            value: formatAmount(product)
          }
        }
      ]
    })
  });

  const data = await parsePayPalResponse(response);

  if (!response.ok) {
    throw new Error(data.message || data.name || 'Unable to create PayPal order.');
  }

  return data;
}

async function capturePayPalOrder(orderId) {
  if (!orderId) {
    throw new Error('PayPal order ID is required.');
  }

  const accessToken = await requestPayPalAccessToken();

  const response = await fetch(`${config.paypal.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await parsePayPalResponse(response);

  if (!response.ok) {
    throw new Error(data.message || data.name || 'Unable to capture PayPal order.');
  }

  return data;
}

module.exports = {
  createPayPalOrder,
  capturePayPalOrder
};