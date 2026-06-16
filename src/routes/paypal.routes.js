const express = require('express');
const { config, getPublicConfigStatus } = require('../config/env');
const { createPayPalOrder, capturePayPalOrder } = require('../services/paypal.service');

const router = express.Router();

router.get('/config', (req, res) => {
  const status = getPublicConfigStatus();

  res.json({
    clientId: status.paypalClientIdAvailable ? config.paypal.clientId : '',
    currency: config.paypal.currency,
    configured: status.paypalConfigured
  });
});

router.post('/create-order', async (req, res) => {
  try {
    const order = await createPayPalOrder(req.body.productId);

    res.json({
      id: order.id,
      status: order.status
    });
  } catch (error) {
    console.error('[paypal] create order failed:', error.message);

    res.status(500).json({
      error: 'PayPal order could not be created.',
      detail: error.message
    });
  }
});

router.post('/capture-order/:orderId', async (req, res) => {
  try {
    const capture = await capturePayPalOrder(req.params.orderId);

    res.json({
      id: capture.id,
      status: capture.status,
      payer: capture.payer || null
    });
  } catch (error) {
    console.error('[paypal] capture order failed:', error.message);

    res.status(500).json({
      error: 'PayPal order could not be captured.',
      detail: error.message
    });
  }
});

module.exports = router;
