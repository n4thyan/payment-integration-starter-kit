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
    subtitle: 'Review the deposit and choose a payment method.',
    testMode: true,
    merchantName: 'Nathan May Web Projects'
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
          ${options.testMode ? '<span class="piw-mode">Sandbox checkout</span>' : ''}
        </header>

        <div class="piw-title-row">
          <div>
            <h2>${options.title}</h2>
            <p>${options.subtitle}</p>
          </div>
        </div>

        <div class="piw-order" aria-live="polite">
          <div class="piw-order-line piw-order-line-main">
            <span>
              <small>Item</small>
              <strong data-role="product-name">Loading item</strong>
            </span>
            <span class="piw-order-price">
              <strong data-role="product-price">--</strong>
              <small data-role="product-currency">GBP</small>
            </span>
          </div>
          <p data-role="product-description">Checking checkout setup.</p>
        </div>

        <div class="piw-methods" aria-label="Payment methods">
          <div class="piw-method" data-role="stripe-method" data-state="checking">
            <div class="piw-method-copy">
              <span class="piw-method-title">Card</span>
              <span class="piw-method-note" data-role="stripe-note">Checking card checkout.</span>
            </div>
            <span class="piw-method-state" data-role="stripe-state">Checking</span>
          </div>

          <button class="piw-stripe-button" data-role="stripe-button" type="button" disabled>
            Continue to card checkout
          </button>

          <div class="piw-method" data-role="paypal-method" data-state="checking">
            <div class="piw-method-copy">
              <span class="piw-method-title">PayPal</span>
              <span class="piw-method-note" data-role="paypal-note">Checking PayPal checkout.</span>
            </div>
            <span class="piw-method-state" data-role="paypal-state">Checking</span>
          </div>

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

  function setMethodState(root, provider, state, note, label) {
    const method = root.querySelector(`[data-role="${provider}-method"]`);
    const methodNote = root.querySelector(`[data-role="${provider}-note"]`);
    const methodState = root.querySelector(`[data-role="${provider}-state"]`);

    if (method) method.dataset.state = state;
    if (methodNote) methodNote.textContent = note;
    if (methodState) methodState.textContent = label;
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
      stripeButton.dataset.loading = 'true';

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
        delete stripeButton.dataset.loading;
      }
    }

    async function setupStripe(providerStatus) {
      if (!providerStatus.stripeConfigured) {
        stripeButton.disabled = true;
        stripeButton.title = 'Card checkout is not enabled.';
        setMethodState(root, 'stripe', 'disabled', 'Server credentials are missing.', 'Off');
        return false;
      }

      stripeButton.disabled = false;
      stripeButton.addEventListener('click', startStripeCheckout);
      setMethodState(root, 'stripe', 'ready', 'Redirects to a Stripe-hosted test checkout.', 'Ready');
      return true;
    }

    async function setupPayPal() {
      const config = await fetchJson(joinUrl(options.apiBase, options.paypalConfigEndpoint));

      if (!config.configured) {
        paypalContainer.hidden = true;
        setMethodState(root, 'paypal', 'disabled', 'PayPal sandbox is not configured.', 'Off');
        return false;
      }

      setMethodState(root, 'paypal', 'ready', 'Uses the PayPal sandbox button flow.', 'Ready');
      paypalContainer.hidden = false;

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
      const stripeReady = await setupStripe(health.config || {});
      const paypalReady = await setupPayPal();

      if (!stripeReady && !paypalReady) {
        setStatus(root, 'No payment methods are enabled yet. Add sandbox credentials to test the widget.');
      } else if (stripeReady && paypalReady) {
        setStatus(root, 'Card and PayPal sandbox checkout are ready.');
      } else if (stripeReady) {
        setStatus(root, 'Card checkout is ready. PayPal is off for this run.');
      } else {
        setStatus(root, 'PayPal checkout is ready. Card checkout is off for this run.');
      }
    } catch (error) {
      stripeButton.disabled = true;
      paypalContainer.hidden = true;
      setMethodState(root, 'stripe', 'disabled', 'Could not check card checkout.', 'Error');
      setMethodState(root, 'paypal', 'disabled', 'Could not check PayPal checkout.', 'Error');
      setStatus(root, error.message, 'error');
    }
  }

  window.PaymentIntegrationWidget = { mount };
}());
