const express = require('express');
const { getPublicConfigStatus } = require('../config/env');
const { getPublicProduct } = require('../data/products');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    project: 'payment-integration-starter-kit',
    config: getPublicConfigStatus(),
    product: getPublicProduct()
  });
});

module.exports = router;
