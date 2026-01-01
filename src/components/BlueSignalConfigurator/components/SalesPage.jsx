// SalesPage - Unified single-page layout for the sales portal
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { salesTheme } from "../styles/theme";
import { PRODUCTS, BUNDLES, calculateBundlePrice } from "../data";

// Components
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";
import HeroSection from "./HeroSection";
import ProductTiers from "./ProductTiers";
import ProductCatalogSection from "./ProductCatalogSection";
import ROICalculatorSection from "./ROICalculatorSection";
import SectionDivider, { CurvedDivider, GradientDivider } from "./SectionDivider";

// Detail components from original configurator
import {
  OverviewTab,
  SpecsTab,
  WiringTab,
  LayoutTab,
  PowerTab,
  EnclosureTab,
  EnhancedInstallationTab,
  OperationsTab,
  EnhancedBomTab,
  BenchmarkView,
  ProductComparisonView,
  QuoteBuilder,
  QuoteFloatingButton,
  CustomerNameModal,
} from "./index";

import { generateQuotePDF, generateSpecsPDF } from "../utils";
import SEOHead from "../../seo/SEOHead";
import { BLUESIGNAL_ORGANIZATION_SCHEMA, SALES_WEBSITE_SCHEMA, createProductSchema } from "../../seo/schemas";

const GlobalStyles = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${salesTheme.typography.fontFamily};
    background: ${salesTheme.colors.bgPrimary};
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${salesTheme.colors.bgPrimary};
`;

const MainContent = styled.main`
  /* Account for fixed header */
  scroll-padding-top: 80px;
`;

// Product Detail Modal/Slide-up Panel
const ProductDetailOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: ${salesTheme.zIndex.modal};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (min-width: ${salesTheme.breakpoints.laptop}) {
    align-items: center;
    padding: 32px;
  }
`;

const ProductDetailPanel = styled.div`
  background: ${salesTheme.colors.bgCard};
  border-radius: 28px 28px 0 0;
  width: 100%;
  max-height: 95vh;
  max-height: 95dvh; /* Dynamic viewport height for mobile browsers */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.3);

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (min-width: ${salesTheme.breakpoints.laptop}) {
    border-radius: 28px;
    max-width: 1200px;
    max-height: 88vh;
    animation: scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid ${salesTheme.colors.border};
  background: linear-gradient(to bottom, ${salesTheme.colors.bgCard} 0%, #fafbfc 100%);
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const DetailProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex: 1;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DetailProductName = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: ${salesTheme.colors.textDark};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const DetailProductPrice = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: ${salesTheme.colors.accentPrimary};
  font-family: ${salesTheme.typography.fontMono};
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  color: ${salesTheme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #e5e7eb;
    color: ${salesTheme.colors.textDark};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
`;

const DetailTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${salesTheme.colors.border};
  background: #f9fafb;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 12px;
  min-height: 48px;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    min-height: 44px;
    padding: 0 8px;
  }
`;

const DetailTab = styled.button`
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: ${props => props.$active ? salesTheme.colors.accentSecondary : salesTheme.colors.textMuted};
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? salesTheme.colors.accentSecondary : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.$active ? salesTheme.colors.accentSecondary : salesTheme.colors.textDark};
    background: ${props => props.$active ? 'transparent' : 'rgba(0, 0, 0, 0.02)'};
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 10px 16px;
    font-size: 13px;
    min-height: 40px;
  }
`;

const DetailContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 32px;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  min-height: 0; /* Fix for flex child overflow scrolling */

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 24px 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px 16px;
    /* Ensure content is scrollable on mobile */
    max-height: none;
    overflow-y: auto;
  }
`;

const DetailActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 28px;
  border-top: 1px solid ${salesTheme.colors.border};
  background: linear-gradient(to top, ${salesTheme.colors.bgCard} 0%, #fafbfc 100%);

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 16px 20px;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;

  svg {
    width: 18px;
    height: 18px;
  }

  ${props => props.$primary ? `
    background: ${salesTheme.gradients.greenCta};
    border: none;
    color: #0f172a;
    flex: 1.5;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    }

    &:active {
      transform: translateY(0);
    }
  ` : `
    background: ${salesTheme.colors.bgCard};
    border: 2px solid ${salesTheme.colors.border};
    color: ${salesTheme.colors.textMuted};

    &:hover {
      background: #f3f4f6;
      color: ${salesTheme.colors.textDark};
      border-color: #d1d5db;
    }
  `}

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 14px 16px;
    font-size: 13px;
    min-width: unset;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// Benchmark Section Wrapper
const BenchmarkSection = styled.section`
  background: ${salesTheme.colors.bgSecondary};
  padding: 80px 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px;
  }
`;

const BenchmarkContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const BenchmarkHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 24px;
  }
`;

// Tab configuration
const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "install", label: "Install" },
  { id: "pricing", label: "Pricing" },
];

export default function SalesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Section refs for scroll navigation
  const sectionRefs = {
    hero: useRef(null),
    tiers: useRef(null),
    products: useRef(null),
    calculator: useRef(null),
    benchmark: useRef(null),
  };

  // Active section tracking
  const [activeSection, setActiveSection] = useState('hero');

  // Product state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Compare state
  const [compareMode, setCompareMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Quote state
  const [quoteItems, setQuoteItems] = useState([]);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showBundles, setShowBundles] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Parse URL params and hash on load
  useEffect(() => {
    const productParam = searchParams.get('product');
    const tabParam = searchParams.get('tab');
    const quoteParam = searchParams.get('quote');
    const sectionParam = searchParams.get('section');

    if (productParam && PRODUCTS[productParam]) {
      setSelectedProduct(productParam);
      if (tabParam && DETAIL_TABS.find(t => t.id === tabParam)) {
        setActiveTab(tabParam);
      }
    }

    if (quoteParam) {
      try {
        const items = quoteParam.split(',').map(item => {
          const [productId, qty] = item.split(':');
          if (PRODUCTS[productId]) {
            return { productId, quantity: parseInt(qty, 10) || 1 };
          }
          return null;
        }).filter(Boolean);
        if (items.length > 0) {
          setQuoteItems(items);
        }
      } catch (e) {
        console.warn('Failed to parse quote from URL', e);
      }
    }

    if (sectionParam) {
      setTimeout(() => scrollToSection(sectionParam), 100);
    }

    // Handle ?quote=true param to open quote builder
    const quoteOpen = searchParams.get('quote');
    if (quoteOpen === 'true' || quoteOpen === '1') {
      setShowQuoteBuilder(true);
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedProduct) {
      params.set('product', selectedProduct);
      params.set('tab', activeTab);
    }

    if (quoteItems.length > 0) {
      const quoteString = quoteItems.map(item => `${item.productId}:${item.quantity}`).join(',');
      params.set('quote', quoteString);
    }

    const newSearch = params.toString();
    if (newSearch !== location.search.slice(1)) {
      navigate(`?${newSearch}`, { replace: true });
    }
  }, [selectedProduct, activeTab, quoteItems]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observers = [];
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          options
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Navigation handlers
  const scrollToSection = useCallback((sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      const headerHeight = 72;
      const top = ref.current.offsetTop - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleNavigate = (sectionId) => {
    if (sectionId === 'products') {
      scrollToSection('products');
    } else {
      scrollToSection(sectionId);
    }
  };

  // Product handlers
  const handleSelectProduct = (productId) => {
    setSelectedProduct(productId);
    setActiveTab("overview");
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  // Compare handlers
  const handleToggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setCompareProducts([]);
    }
  };

  const handleToggleCompareProduct = (productId) => {
    setCompareProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  };

  // Quote handlers
  const handleAddToQuote = (productId) => {
    setQuoteItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setQuoteItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromQuote = (productId) => {
    setQuoteItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  const handleAddBundle = (bundle) => {
    setQuoteItems(prev => {
      const newItems = [...prev];
      bundle.products.forEach(({ productId, quantity }) => {
        const existingIndex = newItems.findIndex(item => item.productId === productId);
        if (existingIndex >= 0) {
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
        } else {
          newItems.push({ productId, quantity });
        }
      });
      return newItems;
    });
    setShowQuoteBuilder(true);
  };

  // PDF handlers
  const openQuotePDFModal = () => {
    if (quoteItems.length > 0) {
      setPdfError(null);
      setShowCustomerModal(true);
    }
  };

  const handleGenerateQuotePDF = async (customerName) => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    try {
      await generateQuotePDF(quoteItems, PRODUCTS, { customerName });
      setShowCustomerModal(false);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateShareableLink = () => {
    const params = new URLSearchParams();
    if (selectedProduct) {
      params.set('product', selectedProduct);
      params.set('tab', activeTab);
    }
    if (quoteItems.length > 0) {
      const quoteString = quoteItems.map(item => `${item.productId}:${item.quantity}`).join(',');
      params.set('quote', quoteString);
    }
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?${params.toString()}`;
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(generateShareableLink());
  };

  // Export handlers
  const exportBomAsCsv = () => {
    if (!selectedProduct) return;
    const product = PRODUCTS[selectedProduct];
    const headers = ["Category", "Item", "Quantity", "Cost"];
    const rows = product.bom.map(item => [
      item.category,
      item.item,
      item.qty,
      item.cost
    ]);
    const total = product.bom.reduce((sum, item) => sum + item.cost, 0);
    rows.push(["", "TOTAL", "", total]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.name}-BOM.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSpecsPDF = () => {
    if (!selectedProduct) return;
    generateSpecsPDF(PRODUCTS[selectedProduct]);
  };

  const quoteItemCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
  const product = selectedProduct ? PRODUCTS[selectedProduct] : null;

  const renderTabContent = () => {
    if (!product) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewTab product={product} />;
      case "technical":
        return (
          <>
            <SpecsTab product={product} />
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <WiringTab product={product} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <LayoutTab product={product} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <PowerTab product={product} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <EnclosureTab product={product} />
            </div>
          </>
        );
      case "install":
        return (
          <>
            <EnhancedInstallationTab product={product} />
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <OperationsTab product={product} />
            </div>
          </>
        );
      case "pricing":
        return <EnhancedBomTab product={product} />;
      default:
        return <OverviewTab product={product} />;
    }
  };

  // Generate SEO schema
  const productSchema = product ? createProductSchema({
    name: product.name,
    description: product.tagline || `${product.name} water quality monitoring system`,
    image: `https://sales.bluesignal.xyz/products/${selectedProduct}.png`,
    brand: 'BlueSignal',
    sku: selectedProduct.toUpperCase(),
    price: product.price,
    currency: 'USD',
    availability: 'InStock',
    url: `https://sales.bluesignal.xyz?product=${selectedProduct}`,
  }) : null;

  return (
    <>
      <GlobalStyles />
      <SEOHead
        title="Water Quality Sensors & Smart Buoys | BlueSignal"
        description="Professional-grade water quality monitoring hardware. Smart buoys, sensors, and complete monitoring systems. Configure your system and get a quote."
        canonical="/"
        keywords="water quality sensors, smart buoys, lake monitoring, pond monitoring, water monitoring hardware"
        jsonLd={[BLUESIGNAL_ORGANIZATION_SCHEMA, SALES_WEBSITE_SCHEMA, ...(productSchema ? [productSchema] : [])]}
      />

      <PageWrapper>
        <SalesHeader
          activeSection={activeSection}
          onNavigate={handleNavigate}
          quoteItemCount={quoteItemCount}
          onOpenQuote={() => setShowQuoteBuilder(true)}
        />

        <MainContent>
          {/* Hero Section */}
          <div ref={sectionRefs.hero}>
            <HeroSection
              onNavigateToProducts={() => scrollToSection('products')}
              onNavigateToBenchmark={() => scrollToSection('benchmark')}
            />
          </div>

          {/* Section Divider: Dark to Dark */}
          <CurvedDivider
            bgColor={salesTheme.colors.bgPrimary}
            color={salesTheme.colors.bgSecondary}
            height="80px"
          />

          {/* Product Tiers Section */}
          <div ref={sectionRefs.tiers}>
            <ProductTiers onNavigate={handleNavigate} />
          </div>

          {/* Section Divider: Dark to Light */}
          <CurvedDivider
            bgColor={salesTheme.colors.bgSecondary}
            color={salesTheme.colors.bgSurface}
            height="80px"
          />

          {/* Product Catalog Section */}
          <div ref={sectionRefs.products}>
            <ProductCatalogSection
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
              compareMode={compareMode}
              onToggleCompareMode={handleToggleCompareMode}
              compareProducts={compareProducts}
              onToggleCompareProduct={handleToggleCompareProduct}
              quoteItems={quoteItems}
              onAddToQuote={handleAddToQuote}
              showBundles={showBundles}
              onToggleBundles={() => setShowBundles(!showBundles)}
              onAddBundle={handleAddBundle}
            />
          </div>

          {/* ROI Calculator Section */}
          <div ref={sectionRefs.calculator}>
            <ROICalculatorSection
              onGetQuote={() => scrollToSection('products')}
            />
          </div>

          {/* Section Divider: Light to Dark */}
          <GradientDivider
            fromColor={salesTheme.colors.bgSurface}
            toColor={salesTheme.colors.bgSecondary}
            height="100px"
          />

          {/* Benchmark Section */}
          <div ref={sectionRefs.benchmark}>
            <BenchmarkSection id="benchmark">
              <BenchmarkContainer>
                <BenchmarkHeader>
                  <SectionLabel>Market Comparison</SectionLabel>
                  <SectionTitle>How We Compare</SectionTitle>
                </BenchmarkHeader>
                <BenchmarkView />
              </BenchmarkContainer>
            </BenchmarkSection>
          </div>
        </MainContent>

        <SalesFooter onNavigate={handleNavigate} />

        {/* Product Detail Panel */}
        {selectedProduct && (
          <ProductDetailOverlay onClick={handleCloseDetail}>
            <ProductDetailPanel onClick={(e) => e.stopPropagation()}>
              <DetailHeader>
                <DetailProductInfo>
                  <DetailProductName>{product.name}</DetailProductName>
                  <DetailProductPrice>${product.price.toLocaleString()}</DetailProductPrice>
                </DetailProductInfo>
                <CloseButton onClick={handleCloseDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </CloseButton>
              </DetailHeader>

              <DetailTabs>
                {DETAIL_TABS.map((tab) => (
                  <DetailTab
                    key={tab.id}
                    $active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </DetailTab>
                ))}
              </DetailTabs>

              <DetailContent>
                {renderTabContent()}
              </DetailContent>

              <DetailActions>
                <ActionButton onClick={exportSpecsPDF}>
                  Export PDF
                </ActionButton>
                <ActionButton onClick={exportBomAsCsv}>
                  Export BOM
                </ActionButton>
                <ActionButton $primary onClick={() => handleAddToQuote(selectedProduct)}>
                  Add to Quote
                </ActionButton>
              </DetailActions>
            </ProductDetailPanel>
          </ProductDetailOverlay>
        )}

        {/* Compare Panel */}
        {compareMode && compareProducts.length >= 2 && (
          <ProductComparisonView
            products={compareProducts.map(id => PRODUCTS[id])}
            onClose={() => setShowComparison(false)}
          />
        )}

        {/* Quote Builder */}
        <QuoteBuilder
          isOpen={showQuoteBuilder}
          onClose={() => setShowQuoteBuilder(false)}
          quoteItems={quoteItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromQuote}
          onClearQuote={handleClearQuote}
          onExportPDF={openQuotePDFModal}
          onShareQuote={copyShareableLink}
          onLoadQuote={(items) => setQuoteItems(items)}
          products={PRODUCTS}
        />

        {/* Customer Name Modal */}
        <CustomerNameModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onGenerate={handleGenerateQuotePDF}
          isGenerating={isGeneratingPDF}
          error={pdfError}
        />

        {/* Floating Quote Button */}
        {!showQuoteBuilder && (
          <QuoteFloatingButton
            itemCount={quoteItemCount}
            onClick={() => setShowQuoteBuilder(true)}
          />
        )}
      </PageWrapper>
    </>
  );
}
