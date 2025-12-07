// Bundles Section Component - Quick-add pre-configured packages
import React from "react";
import styled from "styled-components";

const BundlesWrapper = styled.div`
  margin-bottom: 24px;
`;

const BundlesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const BundlesTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const BundlesToggle = styled.button`
  font-size: 12px;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const BundlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
`;

const BundleCard = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #22c55e;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
    transform: translateY(-2px);
  }
`;

const BundleName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #166534;
  margin-bottom: 4px;
`;

const BundleDescription = styled.div`
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 12px;
`;

const BundleProducts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

const ProductChip = styled.span`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  color: #374151;
`;

const BundlePricing = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(134, 239, 172, 0.5);
`;

const BundlePrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #059669;
`;

const OriginalPrice = styled.span`
  font-size: 12px;
  color: #9ca3af;
  text-decoration: line-through;
  margin-right: 8px;
`;

const DiscountBadge = styled.span`
  background: #dc2626;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

const AddBundleButton = styled.button`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
    transform: translateY(-1px);
  }
`;

const BundlesSection = ({
  bundles,
  products,
  calculateBundlePrice,
  onAddBundle,
  expanded,
  onToggle,
}) => {
  if (!expanded) {
    return (
      <BundlesWrapper>
        <BundlesHeader>
          <BundlesTitle>Quick-Add Bundles</BundlesTitle>
          <BundlesToggle onClick={onToggle}>
            Show {Object.keys(bundles).length} packages →
          </BundlesToggle>
        </BundlesHeader>
      </BundlesWrapper>
    );
  }

  return (
    <BundlesWrapper>
      <BundlesHeader>
        <BundlesTitle>Quick-Add Bundles</BundlesTitle>
        <BundlesToggle onClick={onToggle}>Hide</BundlesToggle>
      </BundlesHeader>

      <BundlesGrid>
        {Object.values(bundles).map((bundle) => {
          const pricing = calculateBundlePrice(bundle, products);

          return (
            <BundleCard key={bundle.id}>
              <BundleName>{bundle.name}</BundleName>
              <BundleDescription>{bundle.description}</BundleDescription>

              <BundleProducts>
                {bundle.products.map((item, idx) => (
                  <ProductChip key={idx}>
                    {item.quantity}× {products[item.productId]?.name || item.productId}
                  </ProductChip>
                ))}
              </BundleProducts>

              <BundlePricing>
                <div>
                  {pricing.discountPercent > 0 && (
                    <OriginalPrice>${pricing.subtotal.toLocaleString()}</OriginalPrice>
                  )}
                  <BundlePrice>
                    ${Math.round(pricing.total).toLocaleString()}
                    {pricing.discountPercent > 0 && (
                      <DiscountBadge>-{pricing.discountPercent}%</DiscountBadge>
                    )}
                  </BundlePrice>
                </div>
                <AddBundleButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddBundle(bundle);
                  }}
                >
                  + Add to Quote
                </AddBundleButton>
              </BundlePricing>
            </BundleCard>
          );
        })}
      </BundlesGrid>
    </BundlesWrapper>
  );
};

export default BundlesSection;
