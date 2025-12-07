// Enhanced Specs Tab with Expandable Sections
import React from "react";
import styled from "styled-components";
import { ExpandableSection, BlueSignalCTA } from "../shared";
import { SectionTitle, SpecGrid, SpecCard, SpecLabel, SpecValue, Table, Th, Td } from "../../styles";
import { FULL_SPECS, GPIO_PINOUT, GPIO_TYPE_COLORS } from "../../data";

const QuickSpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const QuickSpec = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
`;

const QuickSpecLabel = styled.div`
  font-size: 11px;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const QuickSpecValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

const SpecsTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.8);

  &:nth-child(odd) {
    background: rgba(15, 23, 42, 0.6);
  }
`;

const SpecRowLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

const SpecRowValue = styled.span`
  font-size: 12px;
  color: #e2e8f0;
  font-weight: 500;
  text-align: right;
`;

const CertBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin: 2px 4px 2px 0;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
`;

const GpioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const GpioSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 14px;
`;

const GpioTitle = styled.h6`
  font-size: 12px;
  font-weight: 600;
  color: #60a5fa;
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const GpioList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 12px;
    color: #cbd5e1;
    padding: 4px 0;
    font-family: "SF Mono", Monaco, monospace;
  }
`;

const SpecsTab = ({ product }) => {
  const fullSpecs = FULL_SPECS[product.id] || {};
  const hasGpio = product.gpio && (product.gpio.i2c?.length || product.gpio.gpio?.length);

  // Quick specs (always visible at top)
  const quickSpecs = [
    { label: 'Deployment', value: product.deployment },
    { label: 'Power', value: product.power.type + (product.solar ? ` (${product.solar.watts}W)` : '') },
    { label: 'Sensors', value: `${product.sensors} parameters` },
    { label: 'Autonomy', value: product.autonomy },
    { label: 'Weight', value: product.weight },
    { label: 'IP Rating', value: fullSpecs.ipRating || product.enclosure },
  ];

  // Environmental specs
  const envSpecs = [
    { label: 'Operating Temp', value: fullSpecs.operatingTemp },
    { label: 'Storage Temp', value: fullSpecs.storageTemp },
    { label: 'Humidity', value: fullSpecs.humidity },
    { label: 'IP Rating', value: fullSpecs.ipRating },
    { label: 'IP Description', value: fullSpecs.ipDescription },
  ].filter(s => s.value);

  // Electrical specs
  const elecSpecs = [
    { label: 'Input Voltage', value: fullSpecs.inputVoltage },
    { label: 'Power Consumption', value: fullSpecs.powerConsumption },
    { label: 'Battery Type', value: fullSpecs.batteryType },
    { label: 'Battery Capacity', value: fullSpecs.batteryCapacity },
    { label: 'Battery Cycles', value: fullSpecs.batteryCycles },
    { label: 'Charging Temp', value: fullSpecs.chargingTemp },
    { label: 'Solar Panel', value: fullSpecs.solarPanel },
    { label: 'MPPT Controller', value: fullSpecs.mpptController },
    { label: 'LVD', value: fullSpecs.lvd },
    { label: 'Inverter', value: fullSpecs.inverter },
  ].filter(s => s.value);

  // Connectivity specs
  const connSpecs = [
    { label: 'Cellular', value: fullSpecs.cellular },
    { label: 'Fallback', value: fullSpecs.cellularFallback },
    { label: 'GPS Accuracy', value: fullSpecs.gpsAccuracy },
    { label: 'Data Usage', value: fullSpecs.dataUsage },
    { label: 'Antenna Type', value: fullSpecs.antennaType },
  ].filter(s => s.value);

  // Physical specs (for buoys)
  const physSpecs = [
    { label: 'Hull Material', value: fullSpecs.hullMaterial },
    { label: 'Hull Config', value: fullSpecs.hullConfig },
    { label: 'Hull Color', value: fullSpecs.hullColor },
    { label: 'Max Wave Height', value: fullSpecs.maxWaveHeight },
    { label: 'Max Wind Speed', value: fullSpecs.maxWindSpeed },
    { label: 'Freeboard', value: fullSpecs.freeboard },
    { label: 'Displacement', value: fullSpecs.displacement },
    { label: 'Antifouling', value: fullSpecs.antifouling },
    { label: 'Nav Light', value: fullSpecs.navLight },
    { label: 'Dimensions', value: fullSpecs.dimensions },
    { label: 'Mooring Depth', value: fullSpecs.mooringDepth },
  ].filter(s => s.value);

  // Maintenance specs
  const maintSpecs = [
    { label: 'Sensor Lifespan', value: fullSpecs.sensorLifespan },
    { label: 'Warranty', value: fullSpecs.warrantyPeriod },
    { label: 'Calibration Interval', value: fullSpecs.calibrationInterval },
    { label: 'Upgrade Note', value: fullSpecs.upgradeNote },
  ].filter(s => s.value);

  return (
    <div>
      {/* Quick Specs - Always Visible */}
      <SectionTitle>Quick Specs</SectionTitle>
      <QuickSpecsGrid>
        {quickSpecs.map((spec, i) => (
          <QuickSpec key={i}>
            <QuickSpecLabel>{spec.label}</QuickSpecLabel>
            <QuickSpecValue>{spec.value}</QuickSpecValue>
          </QuickSpec>
        ))}
      </QuickSpecsGrid>

      {/* Expandable Sections */}
      {envSpecs.length > 0 && (
        <ExpandableSection
          id="environmental"
          title="Environmental Ratings"
          icon="🌡️"
          badge={`${envSpecs.length} specs`}
        >
          <SpecsTable>
            {envSpecs.map((spec, i) => (
              <SpecRow key={i}>
                <SpecRowLabel>{spec.label}</SpecRowLabel>
                <SpecRowValue>{spec.value}</SpecRowValue>
              </SpecRow>
            ))}
          </SpecsTable>
        </ExpandableSection>
      )}

      {elecSpecs.length > 0 && (
        <ExpandableSection
          id="electrical"
          title="Electrical Specifications"
          icon="⚡"
          badge={`${elecSpecs.length} specs`}
        >
          <SpecsTable>
            {elecSpecs.map((spec, i) => (
              <SpecRow key={i}>
                <SpecRowLabel>{spec.label}</SpecRowLabel>
                <SpecRowValue>{spec.value}</SpecRowValue>
              </SpecRow>
            ))}
          </SpecsTable>
        </ExpandableSection>
      )}

      {connSpecs.length > 0 && (
        <ExpandableSection
          id="connectivity"
          title="Connectivity"
          icon="📡"
          badge={`${connSpecs.length} specs`}
        >
          <SpecsTable>
            {connSpecs.map((spec, i) => (
              <SpecRow key={i}>
                <SpecRowLabel>{spec.label}</SpecRowLabel>
                <SpecRowValue>{spec.value}</SpecRowValue>
              </SpecRow>
            ))}
          </SpecsTable>
        </ExpandableSection>
      )}

      {physSpecs.length > 0 && (
        <ExpandableSection
          id="physical"
          title="Physical / Hull Specifications"
          icon="🚢"
          badge={`${physSpecs.length} specs`}
        >
          <SpecsTable>
            {physSpecs.map((spec, i) => (
              <SpecRow key={i}>
                <SpecRowLabel>{spec.label}</SpecRowLabel>
                <SpecRowValue>{spec.value}</SpecRowValue>
              </SpecRow>
            ))}
          </SpecsTable>
        </ExpandableSection>
      )}

      {hasGpio && (
        <ExpandableSection
          id="gpio"
          title="GPIO & Pinout"
          icon="🔌"
        >
          <GpioGrid>
            {product.gpio.i2c?.length > 0 && (
              <GpioSection>
                <GpioTitle>I2C Bus</GpioTitle>
                <GpioList>
                  {product.gpio.i2c.map((pin, i) => <li key={i}>{pin}</li>)}
                </GpioList>
              </GpioSection>
            )}
            {product.gpio.uart?.length > 0 && (
              <GpioSection>
                <GpioTitle>UART</GpioTitle>
                <GpioList>
                  {product.gpio.uart.map((pin, i) => <li key={i}>{pin}</li>)}
                </GpioList>
              </GpioSection>
            )}
            {product.gpio.oneWire?.length > 0 && (
              <GpioSection>
                <GpioTitle>1-Wire</GpioTitle>
                <GpioList>
                  {product.gpio.oneWire.map((pin, i) => <li key={i}>{pin}</li>)}
                </GpioList>
              </GpioSection>
            )}
            {product.gpio.gpio?.length > 0 && (
              <GpioSection>
                <GpioTitle>Digital GPIO</GpioTitle>
                <GpioList>
                  {product.gpio.gpio.map((pin, i) => <li key={i}>{pin}</li>)}
                </GpioList>
              </GpioSection>
            )}
          </GpioGrid>
        </ExpandableSection>
      )}

      {maintSpecs.length > 0 && (
        <ExpandableSection
          id="maintenance"
          title="Maintenance & Warranty"
          icon="🔧"
          badge={`${maintSpecs.length} specs`}
        >
          <SpecsTable>
            {maintSpecs.map((spec, i) => (
              <SpecRow key={i}>
                <SpecRowLabel>{spec.label}</SpecRowLabel>
                <SpecRowValue>{spec.value}</SpecRowValue>
              </SpecRow>
            ))}
          </SpecsTable>
        </ExpandableSection>
      )}

      {fullSpecs.certifications?.length > 0 && (
        <ExpandableSection
          id="certifications"
          title="Certifications"
          icon="✓"
          badge={`${fullSpecs.certifications.length}`}
          badgeVariant="success"
        >
          <div style={{ padding: '8px 0' }}>
            {fullSpecs.certifications.map((cert, i) => (
              <CertBadge key={i}>{cert}</CertBadge>
            ))}
          </div>
        </ExpandableSection>
      )}

      {/* BlueSignal CTA */}
      <BlueSignalCTA productSlug={product.id} variant="banner" />
    </div>
  );
};

export default SpecsTab;
