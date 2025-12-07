// BlueSignal Product Configurator - Main Component
import React, { useState, useEffect, useRef, useMemo } from "react";
import { PRODUCTS } from "./data";
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

  const containerRef = useRef(null);
  const productIds = Object.keys(PRODUCTS);

  // URL hash sync for deep linking
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && PRODUCTS[hash]) {
      setSelectedProduct(hash);
    }
  }, []);

  useEffect(() => {
    if (view === "products") {
      window.location.hash = selectedProduct;
    }
  }, [selectedProduct, view]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return Object.values(PRODUCTS).filter((p) => {
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

  // Print specs
  const printSpecs = () => {
    const printWindow = window.open("", "_blank");
    const bomTotal = product.bom.reduce((sum, item) => sum + item.cost, 0);
    printWindow.document.write(`
      <html>
        <head>
          <title>${product.name} Specifications</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
            h1 { color: #1e40af; }
            h2 { color: #374151; margin-top: 24px; }
            table { border-collapse: collapse; width: 100%; margin-top: 16px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
            th { background: #f3f4f6; }
            .price { font-size: 24px; color: #059669; font-weight: bold; }
            ul { margin: 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${product.name} - ${product.subtitle}</h1>
          <p class="price">$${product.price.toLocaleString()}</p>
          <p><strong>${product.tagline}</strong></p>

          <h2>Features</h2>
          <ul>${product.features.map(f => `<li>${f}</li>`).join("")}</ul>

          <h2>Specifications</h2>
          <table>
            <tr><th>Deployment</th><td>${product.deployment}</td></tr>
            <tr><th>Power</th><td>${product.power.type}${product.solar ? ` (${product.solar.watts}W Solar)` : ""}</td></tr>
            <tr><th>Sensors</th><td>${product.sensors} parameters</td></tr>
            <tr><th>Autonomy</th><td>${product.autonomy}</td></tr>
            <tr><th>Weight</th><td>${product.weight}</td></tr>
          </table>

          <h2>Sensors</h2>
          <ul>${product.sensorList.map(s => `<li>${s}</li>`).join("")}</ul>

          <h2>Bill of Materials</h2>
          <table>
            <tr><th>Category</th><th>Item</th><th>Qty</th><th>Cost</th></tr>
            ${product.bom.map(item => `<tr><td>${item.category}</td><td>${item.item}</td><td>${item.qty}</td><td>$${item.cost}</td></tr>`).join("")}
            <tr><th colspan="3">Total</th><th>$${bomTotal.toLocaleString()}</th></tr>
          </table>

          <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
            Generated from BlueSignal Configurator on ${new Date().toLocaleDateString()}
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDeploymentFilter("all");
    setPriceFilter("all");
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

  return (
    <ConfiguratorWrapper ref={containerRef}>
      <Container>
        <Header>
          <Logo>
            Blue<span>Signal</span>
          </Logo>
          <Tagline>Water Quality Hardware Configurator</Tagline>
        </Header>

        <NavTabs role="tablist" aria-label="Main navigation">
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
                  </CurrentProductName>
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
                </StickyProductInfo>

                {renderTabContent()}

                {/* Quick Actions */}
                <QuickActions>
                  <ActionButton onClick={printSpecs} title="Print product specifications">
                    Print Specs
                  </ActionButton>
                  <ActionButton onClick={exportBomAsCsv} title="Export BOM as CSV file">
                    Export BOM (CSV)
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    title="Copy link to this product"
                  >
                    Copy Link
                  </ActionButton>
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
    </ConfiguratorWrapper>
  );
}
