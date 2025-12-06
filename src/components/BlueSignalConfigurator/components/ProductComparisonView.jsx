// Product Comparison Modal Component
import React from "react";
import {
  ComparisonModal,
  ComparisonContent,
  ComparisonHeader,
  ComparisonTitle,
  CloseButton,
  ComparisonTable,
  ComparisonRow,
  ComparisonLabel,
  ComparisonValue,
  ComparisonProductHeader,
  ProductName,
  ProductSubtitle,
} from "../styles";

const ProductComparisonView = ({ products, onClose }) => {
  const comparisonFields = [
    { key: "price", label: "Price", format: (v) => `$${v.toLocaleString()}` },
    { key: "deployment", label: "Deployment" },
    { key: "power.type", label: "Power Type", path: true },
    { key: "sensors", label: "Sensors", format: (v) => `${v} parameters` },
    { key: "ultrasonic", label: "Ultrasonic", format: (v) => v?.enabled ? `${v.watts}W @ ${v.frequency}` : "None" },
    { key: "battery", label: "Battery", format: (v) => v ? `${v.voltage}V ${v.capacity}Ah (${v.wh}Wh)` : "N/A" },
    { key: "solar", label: "Solar", format: (v) => v ? `${v.watts}W` : "N/A" },
    { key: "autonomy", label: "Autonomy" },
    { key: "weight", label: "Weight" },
  ];

  const getValue = (product, field) => {
    if (field.path) {
      const keys = field.key.split(".");
      let val = product;
      for (const k of keys) val = val?.[k];
      return field.format ? field.format(val) : val;
    }
    const val = product[field.key];
    return field.format ? field.format(val) : val;
  };

  const findBestValue = (field) => {
    if (field.key === "price") {
      return Math.min(...products.map(p => p.price));
    }
    if (field.key === "sensors") {
      return Math.max(...products.map(p => p.sensors));
    }
    return null;
  };

  return (
    <ComparisonModal onClick={onClose}>
      <ComparisonContent onClick={(e) => e.stopPropagation()}>
        <ComparisonHeader>
          <ComparisonTitle>Product Comparison</ComparisonTitle>
          <CloseButton onClick={onClose}>Close (Esc)</CloseButton>
        </ComparisonHeader>
        <ComparisonTable>
          {/* Product headers */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel />
            {products.map((p) => (
              <ComparisonProductHeader key={p.id}>
                <ProductName style={{ marginBottom: 4 }}>{p.name}</ProductName>
                <ProductSubtitle style={{ marginBottom: 0 }}>{p.subtitle}</ProductSubtitle>
              </ComparisonProductHeader>
            ))}
          </ComparisonRow>

          {/* Comparison fields */}
          {comparisonFields.map((field) => {
            const bestValue = findBestValue(field);
            return (
              <ComparisonRow key={field.key} cols={products.length}>
                <ComparisonLabel>{field.label}</ComparisonLabel>
                {products.map((p) => {
                  const value = getValue(p, field);
                  const isBest = field.key === "price"
                    ? p.price === bestValue
                    : field.key === "sensors"
                    ? p.sensors === bestValue
                    : false;
                  return (
                    <ComparisonValue key={p.id} highlight={isBest}>
                      {value}
                    </ComparisonValue>
                  );
                })}
              </ComparisonRow>
            );
          })}

          {/* Sensor list */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel>Sensor List</ComparisonLabel>
            {products.map((p) => (
              <ComparisonValue key={p.id}>
                {p.sensorList.join(", ")}
              </ComparisonValue>
            ))}
          </ComparisonRow>

          {/* BOM Total */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel>BOM Cost</ComparisonLabel>
            {products.map((p) => {
              const bomTotal = p.bom.reduce((sum, item) => sum + item.cost, 0);
              return (
                <ComparisonValue key={p.id}>
                  ${bomTotal.toLocaleString()}
                </ComparisonValue>
              );
            })}
          </ComparisonRow>

          {/* Margin */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel>Margin</ComparisonLabel>
            {products.map((p) => {
              const bomTotal = p.bom.reduce((sum, item) => sum + item.cost, 0);
              const margin = ((p.price - bomTotal) / p.price * 100).toFixed(1);
              return (
                <ComparisonValue key={p.id} highlight={parseFloat(margin) >= 40}>
                  {margin}%
                </ComparisonValue>
              );
            })}
          </ComparisonRow>
        </ComparisonTable>
      </ComparisonContent>
    </ComparisonModal>
  );
};

export default ProductComparisonView;
