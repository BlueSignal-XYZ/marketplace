// ProductCatalogSection - Unified product catalog for the sales portal
import React, { useState, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { salesTheme } from "../styles/theme";
import { PRODUCTS, BUNDLES, calculateBundlePrice } from "../data";
import BundlesSection from "./BundlesSection";
import { AddToQuoteBtn } from "./QuoteBuilder";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CatalogSection = styled.section`
  background: ${salesTheme.colors.bgSurface};
  padding: 100px 24px;
  position: relative;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 80px 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const CatalogContainer = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin-bottom: 32px;
  }
`;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentSecondary};
  margin-bottom: 16px;
  padding: 6px 14px;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 100px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const SectionDescription = styled.p`
  font-size: 17px;
  color: ${salesTheme.colors.textMuted};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 15px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 40px;
  padding: 24px;
  background: ${salesTheme.colors.bgCard};
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${salesTheme.colors.border};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 160px;
  max-width: 220px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    max-width: none;
  }
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${salesTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SearchInput = styled.input`
  padding: 14px 18px;
  padding-left: 44px;
  border: 2px solid ${salesTheme.colors.border};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: ${salesTheme.colors.textDark};
  background: #fafbfc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 14px center;
  background-size: 18px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 14px 18px;
  border: 2px solid ${salesTheme.colors.border};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: ${salesTheme.colors.textDark};
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 44px;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const CompareButton = styled.button`
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => props.$active
    ? salesTheme.colors.accentSecondary
    : 'transparent'};
  border: 2px solid ${salesTheme.colors.accentSecondary};
  border-radius: 12px;
  color: ${props => props.$active
    ? '#ffffff'
    : salesTheme.colors.accentSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${props => props.$active
      ? salesTheme.colors.accentSecondaryHover
      : 'rgba(59, 130, 246, 0.08)'};
    transform: translateY(-1px);
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex: 1;
    justify-content: center;
  }
`;

const ClearButton = styled.button`
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  border: 2px solid ${salesTheme.colors.border};
  border-radius: 12px;
  color: ${salesTheme.colors.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: #f3f4f6;
    color: ${salesTheme.colors.textDark};
    border-color: #d1d5db;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex: 1;
    justify-content: center;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const ResultsCount = styled.span`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  font-weight: 500;

  strong {
    color: ${salesTheme.colors.textDark};
    font-weight: 700;
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${salesTheme.colors.textMuted};
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 48px;

  /* Large desktop (1280px+): 5 products in one row */
  @media (max-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }

  /* Tablet/small desktop (1024px-1280px): 4 products */
  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Tablet (768px-1024px): 2-3 products */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  /* Mobile (< 480px): 1 product per row */
  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: ${salesTheme.colors.bgCard};
  border: 2px solid ${props => props.$selected
    ? salesTheme.colors.accentSecondary
    : 'transparent'};
  border-radius: 24px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.4s ease-out;
  animation-fill-mode: both;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.05s; }
  &:nth-child(3) { animation-delay: 0.1s; }
  &:nth-child(4) { animation-delay: 0.15s; }
  &:nth-child(5) { animation-delay: 0.2s; }
  &:nth-child(6) { animation-delay: 0.25s; }
  &:nth-child(7) { animation-delay: 0.3s; }
  &:nth-child(8) { animation-delay: 0.35s; }

  &:hover {
    border-color: ${salesTheme.colors.accentSecondary};
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(59, 130, 246, 0.08);
  }

  ${props => props.$selected && `
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 12px 32px rgba(0, 0, 0, 0.1);
  `}
`;

const CardImageArea = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f0f9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid ${salesTheme.colors.border};

  svg {
    width: 64px;
    height: 64px;
    color: ${salesTheme.colors.accentPrimary};
    opacity: 0.6;
  }
`;

const DeploymentBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 100px;
  background: ${props => props.$type === 'floating'
    ? 'rgba(59, 130, 246, 0.15)'
    : 'rgba(16, 185, 129, 0.15)'};
  color: ${props => props.$type === 'floating'
    ? salesTheme.colors.accentSecondary
    : salesTheme.colors.accentPrimary};
`;

const CompareCheckbox = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.$checked
    ? salesTheme.colors.accentSecondary
    : 'rgba(255, 255, 255, 0.9)'};
  border: 2px solid ${props => props.$checked
    ? salesTheme.colors.accentSecondary
    : 'rgba(0, 0, 0, 0.1)'};
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  svg {
    width: 16px;
    height: 16px;
    color: #ffffff;
    opacity: ${props => props.$checked ? 1 : 0};
  }

  &:hover {
    transform: scale(1.05);
    border-color: ${salesTheme.colors.accentSecondary};
  }
`;

const CardContent = styled.div`
  padding: 20px;

  @media (max-width: 1400px) {
    padding: 18px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 4px;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const ProductSubtitle = styled.p`
  font-size: 12px;
  color: ${salesTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
  font-weight: 500;
`;

const ProductPrice = styled.div`
  font-size: clamp(24px, 2vw, 32px);
  font-weight: 800;
  color: ${salesTheme.colors.accentPrimary};
  font-family: ${salesTheme.typography.fontMono};
  margin-bottom: 4px;
  line-height: 1;
  letter-spacing: -0.02em;
`;

const PriceLabel = styled.span`
  font-size: 12px;
  color: ${salesTheme.colors.textMuted};
  font-weight: 500;
`;

const ProductTagline = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  line-height: 1.6;
  margin: 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductSpecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const SpecBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  background: ${props => {
    switch(props.$variant) {
      case 'ultrasonic': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'solar': return 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
      case 'sensors': return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.$variant) {
      case 'ultrasonic': return '#b45309';
      case 'solar': return '#15803d';
      case 'sensors': return '#1d4ed8';
      default: return '#6b7280';
    }
  }};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;

  > div {
    flex: 1;
  }

  button {
    width: 100%;
  }
`;

const ViewDetailsButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  border: 2px solid ${salesTheme.colors.border};
  border-radius: 10px;
  color: ${salesTheme.colors.textDark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${salesTheme.colors.accentSecondary};
    color: ${salesTheme.colors.accentSecondary};
    background: rgba(59, 130, 246, 0.04);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 80px 24px;
  background: ${salesTheme.colors.bgCard};
  border-radius: 24px;
  border: 1px solid ${salesTheme.colors.border};
  margin-bottom: 48px;

  svg {
    width: 64px;
    height: 64px;
    color: ${salesTheme.colors.textMuted};
    opacity: 0.4;
    margin-bottom: 24px;
  }

  h4 {
    font-size: 20px;
    font-weight: 700;
    color: ${salesTheme.colors.textDark};
    margin: 0 0 8px;
  }

  p {
    font-size: 15px;
    color: ${salesTheme.colors.textMuted};
    margin: 0 0 24px;
  }
`;

const QuoteModeBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  color: ${salesTheme.colors.textDark};

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

const QuoteModeText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  svg {
    width: 18px;
    height: 18px;
    color: ${salesTheme.colors.accentPrimary};
  }
`;

const ExitQuoteModeButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${salesTheme.colors.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${salesTheme.colors.textDark};
    border-color: #d1d5db;
  }
`;

export default function ProductCatalogSection({
  selectedProduct,
  onSelectProduct,
  compareMode,
  onToggleCompareMode,
  compareProducts,
  onToggleCompareProduct,
  quoteItems,
  onAddToQuote,
  showBundles,
  onToggleBundles,
  onAddBundle,
  isQuoteMode = false,
  onExitQuoteMode,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deploymentFilter, setDeploymentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");

  const filteredProducts = useMemo(() => {
    let products = Object.values(PRODUCTS)
      .filter((p) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            p.name.toLowerCase().includes(query) ||
            p.subtitle.toLowerCase().includes(query) ||
            p.tagline.toLowerCase().includes(query) ||
            p.features.some(f => f.toLowerCase().includes(query)) ||
            p.sensorList.some(s => s.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }

        // Deployment filter
        if (deploymentFilter !== "all" && p.deployment.toLowerCase() !== deploymentFilter) {
          return false;
        }

        // Price filter
        if (priceFilter !== "all") {
          if (priceFilter === "under1000" && p.price >= 1000) return false;
          if (priceFilter === "1000to3000" && (p.price < 1000 || p.price > 3000)) return false;
          if (priceFilter === "over3000" && p.price <= 3000) return false;
        }

        return true;
      });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        products.sort((a, b) => a.price - b.price);
    }

    return products;
  }, [searchQuery, deploymentFilter, priceFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setDeploymentFilter("all");
    setPriceFilter("all");
  };

  const isInQuote = (productId) => {
    return quoteItems?.some((item) => item.productId === productId);
  };

  const hasActiveFilters = searchQuery || deploymentFilter !== "all" || priceFilter !== "all";

  return (
    <CatalogSection id="products">
      <CatalogContainer>
        <SectionHeader>
          <SectionLabel>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Product Catalog
          </SectionLabel>
          <SectionTitle>Water Quality Monitoring Systems</SectionTitle>
          <SectionDescription>
            Browse our complete range of monitoring solutions. From DIY kits to turnkey systems,
            find the perfect fit for your water quality monitoring needs.
          </SectionDescription>
        </SectionHeader>

        {/* Quote Mode Indicator */}
        {isQuoteMode && (
          <QuoteModeBar>
            <QuoteModeText>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Quote Mode Active — Select products to add to your quote
            </QuoteModeText>
            {onExitQuoteMode && (
              <ExitQuoteModeButton onClick={onExitQuoteMode}>
                Exit Quote Mode
              </ExitQuoteModeButton>
            )}
          </QuoteModeBar>
        )}

        <FilterBar>
          <FilterGroup style={{ flex: 2, maxWidth: '300px' }}>
            <FilterLabel htmlFor="search">Search Products</FilterLabel>
            <SearchInput
              id="search"
              type="text"
              placeholder="Search by name, feature, or sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="deployment">Deployment Type</FilterLabel>
            <FilterSelect
              id="deployment"
              value={deploymentFilter}
              onChange={(e) => setDeploymentFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="shore-mounted">Shore-mounted</option>
              <option value="floating">Floating</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="price">Price Range</FilterLabel>
            <FilterSelect
              id="price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under $1,000</option>
              <option value="1000to3000">$1,000 - $3,000</option>
              <option value="over3000">Over $3,000</option>
            </FilterSelect>
          </FilterGroup>

          <FilterActions>
            <CompareButton
              $active={compareMode}
              onClick={onToggleCompareMode}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
              </svg>
              {compareMode ? "Exit Compare" : "Compare"}
            </CompareButton>

            {hasActiveFilters && (
              <ClearButton onClick={clearFilters}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                Clear
              </ClearButton>
            )}
          </FilterActions>
        </FilterBar>

        <BundlesSection
          bundles={BUNDLES}
          products={PRODUCTS}
          calculateBundlePrice={calculateBundlePrice}
          onAddBundle={onAddBundle}
          expanded={showBundles}
          onToggle={onToggleBundles}
        />

        {filteredProducts.length === 0 ? (
          <NoResults>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <path d="M8 11h6"/>
            </svg>
            <h4>No products match your filters</h4>
            <p>Try adjusting your search or filter criteria to find what you're looking for</p>
            <ClearButton onClick={clearFilters}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Clear All Filters
            </ClearButton>
          </NoResults>
        ) : (
          <>
            <ResultsInfo>
              <ResultsCount>
                Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' matching your criteria'}
              </ResultsCount>
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </SortSelect>
            </ResultsInfo>

            <ProductGrid>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  $selected={selectedProduct === product.id}
                  onClick={() => {
                    if (compareMode) {
                      onToggleCompareProduct(product.id);
                    } else {
                      onSelectProduct(product.id);
                    }
                  }}
                >
                  <CardImageArea>
                    <DeploymentBadge $type={product.deployment.toLowerCase()}>
                      {product.deployment}
                    </DeploymentBadge>
                    <CompareCheckbox
                      $show={compareMode}
                      $checked={compareProducts?.includes(product.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompareProduct(product.id);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </CompareCheckbox>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </CardImageArea>

                  <CardContent>
                    <ProductName>{product.name}</ProductName>
                    <ProductSubtitle>{product.subtitle}</ProductSubtitle>

                    <ProductPrice>${product.price.toLocaleString()}</ProductPrice>
                    <PriceLabel>Starting price</PriceLabel>

                    <ProductTagline>{product.tagline}</ProductTagline>

                    <ProductSpecs>
                      {product.ultrasonic?.enabled && (
                        <SpecBadge $variant="ultrasonic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5.5 8.5L9 12l-3.5 3.5M9 12H2"/>
                            <path d="M14.5 8.5L18 12l-3.5 3.5M18 12h-7"/>
                          </svg>
                          {product.ultrasonic.watts}W Ultrasonic
                        </SpecBadge>
                      )}
                      {product.solar && (
                        <SpecBadge $variant="solar">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="4"/>
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                          </svg>
                          {product.solar.watts}W Solar
                        </SpecBadge>
                      )}
                      <SpecBadge $variant="sensors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2"/>
                        </svg>
                        {product.sensors} Sensors
                      </SpecBadge>
                    </ProductSpecs>

                    <CardActions onClick={(e) => e.stopPropagation()}>
                      <ViewDetailsButton onClick={() => onSelectProduct(product.id)}>
                        View Details
                      </ViewDetailsButton>
                      {/* Only show Add to Quote button when quote mode is active */}
                      {isQuoteMode && (
                        <div>
                          <AddToQuoteBtn
                            onClick={() => onAddToQuote(product.id)}
                            inQuote={isInQuote(product.id)}
                          />
                        </div>
                      )}
                    </CardActions>
                  </CardContent>
                </ProductCard>
              ))}
            </ProductGrid>
          </>
        )}
      </CatalogContainer>
    </CatalogSection>
  );
}
