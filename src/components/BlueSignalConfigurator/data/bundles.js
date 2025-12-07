// BlueSignal Product Bundles
// Pre-configured packages for common deployment scenarios

export const BUNDLES = {
  "starter-pond": {
    id: "starter-pond",
    name: "Starter Pond Package",
    description: "Entry-level monitoring + treatment for small ponds (< 1 acre)",
    products: [
      { productId: "s-ac", quantity: 1 },
    ],
    discount: 0,
    features: [
      "Single AC-powered unit",
      "100W ultrasonic treatment",
      "3 water quality sensors",
      "Ideal for backyard ponds",
    ],
  },
  "pond-pro": {
    id: "pond-pro",
    name: "Pond Pro Package",
    description: "Off-grid monitoring + treatment for medium ponds (1-5 acres)",
    products: [
      { productId: "s-sol", quantity: 1 },
      { productId: "s-mon", quantity: 1 },
    ],
    discount: 5,
    features: [
      "1 solar-powered treatment unit",
      "1 monitoring-only station",
      "Dual-point water quality coverage",
      "Complete off-grid operation",
    ],
  },
  "lake-monitor": {
    id: "lake-monitor",
    name: "Lake Monitoring Package",
    description: "Comprehensive monitoring for lakes and reservoirs",
    products: [
      { productId: "smart-buoy", quantity: 2 },
      { productId: "s-mon", quantity: 1 },
    ],
    discount: 8,
    features: [
      "2 floating buoy platforms",
      "1 shore station",
      "5 sensors per buoy (10 total floating)",
      "Multi-point coverage",
    ],
  },
  "treatment-fleet": {
    id: "treatment-fleet",
    name: "Treatment Fleet",
    description: "Multi-zone algae control for large water bodies (10+ acres)",
    products: [
      { productId: "s-sol", quantity: 3 },
    ],
    discount: 10,
    features: [
      "3 solar-powered treatment units",
      "300W total ultrasonic power",
      "Full perimeter coverage",
      "Coordinated treatment zones",
    ],
  },
  "research-station": {
    id: "research-station",
    name: "Research Station",
    description: "Lab-grade monitoring for research and compliance",
    products: [
      { productId: "smart-buoy-xl", quantity: 1 },
      { productId: "s-mon", quantity: 2 },
    ],
    discount: 5,
    features: [
      "8+ Atlas Scientific sensors",
      "Chlorophyll-a fluorometer",
      "Phycocyanin detector",
      "Shore reference stations",
    ],
  },
  "municipal-basic": {
    id: "municipal-basic",
    name: "Municipal Basic",
    description: "Essential package for municipal water treatment",
    products: [
      { productId: "s-ac", quantity: 3 },
      { productId: "s-mon", quantity: 1 },
    ],
    discount: 12,
    features: [
      "3 AC-powered treatment units",
      "1 solar monitoring station",
      "Suitable for treatment ponds",
      "Grid-powered reliability",
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
