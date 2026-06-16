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

async function loadProduct() {
  const response = await fetch('/api/products/default');

  if (!response.ok) {
    throw new Error('Product details could not be loaded.');
  }

  const product = await response.json();

  productPrice.textContent = formatPrice(product.amount, product.currency);
  productCurrency.textContent = product.currency;
}

async function startStripeCheckout() {
  setStatus('Starting Stripe checkout...');
  stripeButton.disabled = true;

  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data.detail || data.error || 'Stripe checkout could not be started.');
    }

    window.location.href = data.url;
  } catch (error) {
    setStatus(error.message, 'error');
    stripeButton.disabled = false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('PayPal SDK could not be loaded.'));
    document.body.appendChild(script);
  });
}

async function setupPayPal() {
  const response = await fetch('/api/paypal/config');
  const config = await response.json();

  if (!config.clientId) {
    paypalContainer.innerHTML = '<p class="provider-note">Add PayPal sandbox credentials to enable this button.</p>';
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

      const orderResponse = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });

      const order = await orderResponse.json();

      if (!orderResponse.ok || !order.id) {
        throw new Error(order.detail || order.error || 'PayPal order could not be created.');
      }

      return order.id;
    },
    onApprove: async (data) => {
      setStatus('Capturing PayPal order...');

      const captureResponse = await fetch(`/api/paypal/capture-order/${data.orderID}`, {
        method: 'POST'
      });

      const capture = await captureResponse.json();

      if (!captureResponse.ok) {
        throw new Error(capture.detail || capture.error || 'PayPal order could not be captured.');
      }

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
  try {
    await loadProduct();
  } catch (error) {
    setStatus(error.message, 'error');
  }

  stripeButton.addEventListener('click', startStripeCheckout);

  try {
    await setupPayPal();
    setStatus('Ready. Use sandbox or test credentials only.');
  } catch (error) {
    paypalContainer.innerHTML = '<p class="provider-note">PayPal button could not be loaded.</p>';
    setStatus(error.message, 'error');
  }
}

init();
