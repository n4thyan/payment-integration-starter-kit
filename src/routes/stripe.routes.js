const express = require('express');
const { createCheckoutSession } = require('../services/stripe.service');

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await createCheckoutSession(req.body.productId);

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('[stripe] create checkout session failed:', error.message);

    res.status(500).json({
      error: 'Stripe checkout could not be started.',
      detail: error.message
    });
  }
});

module.exports = router;
