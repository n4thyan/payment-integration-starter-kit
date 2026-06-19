const path = require('path');
const express = require('express');
const { config } = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const productRoutes = require('./routes/products.routes');
const stripeRoutes = require('./routes/stripe.routes');
const paypalRoutes = require('./routes/paypal.routes');
const demoRoutes = require('./routes/demo.routes');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(express.static(publicPath));

app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/demo', demoRoutes);

app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(publicPath, 'error.html'));
    return;
  }

  res.status(404).json({
    error: 'Route not found.',
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  console.error('[server] unhandled error:', error.message);

  res.status(500).json({
    error: 'Unexpected server error.',
    detail: config.nodeEnv === 'production' ? undefined : error.message
  });
});

app.listen(config.port, () => {
  console.log(`Payment Integration Starter Kit running on ${config.appBaseUrl}`);
});
