// BlueSignal Product Bundles
// Pre-configured packages for common deployment scenarios

export const BUNDLES = {
  'single-monitor': {
    id: 'single-monitor',
    name: 'Single Monitor',
    description: 'Single WQM-1 for one monitoring site',
    products: [{ productId: 'wqm-1', quantity: 1 }],
    discount: 0,
    features: [
      '1× WQM-1 6-channel monitor',
      '6 water quality parameters',
      'LoRaWAN connectivity (15 km)',
      'Cloud dashboard ($9.99/mo)',
    ],
  },
  'multi-site': {
    id: 'multi-site',
    name: 'Multi-Site Package',
    description: '3 WQM-1 units for distributed monitoring across a property',
    products: [{ productId: 'wqm-1', quantity: 3 }],
    discount: 10,
    features: [
      '3× WQM-1 6-channel monitors',
      'Multi-point water quality coverage',
      'Shared LoRaWAN gateway',
      'Unified cloud dashboard',
    ],
  },
  fleet: {
    id: 'fleet',
    name: 'Fleet Deployment',
    description: '5 WQM-1 units for comprehensive site coverage',
    products: [{ productId: 'wqm-1', quantity: 5 }],
    discount: 15,
    features: [
      '5× WQM-1 6-channel monitors',
      'Full-site coverage',
      'Volume discount',
      'Priority support',
    ],
  },
};

// Calculate bundle pricing
export const calculateBundlePrice = (bundle, products) => {
  const subtotal = bundle.products.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const discount = subtotal * (bundle.discount / 100);
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    discountPercent: bundle.discount,
    total,
  };
};

export default BUNDLES;
