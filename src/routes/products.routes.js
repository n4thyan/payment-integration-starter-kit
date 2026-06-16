const express = require('express');
const { getPublicProduct } = require('../data/products');

const router = express.Router();

router.get('/default', (req, res) => {
  try {
    res.json(getPublicProduct());
  } catch (error) {
    res.status(404).json({
      error: 'Product could not be found.',
      detail: error.message
    });
  }
});

module.exports = router;
