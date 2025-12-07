// Standalone Enclosure View Page for /sales/enclosure route
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "./data";
import { EnclosureView } from "./components/diagrams";
import EnclosureComparisonView from "./components/EnclosureComparisonView";
import SEOHead from "../seo/SEOHead";
import { createBreadcrumbSchema, createProductSchema } from "../seo/schemas";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  padding: 20px;
`;

const TopBar = styled.div`
  max-width: 1200px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 24px;
  flex-wrap: wrap;
`;

const ProductSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SelectorLabel = styled.label`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 12px;
  color: #00ff88;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ProductSelect = styled.select`
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  border-radius: 4px;
  padding: 8px 16px;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 13px;
  color: #00ff88;
  cursor: pointer;
  outline: none;

  &:hover {
    background: rgba(0, 255, 136, 0.15);
  }

  &:focus {
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
  }

  option {
    background: #1a1a1a;
    color: #00ff88;
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const PriceBadge = styled.div`
  background: rgba(0, 255, 136, 0.15);
  border: 2px solid #00ff88;
  border-radius: 8px;
  padding: 12px 20px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
`;

const PriceLabel = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 10px;
  color: #00aa66;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const PriceValue = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 24px;
  font-weight: 700;
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
`;

const BomSummary = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
`;

const BomCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 8px;
  padding: 20px;
`;

const BomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
`;

const BomTitle = styled.h3`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 14px;
  color: #00ff88;
  margin: 0;
  letter-spacing: 1px;
`;

const BomTotal = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 18px;
  font-weight: 700;
  color: #00ff88;
`;

const BomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const BomCategory = styled.div`
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.15);
  border-radius: 6px;
  padding: 12px;
`;

const CategoryName = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 11px;
  color: #00aa66;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const CategoryTotal = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 16px;
  font-weight: 600;
  color: #00ff88;
`;

const CategoryItems = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 10px;
  color: #666;
  margin-top: 4px;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 255, 136, 0.2);
`;

const QuickLink = styled.a`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 11px;
  color: #00aa66;
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
    color: #00ff88;
    border-color: #00ff88;
  }
`;

const OpenInConfiguratorButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
  }
`;

const CompareButton = styled.button`
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid #8b5cf6;
  border-radius: 6px;
  padding: 10px 20px;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: #8b5cf6;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(139, 92, 246, 0.25);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
  }
`;

const EnclosurePage = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("s-ac");
  const [showComparison, setShowComparison] = useState(false);
  const product = PRODUCTS[selectedProduct];

  // URL hash sync for deep linking
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && PRODUCTS[hash]) {
      setSelectedProduct(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = selectedProduct;
  }, [selectedProduct]);

  const openInConfigurator = () => {
    navigate(`/sales/configurator#${selectedProduct}/enclosure`);
  };

  // Calculate BOM totals by category
  const bomByCategory = useMemo(() => {
    const categories = {};
    let total = 0;

    product.bom.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = { total: 0, count: 0 };
      }
      categories[item.category].total += item.cost;
      categories[item.category].count += 1;
      total += item.cost;
    });

    return { categories, total };
  }, [product]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://sales.bluesignal.xyz/' },
    { name: 'Configurator', url: 'https://sales.bluesignal.xyz/configurator' },
    { name: 'Enclosure', url: 'https://sales.bluesignal.xyz/enclosure' },
  ]);

  return (
    <PageWrapper>
      <SEOHead
        title={`${product.name} Enclosure Details | BlueSignal`}
        description={`Detailed enclosure specifications for ${product.name}. View component layout, wiring diagrams, and bill of materials for water quality monitoring systems.`}
        canonical="/enclosure"
        keywords="water monitoring enclosure, sensor housing, weatherproof enclosure, water quality hardware"
        jsonLd={breadcrumbSchema}
      />
      <TopBar>
        <ProductSelector>
          <SelectorLabel htmlFor="product-select">Product:</SelectorLabel>
          <ProductSelect
            id="product-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {Object.values(PRODUCTS)
              .sort((a, b) => a.price - b.price)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.subtitle}
                </option>
              ))}
          </ProductSelect>
        </ProductSelector>

        <PriceDisplay>
          <PriceBadge>
            <PriceLabel>Unit Price</PriceLabel>
            <PriceValue>${product.price.toLocaleString()}</PriceValue>
          </PriceBadge>
          <PriceBadge style={{ borderColor: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}>
            <PriceLabel style={{ color: '#0ea5e9' }}>BOM Cost</PriceLabel>
            <PriceValue style={{ color: '#0ea5e9' }}>${bomByCategory.total.toLocaleString()}</PriceValue>
          </PriceBadge>
          <PriceBadge style={{ borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
            <PriceLabel style={{ color: '#22c55e' }}>Margin</PriceLabel>
            <PriceValue style={{ color: '#22c55e' }}>
              {Math.round(((product.price - bomByCategory.total) / product.price) * 100)}%
            </PriceValue>
          </PriceBadge>

          <CompareButton onClick={() => setShowComparison(true)}>
            Compare Enclosures
          </CompareButton>

          <OpenInConfiguratorButton onClick={openInConfigurator}>
            Open in Configurator →
          </OpenInConfiguratorButton>
        </PriceDisplay>
      </TopBar>

      <EnclosureView product={product} />

      <BomSummary>
        <BomCard>
          <BomHeader>
            <BomTitle>BILL OF MATERIALS SUMMARY</BomTitle>
            <BomTotal>Total: ${bomByCategory.total.toLocaleString()}</BomTotal>
          </BomHeader>

          <BomGrid>
            {Object.entries(bomByCategory.categories).map(([category, data]) => (
              <BomCategory key={category}>
                <CategoryName>{category}</CategoryName>
                <CategoryTotal>${data.total.toLocaleString()}</CategoryTotal>
                <CategoryItems>{data.count} items</CategoryItems>
              </BomCategory>
            ))}
          </BomGrid>

          <QuickLinks>
            <QuickLink href={`/sales/configurator#${selectedProduct}/bom`}>
              → Full BOM Details
            </QuickLink>
            <QuickLink href={`/sales/configurator#${selectedProduct}/specs`}>
              → Specifications
            </QuickLink>
            <QuickLink onClick={copyLink}>
              → Copy Link
            </QuickLink>
          </QuickLinks>
        </BomCard>
      </BomSummary>

      {/* Enclosure Comparison Modal */}
      {showComparison && (
        <EnclosureComparisonView
          products={[product]}
          onClose={() => setShowComparison(false)}
          allProducts={PRODUCTS}
        />
      )}
    </PageWrapper>
  );
};

export default EnclosurePage;
