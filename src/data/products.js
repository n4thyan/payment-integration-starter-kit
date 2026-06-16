const products = {
  websiteDeposit: {
    id: 'website-deposit',
    name: 'Starter Website Deposit',
    description: 'Example service deposit for testing one-off checkout flows.',
    unitAmount: 2500,
    currency: 'gbp'
  }
};

function getProduct(productId = 'website-deposit') {
  const product = Object.values(products).find((item) => item.id === productId);

  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }

  return product;
}

function formatAmount(product) {
  return (product.unitAmount / 100).toFixed(2);
}

function getPublicProduct(productId = 'website-deposit') {
  const product = getProduct(productId);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    amount: formatAmount(product),
    currency: product.currency.toUpperCase()
  };
}

module.exports = {
  products,
  getProduct,
  getPublicProduct,
  formatAmount
};
