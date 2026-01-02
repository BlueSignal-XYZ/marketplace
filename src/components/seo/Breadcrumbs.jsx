/**
 * Breadcrumbs Component with JSON-LD Schema
 *
 * Renders accessible breadcrumb navigation with structured data for SEO.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { createBreadcrumbSchema } from './schemas';

/**
 * Get base URL for current site
 */
const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'https://waterquality.trading';

  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const appMode = params.get('app');

  // Cloud mode check first
  if (appMode === 'cloud' || hostname.includes('cloud')) {
    return 'https://cloud.bluesignal.xyz';
  }

  // Sales mode: bluesignal.xyz (primary) or sales.bluesignal.xyz (legacy)
  if (appMode === 'sales' ||
      hostname === 'bluesignal.xyz' ||
      hostname === 'www.bluesignal.xyz' ||
      hostname.includes('sales')) {
    return 'https://bluesignal.xyz';
  }

  return 'https://waterquality.trading';
};

/**
 * Breadcrumbs Component
 */
const Breadcrumbs = ({ items, className }) => {
  const baseUrl = getBaseUrl();

  // Build schema items with full URLs
  const schemaItems = items.map((item) => ({
    name: item.label,
    url: item.path.startsWith('http') ? item.path : `${baseUrl}${item.path}`,
  }));

  const schema = createBreadcrumbSchema(schemaItems);

  return (
    <>
      {/* JSON-LD Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <BreadcrumbNav aria-label="Breadcrumb" className={className}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <BreadcrumbItem key={item.path}>
                {isLast ? (
                  <BreadcrumbCurrent aria-current="page">
                    {item.label}
                  </BreadcrumbCurrent>
                ) : (
                  <>
                    <BreadcrumbLink to={item.path}>
                      {item.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator aria-hidden="true">/</BreadcrumbSeparator>
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </BreadcrumbNav>
    </>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

// Styled Components
const BreadcrumbNav = styled.nav`
  padding: 12px 0;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
`;

const BreadcrumbLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #0ea5e9;
    text-decoration: underline;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: #1e293b;
  font-weight: 500;
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
  color: #cbd5e1;
  user-select: none;
`;

export default Breadcrumbs;

/**
 * Hook to generate breadcrumb items from current path
 */
export const useBreadcrumbs = (customLabels = {}) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Default labels for common paths
  const defaultLabels = {
    marketplace: 'Marketplace',
    registry: 'Registry',
    map: 'Map',
    'recent-removals': 'Recent Removals',
    certificate: 'Certificate',
    listing: 'Listing',
    dashboard: 'Dashboard',
    cloud: 'Cloud',
    devices: 'Devices',
    sites: 'Sites',
    alerts: 'Alerts',
    tools: 'Tools',
    configurator: 'Product Configurator',
    enclosure: 'Enclosure',
    sales: 'Sales',
    presale: 'Presale',
    ...customLabels,
  };

  // Build breadcrumb items
  const items = [{ label: 'Home', path: '/' }];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Skip dynamic segments like IDs
    const label = defaultLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    items.push({
      label,
      path: currentPath,
    });
  });

  return items;
};
