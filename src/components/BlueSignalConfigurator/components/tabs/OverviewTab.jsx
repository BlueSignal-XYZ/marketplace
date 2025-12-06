// Overview Tab Component
import React from "react";
import { SectionTitle, FeatureList, FeatureItem, SpecGrid, SpecCard, SpecLabel, SpecValue } from "../../styles";

const OverviewTab = ({ product }) => (
  <div>
    {/* SKU Badge */}
    {product.sku && (
      <div style={{ marginBottom: 16 }}>
        <span style={{
          background: "rgba(59, 130, 246, 0.2)",
          border: "1px solid #3b82f6",
          borderRadius: 4,
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: "#60a5fa",
          fontFamily: "monospace"
        }}>
          SKU: {product.sku}
        </span>
      </div>
    )}

    <SectionTitle>Features</SectionTitle>
    <FeatureList>
      {product.features.map((f, i) => (
        <FeatureItem key={i}>{f}</FeatureItem>
      ))}
    </FeatureList>

    <div style={{ marginTop: 24 }}>
      <SectionTitle>Specifications</SectionTitle>
      <SpecGrid>
        <SpecCard>
          <SpecLabel>Deployment</SpecLabel>
          <SpecValue>{product.deployment}</SpecValue>
        </SpecCard>
        <SpecCard>
          <SpecLabel>Power</SpecLabel>
          <SpecValue>
            {product.power.type}
            {product.solar && ` (${product.solar.watts}W)`}
          </SpecValue>
        </SpecCard>
        <SpecCard>
          <SpecLabel>Sensors</SpecLabel>
          <SpecValue>{product.sensors} parameters</SpecValue>
        </SpecCard>
        {product.ultrasonic?.enabled && (
          <SpecCard>
            <SpecLabel>Ultrasonic</SpecLabel>
            <SpecValue>{product.ultrasonic.watts}W × {product.ultrasonic.units} @ {product.ultrasonic.frequency}</SpecValue>
          </SpecCard>
        )}
        {product.battery && (
          <SpecCard>
            <SpecLabel>Battery</SpecLabel>
            <SpecValue>{product.battery.voltage}V {product.battery.capacity}Ah ({product.battery.wh}Wh)</SpecValue>
          </SpecCard>
        )}
        <SpecCard>
          <SpecLabel>Autonomy</SpecLabel>
          <SpecValue>{product.autonomy}</SpecValue>
        </SpecCard>
        <SpecCard>
          <SpecLabel>Weight</SpecLabel>
          <SpecValue>{product.weight}</SpecValue>
        </SpecCard>
        {product.dimensions && (
          <SpecCard>
            <SpecLabel>Dimensions (L×W×H)</SpecLabel>
            <SpecValue>{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height}</SpecValue>
          </SpecCard>
        )}
        {product.enclosure && (
          <SpecCard>
            <SpecLabel>Enclosure</SpecLabel>
            <SpecValue>{product.enclosure}</SpecValue>
          </SpecCard>
        )}
      </SpecGrid>
    </div>

    <div style={{ marginTop: 24 }}>
      <SectionTitle>Sensor Suite</SectionTitle>
      <FeatureList>
        {product.sensorList.map((s, i) => (
          <FeatureItem key={i}>{s}</FeatureItem>
        ))}
      </FeatureList>
    </div>
  </div>
);

export default OverviewTab;
