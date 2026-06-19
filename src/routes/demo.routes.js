const express = require('express');
const crypto = require('crypto');
const { getProduct, formatAmount } = require('../data/products');

const router = express.Router();

router.post('/complete-checkout', (req, res) => {
  try {
    const product = getProduct(req.body.productId);
    const demoOrderId = `demo_${crypto.randomUUID()}`;

    res.json({
      provider: 'demo',
      status: 'simulated_success',
      orderId: demoOrderId,
      product: {
        id: product.id,
        name: product.name,
        amount: formatAmount(product),
        currency: product.currency.toUpperCase()
      },
      url: `/success.html?provider=demo&demo_order_id=${encodeURIComponent(demoOrderId)}&status=simulated_success`
    });
  } catch (error) {
    res.status(400).json({
      error: 'Demo checkout could not be completed.',
      detail: error.message
    });
  }
});

module.exports = router;
