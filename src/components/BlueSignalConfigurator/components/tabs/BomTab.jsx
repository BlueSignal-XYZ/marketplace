// BOM Tab Component
import React from "react";
import { SectionTitle, Table, Th, Td, TotalRow, MarginBadge } from "../../styles";

const BomTab = ({ product }) => {
  const totalCost = product.bom.reduce((sum, item) => sum + item.cost, 0);
  const margin = ((product.price - totalCost) / product.price * 100).toFixed(1);
  const marginGood = parseFloat(margin) >= 30;

  // Group by category
  const categories = [...new Set(product.bom.map((item) => item.category))];

  return (
    <div>
      <SectionTitle>
        Bill of Materials
        <MarginBadge good={marginGood}>{margin}% margin</MarginBadge>
      </SectionTitle>

      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <h5 style={{ fontSize: 14, color: "#60a5fa", margin: "0 0 8px" }}>{cat}</h5>
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Qty</Th>
                <Th>Cost</Th>
              </tr>
            </thead>
            <tbody>
              {product.bom
                .filter((item) => item.category === cat)
                .map((item, i) => (
                  <tr key={i}>
                    <Td>{item.item}</Td>
                    <Td>{item.qty}</Td>
                    <Td>${item.cost.toLocaleString()}</Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ))}

      <Table>
        <tbody>
          <tr style={{ background: "rgba(0,0,0,0.3)" }}>
            <Td><strong>BOM Total</strong></Td>
            <Td></Td>
            <Td><strong>${totalCost.toLocaleString()}</strong></Td>
          </tr>
          <TotalRow>
            <Td><strong>Retail Price</strong></Td>
            <Td></Td>
            <Td><strong>${product.price.toLocaleString()}</strong></Td>
          </TotalRow>
          <tr>
            <Td>Gross Profit</Td>
            <Td></Td>
            <Td>${(product.price - totalCost).toLocaleString()} ({margin}%)</Td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default BomTab;
