/**
 * JSON-LD Schema Generators for SEO
 *
 * These functions generate structured data for Google rich results.
 * See: https://developers.google.com/search/docs/advanced/structured-data
 */

/**
 * Organization Schema - for company pages
 */
export const createOrganizationSchema = ({
  name,
  url,
  logo,
  description,
  sameAs = [],
  contactPoint,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name,
  url,
  logo,
  description,
  sameAs,
  ...(contactPoint && {
    contactPoint: {
      '@type': 'ContactPoint',
      ...contactPoint,
    },
  }),
});

/**
 * WebSite Schema - for homepage with search
 */
export const createWebSiteSchema = ({
  name,
  url,
  description,
  searchUrl,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  url,
  description,
  ...(searchUrl && {
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    },
  }),
});

/**
 * Product Schema - for product pages
 */
export const createProductSchema = ({
  name,
  description,
  image,
  brand,
  sku,
  price,
  currency = 'USD',
  availability = 'InStock',
  url,
  reviewCount,
  ratingValue,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  image,
  brand: {
    '@type': 'Brand',
    name: brand,
  },
  ...(sku && { sku }),
  offers: {
    '@type': 'Offer',
    price: price?.toString(),
    priceCurrency: currency,
    availability: `https://schema.org/${availability}`,
    url,
  },
  ...(reviewCount && ratingValue && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    },
  }),
});

/**
 * Service Schema - for service pages
 */
export const createServiceSchema = ({
  name,
  description,
  provider,
  areaServed,
  serviceType,
  url,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: provider,
  },
  ...(areaServed && { areaServed }),
  ...(serviceType && { serviceType }),
  url,
});

/**
 * BreadcrumbList Schema - for navigation breadcrumbs
 */
export const createBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * FAQPage Schema - for FAQ sections
 */
export const createFAQSchema = (questions) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer,
    },
  })),
});

/**
 * LocalBusiness Schema - for location-based businesses
 */
export const createLocalBusinessSchema = ({
  name,
  description,
  url,
  telephone,
  email,
  address,
  geo,
  openingHours,
  image,
  priceRange,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name,
  description,
  url,
  ...(telephone && { telephone }),
  ...(email && { email }),
  ...(address && {
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
  }),
  ...(geo && {
    geo: {
      '@type': 'GeoCoordinates',
      ...geo,
    },
  }),
  ...(openingHours && { openingHoursSpecification: openingHours }),
  ...(image && { image }),
  ...(priceRange && { priceRange }),
});

/**
 * SoftwareApplication Schema - for software products
 */
export const createSoftwareApplicationSchema = ({
  name,
  description,
  applicationCategory,
  operatingSystem,
  offers,
  aggregateRating,
  url,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  description,
  applicationCategory,
  ...(operatingSystem && { operatingSystem }),
  ...(offers && {
    offers: {
      '@type': 'Offer',
      ...offers,
    },
  }),
  ...(aggregateRating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ...aggregateRating,
    },
  }),
  url,
});

/**
 * ItemList Schema - for listing pages (marketplace, registry, etc.)
 */
export const createItemListSchema = ({
  name,
  description,
  url,
  items,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  description,
  url,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: item.url,
    name: item.name,
  })),
});

// Pre-built schemas for WaterQuality.Trading
export const WQT_ORGANIZATION_SCHEMA = createOrganizationSchema({
  name: 'WaterQuality.Trading',
  url: 'https://waterquality.trading',
  logo: 'https://waterquality.trading/logo.png',
  description: 'B2B marketplace for water quality credit trading. Buy, sell, and verify nutrient credits, stormwater credits, and thermal credits.',
  sameAs: [
    'https://linkedin.com/company/waterqualitytrading',
  ],
});

export const WQT_WEBSITE_SCHEMA = createWebSiteSchema({
  name: 'WaterQuality.Trading',
  url: 'https://waterquality.trading',
  description: 'B2B marketplace for water quality credit trading',
  searchUrl: 'https://waterquality.trading/marketplace?q={search_term_string}',
});

// Pre-built schemas for BlueSignal
export const BLUESIGNAL_ORGANIZATION_SCHEMA = createOrganizationSchema({
  name: 'BlueSignal',
  url: 'https://bluesignal.xyz',
  logo: 'https://bluesignal.xyz/logo.png',
  description: 'Smart water quality monitoring systems. Real-time sensors, smart buoys, and cloud analytics for lakes, ponds, and watersheds.',
  sameAs: [
    'https://linkedin.com/company/bluesignal',
  ],
});

export const BLUESIGNAL_WEBSITE_SCHEMA = createWebSiteSchema({
  name: 'BlueSignal',
  url: 'https://bluesignal.xyz',
  description: 'Water quality monitoring systems and smart buoys',
});

export const SALES_WEBSITE_SCHEMA = createWebSiteSchema({
  name: 'BlueSignal Sales Portal',
  url: 'https://sales.bluesignal.xyz',
  description: 'Configure, quote, and manage BlueSignal water quality device installations',
});
