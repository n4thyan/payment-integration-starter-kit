const productId = 'website-deposit';

const statusMessage = document.querySelector('#status-message');
const stripeButton = document.querySelector('#stripe-button');
const paypalContainer = document.querySelector('#paypal-button-container');
const productPrice = document.querySelector('#product-price');
const productCurrency = document.querySelector('#product-currency');

function setStatus(message, type = 'info') {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}

function formatPrice(amount, currency) {
  const numericAmount = Number.parseFloat(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency
  }).format(numericAmount);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.error || `Request failed: ${response.status}`);
  }

  return data;
}

async function loadProduct() {
  const product = await fetchJson('/api/products/default');

  productPrice.textContent = formatPrice(product.amount, product.currency);
  productCurrency.textContent = product.currency;
}

async function loadProviderStatus() {
  const health = await fetchJson('/api/health');
  const providerStatus = health.config || {};

  if (!providerStatus.stripeConfigured) {
    stripeButton.disabled = true;
    stripeButton.title = 'Add STRIPE_SECRET_KEY to .env to enable Stripe checkout.';
  }

  return providerStatus;
}

async function startStripeCheckout() {
  setStatus('Starting Stripe checkout...');
  stripeButton.disabled = true;

  try {
    const data = await fetchJson('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });

    if (!data.url) {
      throw new Error('Stripe returned no Checkout URL.');
    }

    window.location.href = data.url;
  } catch (error) {
    setStatus(error.message, 'error');
    stripeButton.disabled = false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('PayPal SDK could not be loaded.'));
    document.body.appendChild(script);
  });
}

async function setupPayPal() {
  const config = await fetchJson('/api/paypal/config');

  if (!config.configured) {
    paypalContainer.innerHTML = '<p class="provider-note">Add PayPal sandbox client ID and secret to enable this button.</p>';
    return;
  }

  const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(config.clientId)}&currency=${encodeURIComponent(config.currency)}&components=buttons`;
  await loadScript(sdkUrl);

  window.paypal.Buttons({
    style: {
      layout: 'vertical',
      shape: 'rect',
      label: 'paypal'
    },
    createOrder: async () => {
      setStatus('Creating PayPal order...');

      const order = await fetchJson('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });

      if (!order.id) {
        throw new Error('PayPal returned no order ID.');
      }

      return order.id;
    },
    onApprove: async (data) => {
      setStatus('Capturing PayPal order...');

      const capture = await fetchJson(`/api/paypal/capture-order/${data.orderID}`, {
        method: 'POST'
      });

      window.location.href = `/success.html?provider=paypal&order_id=${encodeURIComponent(capture.id)}&status=${encodeURIComponent(capture.status)}`;
    },
    onCancel: () => {
      window.location.href = '/cancel.html?provider=paypal';
    },
    onError: (error) => {
      setStatus(error.message || 'PayPal checkout failed.', 'error');
    }
  }).render('#paypal-button-container');
}

async function init() {
  stripeButton.addEventListener('click', startStripeCheckout);

  try {
    await loadProduct();
    await loadProviderStatus();
    await setupPayPal();

    if (stripeButton.disabled) {
      setStatus('Add test and sandbox credentials to enable both providers.');
    } else {
      setStatus('Ready. Use test and sandbox credentials only.');
    }
  } catch (error) {
    paypalContainer.innerHTML = '<p class="provider-note">Provider setup could not be completed.</p>';
    setStatus(error.message, 'error');
  }
}

init();