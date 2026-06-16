(function () {
  const DEFAULT_OPTIONS = {
    apiBase: '',
    productId: 'website-deposit',
    productEndpoint: '/api/products/default',
    stripeEndpoint: '/api/stripe/create-checkout-session',
    healthEndpoint: '/api/health',
    paypalConfigEndpoint: '/api/paypal/config',
    paypalCreateOrderEndpoint: '/api/paypal/create-order',
    paypalCaptureOrderEndpoint: '/api/paypal/capture-order',
    title: 'Checkout',
    subtitle: 'Choose a payment method to continue.',
    testMode: true,
    merchantName: 'Example merchant'
  };

  let instanceCount = 0;

  function resolveElement(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  }

  function joinUrl(apiBase, path) {
    if (!apiBase) return path;
    return `${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
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

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);

      if (existingScript) {
        if (window.paypal) {
          resolve();
          return;
        }

        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', () => reject(new Error('PayPal SDK could not be loaded.')), { once: true });
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

  function renderShell(options, instanceId) {
    return `
      <section class="piw-widget" aria-label="Payment widget">
        <header class="piw-head">
          <span class="piw-merchant">${options.merchantName}</span>
          ${options.testMode ? '<span class="piw-mode">Sandbox</span>' : ''}
        </header>

        <div class="piw-title-row">
          <div>
            <h2>${options.title}</h2>
            <p>${options.subtitle}</p>
          </div>
        </div>

        <dl class="piw-summary" aria-live="polite">
          <div>
            <dt>Item</dt>
            <dd data-role="product-name">Loading item</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd><span data-role="product-price">--</span> <small data-role="product-currency">GBP</small></dd>
          </div>
        </dl>

        <p class="piw-description" data-role="product-description">Checking checkout setup.</p>

        <div class="piw-actions">
          <button class="piw-stripe-button" data-role="stripe-button" type="button">
            <span>Pay by card</span>
            <small>Stripe</small>
          </button>

          <div class="piw-divider"><span>or</span></div>
          <div class="piw-paypal-slot" id="${instanceId}-paypal" data-role="paypal-container"></div>
        </div>

        <p class="piw-status" data-role="status" role="status">Loading checkout options.</p>
      </section>
    `;
  }

  function setStatus(root, message, type = 'info') {
    const status = root.querySelector('[data-role="status"]');
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type;
  }

  function setProduct(root, product) {
    root.querySelector('[data-role="product-name"]').textContent = product.name;
    root.querySelector('[data-role="product-description"]').textContent = product.description || 'One-off checkout item.';
    root.querySelector('[data-role="product-price"]').textContent = formatPrice(product.amount, product.currency);
    root.querySelector('[data-role="product-currency"]').textContent = product.currency;
  }

  async function mount(target, userOptions = {}) {
    const host = resolveElement(target);

    if (!host) {
      throw new Error('Payment widget host element was not found.');
    }

    const options = { ...DEFAULT_OPTIONS, ...userOptions };
    const instanceId = `payment-widget-${++instanceCount}`;

    host.innerHTML = renderShell(options, instanceId);
    const root = host.querySelector('.piw-widget');
    const stripeButton = root.querySelector('[data-role="stripe-button"]');
    const paypalContainer = root.querySelector('[data-role="paypal-container"]');

    async function startStripeCheckout() {
      setStatus(root, 'Starting card checkout.');
      stripeButton.disabled = true;

      try {
        const data = await fetchJson(joinUrl(options.apiBase, options.stripeEndpoint), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId: options.productId })
        });

        if (!data.url) {
          throw new Error('Stripe returned no Checkout URL.');
        }

        window.location.href = data.url;
      } catch (error) {
        setStatus(root, error.message, 'error');
        stripeButton.disabled = false;
      }
    }

    async function setupStripe(providerStatus) {
      if (!providerStatus.stripeConfigured) {
        stripeButton.disabled = true;
        stripeButton.title = 'Stripe is not enabled.';
        return;
      }

      stripeButton.addEventListener('click', startStripeCheckout);
    }

    async function setupPayPal() {
      const config = await fetchJson(joinUrl(options.apiBase, options.paypalConfigEndpoint));

      if (!config.configured) {
        paypalContainer.innerHTML = '<p class="piw-provider-note">PayPal is not enabled for this checkout.</p>';
        return false;
      }

      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(config.clientId)}&currency=${encodeURIComponent(config.currency)}&components=buttons`;
      await loadScript(sdkUrl);

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          shape: 'rect',
          label: 'paypal',
          height: 44
        },
        createOrder: async () => {
          setStatus(root, 'Creating PayPal order.');

          const order = await fetchJson(joinUrl(options.apiBase, options.paypalCreateOrderEndpoint), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: options.productId })
          });

          if (!order.id) {
            throw new Error('PayPal returned no order ID.');
          }

          return order.id;
        },
        onApprove: async (data) => {
          setStatus(root, 'Capturing PayPal order.');

          const capture = await fetchJson(joinUrl(options.apiBase, `${options.paypalCaptureOrderEndpoint}/${data.orderID}`), {
            method: 'POST'
          });

          window.location.href = `/success.html?provider=paypal&order_id=${encodeURIComponent(capture.id)}&status=${encodeURIComponent(capture.status)}`;
        },
        onCancel: () => {
          window.location.href = '/cancel.html?provider=paypal';
        },
        onError: (error) => {
          setStatus(root, error.message || 'PayPal checkout failed.', 'error');
        }
      }).render(`#${instanceId}-paypal`);

      return true;
    }

    try {
      const [product, health] = await Promise.all([
        fetchJson(joinUrl(options.apiBase, options.productEndpoint)),
        fetchJson(joinUrl(options.apiBase, options.healthEndpoint))
      ]);

      setProduct(root, product);
      await setupStripe(health.config || {});
      const paypalReady = await setupPayPal();

      if (stripeButton.disabled && !paypalReady) {
        setStatus(root, 'No payment methods are enabled yet.');
      } else {
        setStatus(root, 'Ready for sandbox checkout.');
      }
    } catch (error) {
      stripeButton.disabled = true;
      paypalContainer.innerHTML = '<p class="piw-provider-note">Checkout setup could not be completed.</p>';
      setStatus(root, error.message, 'error');
    }
  }

  window.PaymentIntegrationWidget = { mount };
}());
