/**
 * SEOHead - Universal SEO component for dynamic meta tag management
 *
 * Handles:
 * - Title and description meta tags
 * - Open Graph (Facebook, LinkedIn) meta tags
 * - Twitter Card meta tags
 * - Canonical URLs
 * - JSON-LD structured data
 * - Robots directives
 */

import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEO configuration for each site
 */
const SITE_CONFIG = {
  'waterquality.trading': {
    siteName: 'WaterQuality.Trading',
    defaultImage: 'https://waterquality.trading/social/wqt-preview.png',
    twitterHandle: '@WQTrading',
    baseUrl: 'https://waterquality.trading',
  },
  'cloud.bluesignal.xyz': {
    siteName: 'BlueSignal Cloud',
    defaultImage: 'https://cloud.bluesignal.xyz/social/cloud-preview.png',
    twitterHandle: '@BlueSignalHQ',
    baseUrl: 'https://cloud.bluesignal.xyz',
  },
  'bluesignal.xyz': {
    siteName: 'BlueSignal',
    defaultImage: 'https://bluesignal.xyz/bluesignal-logo.png',
    twitterHandle: '@BlueSignalHQ',
    baseUrl: 'https://bluesignal.xyz',
  },
};

/**
 * Detect current site based on hostname
 */
const getCurrentSite = () => {
  if (typeof window === 'undefined') return 'waterquality.trading';

  const hostname = window.location.hostname;

  // Check URL params for dev mode
  const params = new URLSearchParams(window.location.search);
  const appMode = params.get('app');

  // Cloud mode check first (explicit subdomain)
  if (appMode === 'cloud' || hostname.includes('cloud')) {
    return 'cloud.bluesignal.xyz';
  }

  // Sales mode: bluesignal.xyz (primary) or sales.bluesignal.xyz (legacy)
  if (appMode === 'sales' ||
      hostname === 'bluesignal.xyz' ||
      hostname === 'www.bluesignal.xyz' ||
      hostname.includes('sales')) {
    return 'bluesignal.xyz';
  }

  return 'waterquality.trading';
};

/**
 * SEOHead Component
 */
const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  noindex = false,
  keywords,
  author,
  publishedTime,
  modifiedTime,
}) => {
  const currentSite = getCurrentSite();
  const config = SITE_CONFIG[currentSite] || SITE_CONFIG['waterquality.trading'];

  // Build full title with site name
  const fullTitle = title.includes(config.siteName)
    ? title
    : `${title} | ${config.siteName}`;

  // Build canonical URL
  const fullCanonical = canonical?.startsWith('http')
    ? canonical
    : `${config.baseUrl}${canonical || '/'}`;

  // Use provided image or default
  const imageUrl = ogImage || config.defaultImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={config.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {config.twitterHandle && <meta name="twitter:site" content={config.twitterHandle} />}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonical: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.oneOf(['website', 'article', 'product', 'profile']),
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  noindex: PropTypes.bool,
  keywords: PropTypes.string,
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
};

export default SEOHead;
