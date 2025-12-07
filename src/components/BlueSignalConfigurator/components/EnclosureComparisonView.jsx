// Enclosure Comparison View - Side-by-side enclosure layouts
import React, { useState } from "react";
import styled from "styled-components";
import { EnclosureView } from "./diagrams";

const ComparisonModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 200;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
`;

const Title = styled.h2`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 16px;
  color: #00ff88;
  margin: 0;
  letter-spacing: 1px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ProductSelector = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 255, 136, 0.1);
`;

const SelectorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectorLabel = styled.label`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 11px;
  color: #00aa66;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductSelect = styled.select`
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  border-radius: 4px;
  padding: 6px 12px;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 12px;
  color: #00ff88;
  cursor: pointer;
  outline: none;

  &:focus {
    box-shadow: 0 0 6px rgba(0, 255, 136, 0.3);
  }

  option {
    background: #1a1a1a;
    color: #00ff88;
  }
`;

const ComparisonBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const EnclosurePane = styled.div`
  flex: 1;
  overflow: auto;
  border-right: 1px solid rgba(0, 255, 136, 0.1);
  position: relative;

  &:last-child {
    border-right: none;
  }
`;

const PaneHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaneTitle = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 14px;
  font-weight: 600;
  color: #00ff88;
`;

const PanePrice = styled.div`
  font-family: "SF Mono", Consolas, monospace;
  font-size: 16px;
  font-weight: 700;
  color: #22c55e;
`;

const EnclosureWrapper = styled.div`
  transform: scale(0.85);
  transform-origin: top center;
  padding-bottom: 40px;
`;

const ComparisonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(0, 255, 136, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 11px;
`;

const StatLabel = styled.span`
  color: #666;
`;

const StatValue = styled.span`
  color: #00ff88;
`;

const EnclosureComparisonView = ({ products, onClose, allProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState(
    products.length >= 2
      ? [products[0].id, products[1].id]
      : [products[0]?.id || "s-ac", "s-sol"]
  );

  const handleProductChange = (index, productId) => {
    setSelectedProducts((prev) => {
      const newSelection = [...prev];
      newSelection[index] = productId;
      return newSelection;
    });
  };

  const productList = Object.values(allProducts);
  const selectedProductData = selectedProducts.map((id) => allProducts[id]);

  return (
    <ComparisonModal>
      <ComparisonHeader>
        <Title>ENCLOSURE COMPARISON</Title>
        <CloseButton onClick={onClose}>Close (Esc)</CloseButton>
      </ComparisonHeader>

      <ProductSelector>
        {selectedProducts.map((productId, index) => (
          <SelectorGroup key={index}>
            <SelectorLabel>Product {index + 1}:</SelectorLabel>
            <ProductSelect
              value={productId}
              onChange={(e) => handleProductChange(index, e.target.value)}
            >
              {productList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </ProductSelect>
          </SelectorGroup>
        ))}
      </ProductSelector>

      <ComparisonBody>
        {selectedProductData.map((product, index) => {
          if (!product) return null;

          const bomTotal = product.bom.reduce((sum, item) => sum + item.cost, 0);
          const margin = Math.round(((product.price - bomTotal) / product.price) * 100);

          return (
            <EnclosurePane key={product.id}>
              <PaneHeader>
                <div>
                  <PaneTitle>{product.name}</PaneTitle>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                    {product.subtitle}
                  </div>
                </div>
                <PanePrice>${product.price.toLocaleString()}</PanePrice>
              </PaneHeader>

              <EnclosureWrapper>
                <EnclosureView product={product} />
              </EnclosureWrapper>

              <ComparisonStats>
                <StatItem>
                  <StatLabel>Power:</StatLabel>
                  <StatValue>{product.power.type}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Sensors:</StatLabel>
                  <StatValue>{product.sensors} params</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Ultrasonic:</StatLabel>
                  <StatValue>
                    {product.ultrasonic?.enabled
                      ? `${product.ultrasonic.watts}W`
                      : "None"}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Autonomy:</StatLabel>
                  <StatValue>{product.autonomy}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>BOM Cost:</StatLabel>
                  <StatValue>${bomTotal.toLocaleString()}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Margin:</StatLabel>
                  <StatValue>{margin}%</StatValue>
                </StatItem>
              </ComparisonStats>
            </EnclosurePane>
          );
        })}
      </ComparisonBody>
    </ComparisonModal>
  );
};

export default EnclosureComparisonView;
