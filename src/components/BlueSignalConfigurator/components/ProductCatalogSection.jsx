// ProductCatalogSection - Unified product catalog for the sales portal
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";
import { PRODUCTS, BUNDLES, calculateBundlePrice } from "../data";
import BundlesSection from "./BundlesSection";
import { AddToQuoteBtn } from "./QuoteBuilder";

const CatalogSection = styled.section`
  background: ${salesTheme.colors.bgSurface};
  padding: 80px 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px;
  }
`;

const CatalogContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderContent = styled.div``;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 24px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  color: ${salesTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.md};
  font-size: 14px;
  color: ${salesTheme.colors.textDark};
  background: ${salesTheme.colors.bgCard};
  min-width: 200px;
  transition: all ${salesTheme.transitions.fast};

  &::placeholder {
    color: ${salesTheme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    width: 100%;
    min-width: unset;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.md};
  font-size: 14px;
  color: ${salesTheme.colors.textDark};
  background: ${salesTheme.colors.bgCard};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CompareButton = styled.button`
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => props.$active
    ? salesTheme.colors.accentSecondary
    : salesTheme.colors.bgCard};
  border: 1px solid ${props => props.$active
    ? salesTheme.colors.accentSecondary
    : salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.md};
  color: ${props => props.$active
    ? salesTheme.colors.textPrimary
    : salesTheme.colors.accentSecondary};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};

  &:hover {
    background: ${props => props.$active
      ? salesTheme.colors.accentSecondaryHover
      : 'rgba(59, 130, 246, 0.05)'};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ProductCard = styled.div`
  background: ${salesTheme.colors.bgCard};
  border: 2px solid ${props => props.$selected
    ? salesTheme.colors.accentSecondary
    : salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.xl};
  padding: 24px;
  cursor: pointer;
  transition: all ${salesTheme.transitions.spring};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${salesTheme.gradients.greenCta};
    opacity: ${props => props.$selected ? 1 : 0};
    transition: opacity ${salesTheme.transitions.fast};
  }

  &:hover {
    border-color: ${salesTheme.colors.accentSecondary};
    transform: translateY(-4px);
    box-shadow: ${salesTheme.shadows.lg};
  }
`;

const CompareCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: ${salesTheme.colors.accentSecondary};
  display: ${props => props.$show ? 'block' : 'none'};
`;

const ProductName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 4px;
`;

const ProductSubtitle = styled.p`
  font-size: 12px;
  color: ${salesTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px;
`;

const ProductPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${salesTheme.colors.accentPrimary};
  font-family: ${salesTheme.typography.fontMono};
  margin-bottom: 8px;
`;

const ProductTagline = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  line-height: 1.5;
  margin: 0 0 16px;
`;

const ProductBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: ${salesTheme.borderRadius.sm};
  background: ${props =>
    props.$variant === 'ultrasonic' ? '#fef3c7' :
    props.$variant === 'solar' ? '#dcfce7' :
    props.$variant === 'sensors' ? '#dbeafe' : '#f3f4f6'};
  color: ${props =>
    props.$variant === 'ultrasonic' ? '#d97706' :
    props.$variant === 'solar' ? '#16a34a' :
    props.$variant === 'sensors' ? '#2563eb' : '#6b7280'};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: ${salesTheme.colors.textMuted};

  h4 {
    font-size: 18px;
    color: ${salesTheme.colors.textDark};
    margin: 0 0 8px;
  }

  p {
    margin: 0 0 16px;
  }
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  background: ${salesTheme.colors.bgCard};
  border: 1px solid ${salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.md};
  color: ${salesTheme.colors.textMuted};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};

  &:hover {
    background: #f3f4f6;
    color: ${salesTheme.colors.textDark};
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
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deploymentFilter, setDeploymentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return Object.values(PRODUCTS)
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
      })
      .sort((a, b) => a.price - b.price);
  }, [searchQuery, deploymentFilter, priceFilter]);

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
          <HeaderContent>
            <SectionLabel>Product Catalog</SectionLabel>
            <SectionTitle>Water Quality Monitoring Systems</SectionTitle>
          </HeaderContent>

          <FilterBar>
            <FilterGroup>
              <FilterLabel htmlFor="search">Search</FilterLabel>
              <SearchInput
                id="search"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel htmlFor="deployment">Deployment</FilterLabel>
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
              <FilterLabel htmlFor="price">Price</FilterLabel>
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

            <CompareButton
              $active={compareMode}
              onClick={onToggleCompareMode}
            >
              {compareMode ? "Exit Compare" : "Compare"}
            </CompareButton>

            {hasActiveFilters && (
              <ClearButton onClick={clearFilters}>
                Clear Filters
              </ClearButton>
            )}
          </FilterBar>
        </SectionHeader>

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
            <h4>No products match your filters</h4>
            <p>Try adjusting your search or filter criteria</p>
            <ClearButton onClick={clearFilters}>Clear All Filters</ClearButton>
          </NoResults>
        ) : (
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
                <CompareCheckbox
                  $show={compareMode}
                  checked={compareProducts?.includes(product.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleCompareProduct(product.id);
                  }}
                />

                <ProductName>{product.name}</ProductName>
                <ProductSubtitle>{product.subtitle}</ProductSubtitle>
                <ProductPrice>${product.price.toLocaleString()}</ProductPrice>
                <ProductTagline>{product.tagline}</ProductTagline>

                <ProductBadges>
                  {product.ultrasonic?.enabled && (
                    <Badge $variant="ultrasonic">
                      {product.ultrasonic.watts}W Ultrasonic
                    </Badge>
                  )}
                  {product.solar && (
                    <Badge $variant="solar">{product.solar.watts}W Solar</Badge>
                  )}
                  <Badge $variant="sensors">{product.sensors} Sensors</Badge>
                </ProductBadges>

                <div onClick={(e) => e.stopPropagation()}>
                  <AddToQuoteBtn
                    onClick={() => onAddToQuote(product.id)}
                    inQuote={isInQuote(product.id)}
                  />
                </div>
              </ProductCard>
            ))}
          </ProductGrid>
        )}
      </CatalogContainer>
    </CatalogSection>
  );
}
