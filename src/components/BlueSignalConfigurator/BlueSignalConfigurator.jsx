// BlueSignal Product Configurator - Main Component
import React, { useState, useEffect, useRef, useMemo } from "react";
import { PRODUCTS, BUNDLES, calculateBundlePrice } from "./data";
import bluesignalLogo from "../../assets/bluesignal-logo.png";
import { generateQuotePDF, generateSpecsPDF } from "./utils";
import SEOHead from "../seo/SEOHead";
import { BLUESIGNAL_ORGANIZATION_SCHEMA, SALES_WEBSITE_SCHEMA, createProductSchema } from "../seo/schemas";
import {
  ConfiguratorWrapper,
  Container,
  Header,
  Logo,
  Tagline,
  NavTabs,
  NavTab,
  FilterBar,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  SearchInput,
  CompareButton,
  ActionButton,
  ProductGrid,
  ProductCardWrapper,
  CompareCheckbox,
  ProductCard,
  ProductName,
  ProductSubtitle,
  ProductPrice,
  ProductTagline,
  ProductBadges,
  Badge,
  NoResults,
  DetailPanel,
  DetailTabs,
  DetailTab,
  DetailContent,
  StickyProductInfo,
  CurrentProductName,
  TabNavigation,
  MiniNavButton,
  QuickActions,
  KeyboardHint,
  ComparisonPanel,
  ComparisonSelectedProducts,
  ComparisonChip,
  CompareNowButton,
} from "./styles";
import {
  OverviewTab,
  LayoutTab,
  WiringTab,
  PowerTab,
  GpioTab,
  CalibrationTab,
  InstallationTab,
  MaintenanceTab,
  BomTab,
  // Enhanced tabs
  SpecsTab,
  EnhancedBomTab,
  EnhancedInstallationTab,
  OperationsTab,
  EnclosureTab,
  BenchmarkView,
  ProductComparisonView,
  // Quote Builder
  QuoteBuilder,
  QuoteFloatingButton,
  AddToQuoteBtn,
  // Customer Name Modal
  CustomerNameModal,
  // Bundles
  BundlesSection,
  // CTA
  BlueSignalCTA,
  // Landing
  SalesLandingHero,
} from "./components";

// Tab configuration - Enhanced with new tabs
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specs" },
  { id: "enclosure", label: "Enclosure" },
  { id: "layout", label: "Layout" },
  { id: "wiring", label: "Wiring" },
  { id: "power", label: "Power" },
  { id: "install", label: "Install" },
  { id: "ops", label: "Operations" },
  { id: "bom", label: "BOM" },
];

export default function BlueSignalConfigurator() {
  const [view, setView] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState("s-ac");
  const [activeTab, setActiveTab] = useState("overview");

  // Filter and comparison state
  const [searchQuery, setSearchQuery] = useState("");
  const [deploymentFilter, setDeploymentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Quote builder state
  const [quoteItems, setQuoteItems] = useState([]);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Bundles state
  const [showBundles, setShowBundles] = useState(false);

  // Landing page state - show landing for new visitors
  const [showLanding, setShowLanding] = useState(() => {
    // Check if user has seen the configurator before
    const hasVisited = localStorage.getItem("sales_configurator_visited");
    // Also check URL - if there's a hash or quote params, go straight to configurator
    const hasDeepLink = window.location.hash || window.location.search.includes("quote=");
    return !hasVisited && !hasDeepLink;
  });

  const containerRef = useRef(null);
  const productIds = Object.keys(PRODUCTS);

  // URL sync for deep linking - format: #product/tab?quote=id:qty,id:qty
  // Restore state from URL on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const searchParams = new URLSearchParams(window.location.search);

    // Parse hash (product/tab)
    if (hash) {
      const [productPart, tabPart] = hash.split('/');
      if (productPart && PRODUCTS[productPart]) {
        setSelectedProduct(productPart);
        if (tabPart && TABS.find(t => t.id === tabPart)) {
          setActiveTab(tabPart);
        }
      }
    }

    // Parse quote from URL params
    const quoteParam = searchParams.get('quote');
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
  }, []);

  // Update URL hash when product/tab changes
  useEffect(() => {
    if (view === "products") {
      window.location.hash = `${selectedProduct}/${activeTab}`;
    }
  }, [selectedProduct, activeTab, view]);

  // Generate shareable link with full state
  const generateShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const hash = `#${selectedProduct}/${activeTab}`;

    const params = new URLSearchParams();

    // Add quote items if any
    if (quoteItems.length > 0) {
      const quoteString = quoteItems.map(item => `${item.productId}:${item.quantity}`).join(',');
      params.set('quote', quoteString);
    }

    // Add filters if active
    if (searchQuery) params.set('search', searchQuery);
    if (deploymentFilter !== 'all') params.set('deployment', deploymentFilter);
    if (priceFilter !== 'all') params.set('price', priceFilter);

    const queryString = params.toString();
    return `${baseUrl}${queryString ? '?' + queryString : ''}${hash}`;
  };

  const copyShareableLink = () => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link);
    // Could add a toast notification here
  };

  // Filtered and sorted products (sorted by price, lowest to highest)
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
      .sort((a, b) => a.price - b.price); // Sort by price, lowest to highest
  }, [searchQuery, deploymentFilter, priceFilter]);

  const product = PRODUCTS[selectedProduct];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape closes comparison modal
      if (e.key === "Escape") {
        if (showComparison) {
          setShowComparison(false);
          return;
        }
        if (compareMode) {
          setCompareMode(false);
          setCompareProducts([]);
          return;
        }
      }

      // Don't handle if typing in input
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

      const currentIndex = productIds.indexOf(selectedProduct);
      const currentTabIndex = TABS.findIndex(t => t.id === activeTab);

      // Arrow keys for product navigation
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSelectedProduct(productIds[currentIndex - 1]);
        setActiveTab("overview");
      } else if (e.key === "ArrowRight" && currentIndex < productIds.length - 1) {
        setSelectedProduct(productIds[currentIndex + 1]);
        setActiveTab("overview");
      }

      // Tab navigation with [ and ]
      if (e.key === "[" && currentTabIndex > 0) {
        setActiveTab(TABS[currentTabIndex - 1].id);
      } else if (e.key === "]" && currentTabIndex < TABS.length - 1) {
        setActiveTab(TABS[currentTabIndex + 1].id);
      }

      // Number keys for direct tab access
      const num = parseInt(e.key);
      if (num >= 1 && num <= TABS.length) {
        setActiveTab(TABS[num - 1].id);
      }

      // 'c' to toggle compare mode
      if (e.key === "c" && !e.ctrlKey && !e.metaKey) {
        setCompareMode(!compareMode);
        if (compareMode) setCompareProducts([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct, activeTab, compareMode, showComparison, productIds]);

  // Toggle product in comparison
  const toggleCompareProduct = (productId) => {
    setCompareProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        return prev; // Max 4 products
      }
      return [...prev, productId];
    });
  };

  // Export BOM as CSV
  const exportBomAsCsv = () => {
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

  // Export specs as PDF
  const exportSpecsPDF = () => {
    generateSpecsPDF(product);
  };

  // Open customer name modal before exporting quote PDF
  const openQuotePDFModal = () => {
    if (quoteItems.length > 0) {
      setPdfError(null);
      setShowCustomerModal(true);
    }
  };

  // Generate and download quote PDF with customer name
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

  const clearFilters = () => {
    setSearchQuery("");
    setDeploymentFilter("all");
    setPriceFilter("all");
  };

  // Quote builder handlers
  const addToQuote = (productId) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuoteQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setQuoteItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromQuote = (productId) => {
    setQuoteItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const loadQuote = (items) => {
    // Validate items exist in PRODUCTS before loading
    const validItems = items.filter((item) => PRODUCTS[item.productId]);
    setQuoteItems(validItems);
  };

  // Landing page handlers
  const handleGetStarted = () => {
    localStorage.setItem("sales_configurator_visited", "true");
    setShowLanding(false);
  };

  const handleWatchDemo = () => {
    // Could open a video modal or link to demo
    // For now, go to benchmark view which shows capabilities
    localStorage.setItem("sales_configurator_visited", "true");
    setShowLanding(false);
    setView("benchmark");
  };

  const isInQuote = (productId) => {
    return quoteItems.some((item) => item.productId === productId);
  };

  const quoteItemCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add entire bundle to quote
  const addBundleToQuote = (bundle) => {
    setQuoteItems((prev) => {
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
    setShowQuoteBuilder(true); // Open quote builder to show added items
  };

  const currentProductIndex = productIds.indexOf(selectedProduct);
  const canGoPrev = currentProductIndex > 0;
  const canGoNext = currentProductIndex < productIds.length - 1;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab product={product} />;
      case "specs":
        return <SpecsTab product={product} />;
      case "enclosure":
        return <EnclosureTab product={product} />;
      case "layout":
        return <LayoutTab product={product} />;
      case "wiring":
        return <WiringTab product={product} />;
      case "power":
        return <PowerTab product={product} />;
      case "install":
        return <EnhancedInstallationTab product={product} />;
      case "ops":
        return <OperationsTab product={product} />;
      case "bom":
        return <EnhancedBomTab product={product} />;
      default:
        return <OverviewTab product={product} />;
    }
  };

  // Generate product schema for current product
  const productSchema = product ? createProductSchema({
    name: product.name,
    description: product.tagline || `${product.name} water quality monitoring system`,
    image: `https://sales.bluesignal.xyz/products/${selectedProduct}.png`,
    brand: 'BlueSignal',
    sku: selectedProduct.toUpperCase(),
    price: product.price,
    currency: 'USD',
    availability: 'InStock',
    url: `https://sales.bluesignal.xyz/configurator?product=${selectedProduct}`,
  }) : null;

  return (
    <ConfiguratorWrapper ref={containerRef}>
      <SEOHead
        title="Water Quality Sensors & Smart Buoys | BlueSignal"
        description="Professional-grade water quality monitoring hardware. Smart buoys, NPK sensors, LoRaWAN gateways, and enclosures. Configure your monitoring system and get a quote."
        canonical="/configurator"
        keywords="water quality sensors, smart buoys, lake monitoring, pond monitoring, NPK sensors, water monitoring hardware"
        jsonLd={[BLUESIGNAL_ORGANIZATION_SCHEMA, SALES_WEBSITE_SCHEMA, ...(productSchema ? [productSchema] : [])]}
      />

      {/* Landing Hero for new visitors */}
      {showLanding && (
        <SalesLandingHero
          onGetStarted={handleGetStarted}
          onWatchDemo={handleWatchDemo}
        />
      )}

      <Container>
        {/* Compact header for sales mode */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="https://bluesignal.xyz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                src={bluesignalLogo}
                alt="BlueSignal"
                style={{ height: 32, width: 'auto' }}
              />
            </a>
            <NavTabs role="tablist" aria-label="Main navigation" style={{ marginBottom: 0 }}>
              <NavTab
                role="tab"
                aria-selected={view === "products"}
                active={view === "products"}
                onClick={() => setView("products")}
              >
                Products
              </NavTab>
              <NavTab
                role="tab"
                aria-selected={view === "benchmark"}
                active={view === "benchmark"}
                onClick={() => setView("benchmark")}
              >
                Benchmark
              </NavTab>
            </NavTabs>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            Sales Configurator
          </div>
        </div>

        {view === "products" ? (
          <>
            {/* Filter Bar */}
            <FilterBar>
              <FilterGroup>
                <FilterLabel htmlFor="search">Search</FilterLabel>
                <SearchInput
                  id="search"
                  type="text"
                  placeholder="Search products, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
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

              <div style={{ flex: 1 }} />

              <CompareButton
                active={compareMode}
                onClick={() => {
                  setCompareMode(!compareMode);
                  if (compareMode) setCompareProducts([]);
                }}
                aria-pressed={compareMode}
              >
                {compareMode ? "Exit Compare" : "Compare Products"}
              </CompareButton>

              {(searchQuery || deploymentFilter !== "all" || priceFilter !== "all") && (
                <ActionButton onClick={clearFilters}>
                  Clear Filters
                </ActionButton>
              )}
            </FilterBar>

            {/* Bundles Section */}
            <BundlesSection
              bundles={BUNDLES}
              products={PRODUCTS}
              calculateBundlePrice={calculateBundlePrice}
              onAddBundle={addBundleToQuote}
              expanded={showBundles}
              onToggle={() => setShowBundles(!showBundles)}
            />

            {filteredProducts.length === 0 ? (
              <NoResults>
                <h4>No products match your filters</h4>
                <p>Try adjusting your search or filter criteria</p>
                <ActionButton onClick={clearFilters} style={{ marginTop: 16 }}>
                  Clear All Filters
                </ActionButton>
              </NoResults>
            ) : (
              <ProductGrid role="listbox" aria-label="Products">
                {filteredProducts.map((p) => (
                  <ProductCardWrapper key={p.id}>
                    <CompareCheckbox
                      show={compareMode}
                      checked={compareProducts.includes(p.id)}
                      onChange={() => toggleCompareProduct(p.id)}
                      aria-label={`Compare ${p.name}`}
                    />
                    <ProductCard
                      role="option"
                      aria-selected={selectedProduct === p.id}
                      selected={selectedProduct === p.id}
                      onClick={() => {
                        if (compareMode) {
                          toggleCompareProduct(p.id);
                        } else {
                          setSelectedProduct(p.id);
                          setActiveTab("overview");
                        }
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (compareMode) {
                            toggleCompareProduct(p.id);
                          } else {
                            setSelectedProduct(p.id);
                            setActiveTab("overview");
                          }
                        }
                      }}
                    >
                      <ProductName>{p.name}</ProductName>
                      <ProductSubtitle>{p.subtitle}</ProductSubtitle>
                      <ProductPrice>${p.price.toLocaleString()}</ProductPrice>
                      <ProductTagline>{p.tagline}</ProductTagline>
                      <ProductBadges>
                        {p.ultrasonic?.enabled && (
                          <Badge variant="ultrasonic">{p.ultrasonic.watts}W Ultrasonic</Badge>
                        )}
                        {p.solar && <Badge variant="solar">{p.solar.watts}W Solar</Badge>}
                        <Badge variant="sensors">{p.sensors} Sensors</Badge>
                      </ProductBadges>
                      <div style={{ marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                        <AddToQuoteBtn
                          onClick={() => addToQuote(p.id)}
                          inQuote={isInQuote(p.id)}
                        />
                      </div>
                    </ProductCard>
                  </ProductCardWrapper>
                ))}
              </ProductGrid>
            )}

            <DetailPanel>
              <DetailTabs role="tablist" aria-label="Product details">
                {TABS.map((tab, index) => (
                  <DetailTab
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                  >
                    <span style={{ opacity: 0.5, marginRight: 4 }}>{index + 1}</span>
                    {tab.label}
                  </DetailTab>
                ))}
              </DetailTabs>
              <DetailContent
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={activeTab}
              >
                {/* Sticky product info header */}
                <StickyProductInfo>
                  <CurrentProductName>
                    {product.name}
                    <span>{product.subtitle}</span>
                    <span style={{
                      marginLeft: 16,
                      color: '#4ade80',
                      fontWeight: 700,
                      fontSize: 18
                    }}>
                      ${product.price.toLocaleString()}
                    </span>
                  </CurrentProductName>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <BlueSignalCTA productSlug={product.id} />
                    <TabNavigation>
                    <MiniNavButton
                      disabled={!canGoPrev}
                      onClick={() => {
                        if (canGoPrev) {
                          setSelectedProduct(productIds[currentProductIndex - 1]);
                          setActiveTab("overview");
                        }
                      }}
                      aria-label="Previous product"
                      title="Previous product (Left Arrow)"
                    >
                      ←
                    </MiniNavButton>
                    <MiniNavButton
                      disabled={!canGoNext}
                      onClick={() => {
                        if (canGoNext) {
                          setSelectedProduct(productIds[currentProductIndex + 1]);
                          setActiveTab("overview");
                        }
                      }}
                      aria-label="Next product"
                      title="Next product (Right Arrow)"
                    >
                      →
                    </MiniNavButton>
                  </TabNavigation>
                  </div>
                </StickyProductInfo>

                {renderTabContent()}

                {/* Quick Actions */}
                <QuickActions>
                  <ActionButton onClick={exportSpecsPDF} title="Export product specifications as PDF">
                    Export PDF
                  </ActionButton>
                  <ActionButton onClick={exportBomAsCsv} title="Export BOM as CSV file">
                    Export BOM (CSV)
                  </ActionButton>
                  <ActionButton
                    onClick={copyShareableLink}
                    title="Copy shareable link with current config"
                  >
                    Share Config
                  </ActionButton>
                  <div style={{ flex: 1 }} />
                  <BlueSignalCTA productSlug={product.id} variant="link" />
                </QuickActions>
              </DetailContent>
            </DetailPanel>

            <KeyboardHint>
              <kbd>←</kbd><kbd>→</kbd> Navigate products |
              <kbd>1</kbd>-<kbd>9</kbd> Switch tabs |
              <kbd>C</kbd> Compare mode |
              <kbd>Esc</kbd> Exit
            </KeyboardHint>
          </>
        ) : (
          <DetailPanel>
            <DetailContent>
              <BenchmarkView />
            </DetailContent>
          </DetailPanel>
        )}
      </Container>

      {/* Comparison Panel */}
      {compareMode && compareProducts.length > 0 && (
        <ComparisonPanel>
          <ComparisonSelectedProducts>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>
              Comparing ({compareProducts.length}/4):
            </span>
            {compareProducts.map((id) => (
              <ComparisonChip key={id}>
                {PRODUCTS[id].name}
                <button onClick={() => toggleCompareProduct(id)} aria-label={`Remove ${PRODUCTS[id].name} from comparison`}>
                  ×
                </button>
              </ComparisonChip>
            ))}
          </ComparisonSelectedProducts>
          <CompareNowButton
            disabled={compareProducts.length < 2}
            onClick={() => setShowComparison(true)}
          >
            Compare {compareProducts.length} Products
          </CompareNowButton>
        </ComparisonPanel>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <ProductComparisonView
          products={compareProducts.map((id) => PRODUCTS[id])}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Quote Builder */}
      <QuoteBuilder
        isOpen={showQuoteBuilder}
        onClose={() => setShowQuoteBuilder(false)}
        quoteItems={quoteItems}
        onUpdateQuantity={updateQuoteQuantity}
        onRemoveItem={removeFromQuote}
        onClearQuote={clearQuote}
        onExportPDF={openQuotePDFModal}
        onShareQuote={copyShareableLink}
        onLoadQuote={loadQuote}
        products={PRODUCTS}
      />

      {/* Customer Name Modal for PDF Generation */}
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
    </ConfiguratorWrapper>
  );
}
