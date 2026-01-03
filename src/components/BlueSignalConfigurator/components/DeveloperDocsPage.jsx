// DeveloperDocsPage - Technical documentation for developers
import React, { useState } from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${salesTheme.colors.bgSurface};
`;

const MainContent = styled.main`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  background: ${salesTheme.colors.bgPrimary};
  padding: 60px 24px 80px;
  text-align: center;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px 64px;
  }
`;

const HeroContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 42px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 16px;
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 32px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 28px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  color: ${salesTheme.colors.textSecondary};
  margin: 0 0 32px;
  line-height: 1.6;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const QuickLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: ${salesTheme.colors.textPrimary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
    color: ${salesTheme.colors.accentPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ContentSection = styled.section`
  padding: 60px 24px 80px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px 64px;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 24px;
  letter-spacing: -0.01em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const SectionDescription = styled.p`
  font-size: 16px;
  color: ${salesTheme.colors.textMuted};
  margin: 0 0 32px;
  max-width: 700px;
  line-height: 1.7;
`;

const ProductSelector = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const ProductTab = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid ${props => props.$active ? salesTheme.colors.accentSecondary : salesTheme.colors.border};
  border-radius: 10px;
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.08)' : 'transparent'};
  color: ${props => props.$active ? salesTheme.colors.accentSecondary : salesTheme.colors.textDark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${salesTheme.colors.accentSecondary};
    background: rgba(59, 130, 246, 0.04);
  }
`;

const DocsCard = styled.div`
  background: ${salesTheme.colors.bgCard};
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px;
  }
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 8px;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  margin: 0 0 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${salesTheme.colors.border};
  }

  th {
    font-weight: 600;
    color: ${salesTheme.colors.textDark};
    background: #f9fafb;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    color: ${salesTheme.colors.textMuted};
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 12px;

    th, td {
      padding: 8px 10px;
    }
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 6px;
  background: ${props => {
    switch(props.$category) {
      case 'Compute': return 'rgba(59, 130, 246, 0.1)';
      case 'Connectivity': return 'rgba(139, 92, 246, 0.1)';
      case 'Sensing': return 'rgba(16, 185, 129, 0.1)';
      case 'Power': return 'rgba(245, 158, 11, 0.1)';
      case 'Ultrasonic': return 'rgba(239, 68, 68, 0.1)';
      case 'Housing': return 'rgba(107, 114, 128, 0.1)';
      case 'Hardware': return 'rgba(20, 184, 166, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.$category) {
      case 'Compute': return '#2563eb';
      case 'Connectivity': return '#7c3aed';
      case 'Sensing': return '#059669';
      case 'Power': return '#d97706';
      case 'Ultrasonic': return '#dc2626';
      case 'Housing': return '#4b5563';
      case 'Hardware': return '#0d9488';
      default: return '#4b5563';
    }
  }};
`;

const TotalRow = styled.tr`
  font-weight: 700;
  background: #f0fdf4 !important;

  td {
    color: ${salesTheme.colors.textDark};
    border-top: 2px solid ${salesTheme.colors.accentPrimary};
    padding-top: 16px;
  }
`;

const CodeBlock = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 10px;
  overflow-x: auto;
  font-size: 13px;
  font-family: ${salesTheme.typography.fontMono};
  line-height: 1.6;
  margin: 16px 0;
`;

const GPIOSection = styled.div`
  margin-top: 24px;
`;

const GPIOCategory = styled.div`
  margin-bottom: 20px;
`;

const GPIOTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${salesTheme.colors.accentPrimary};
  }
`;

const GPIOList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GPIOItem = styled.li`
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 13px;
  color: ${salesTheme.colors.textMuted};
  font-family: ${salesTheme.typography.fontMono};
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SpecItem = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
`;

const SpecLabel = styled.div`
  font-size: 12px;
  color: ${salesTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const SpecValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 32px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ResourceCard = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: ${salesTheme.colors.bgCard};
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }
`;

const ResourceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  color: ${salesTheme.colors.accentSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ResourceContent = styled.div`
  flex: 1;
`;

const ResourceTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 4px;
`;

const ResourceDescription = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  margin: 0;
  line-height: 1.5;
`;

export default function DeveloperDocsPage() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("s-ac");
  const product = PRODUCTS[selectedProduct];

  const handleNavigate = (sectionId) => {
    navigate(`/?section=${sectionId}`);
  };

  const bomTotal = product.bom?.reduce((sum, item) => sum + (item.cost * item.qty), 0) || 0;

  return (
    <PageWrapper>
      <SalesHeader
        activeSection="docs"
        onNavigate={handleNavigate}
        quoteItemCount={0}
        onOpenQuote={() => navigate("/?quote=true")}
      />

      <MainContent>
        <HeroSection>
          <HeroContainer>
            <PageTitle>Developer Resources</PageTitle>
            <PageSubtitle>
              Technical documentation, bill of materials, GPIO pinouts, and integration guides for BlueSignal water quality monitoring systems.
            </PageSubtitle>
            <QuickLinks>
              <QuickLink href="https://github.com/NeptuneChain-Inc/bluesignal-firmware" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Firmware Source
              </QuickLink>
              <QuickLink href="https://github.com/NeptuneChain-Inc/bluesignal-hardware" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
                Hardware Designs
              </QuickLink>
            </QuickLinks>
          </HeroContainer>
        </HeroSection>

        <ContentSection>
          <ContentContainer>
            <SectionTitle>Bill of Materials</SectionTitle>
            <SectionDescription>
              Complete component list for each BlueSignal product. All parts are commercially available and can be sourced from standard electronics distributors.
            </SectionDescription>

            <ProductSelector>
              {Object.values(PRODUCTS).map((p) => (
                <ProductTab
                  key={p.id}
                  $active={selectedProduct === p.id}
                  onClick={() => setSelectedProduct(p.id)}
                >
                  {p.name}
                </ProductTab>
              ))}
            </ProductSelector>

            <DocsCard>
              <CardTitle>{product.name} – {product.subtitle}</CardTitle>
              <CardSubtitle>SKU: {product.sku} | Price: ${product.price.toLocaleString()}</CardSubtitle>

              <SpecsGrid>
                <SpecItem>
                  <SpecLabel>Deployment</SpecLabel>
                  <SpecValue>{product.deployment}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>Sensors</SpecLabel>
                  <SpecValue>{product.sensors} ({product.sensorList.join(", ")})</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>Power</SpecLabel>
                  <SpecValue>{product.power.type}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>Autonomy</SpecLabel>
                  <SpecValue>{product.autonomy}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>Enclosure</SpecLabel>
                  <SpecValue>{product.enclosure}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>Weight</SpecLabel>
                  <SpecValue>{product.weight}</SpecValue>
                </SpecItem>
              </SpecsGrid>

              {product.bom && (
                <>
                  <Table>
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th>Category</th>
                        <th style={{ textAlign: 'center' }}>Qty</th>
                        <th style={{ textAlign: 'right' }}>Unit Cost</th>
                        <th style={{ textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.bom.map((item, index) => (
                        <tr key={index}>
                          <td>{item.item}</td>
                          <td><CategoryBadge $category={item.category}>{item.category}</CategoryBadge></td>
                          <td style={{ textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ textAlign: 'right' }}>${item.cost.toFixed(2)}</td>
                          <td style={{ textAlign: 'right' }}>${(item.cost * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                      <TotalRow>
                        <td colSpan="4">Total BOM Cost</td>
                        <td style={{ textAlign: 'right' }}>${bomTotal.toFixed(2)}</td>
                      </TotalRow>
                    </tbody>
                  </Table>
                </>
              )}
            </DocsCard>

            {product.gpio && (
              <DocsCard>
                <CardTitle>GPIO Configuration</CardTitle>
                <CardSubtitle>Raspberry Pi Zero 2 W pin assignments for {product.name}</CardSubtitle>

                <GPIOSection>
                  {product.gpio.i2c && (
                    <GPIOCategory>
                      <GPIOTitle>I2C Bus</GPIOTitle>
                      <GPIOList>
                        {product.gpio.i2c.map((item, idx) => (
                          <GPIOItem key={idx}>{item}</GPIOItem>
                        ))}
                      </GPIOList>
                    </GPIOCategory>
                  )}

                  {product.gpio.uart && (
                    <GPIOCategory>
                      <GPIOTitle>UART</GPIOTitle>
                      <GPIOList>
                        {product.gpio.uart.map((item, idx) => (
                          <GPIOItem key={idx}>{item}</GPIOItem>
                        ))}
                      </GPIOList>
                    </GPIOCategory>
                  )}

                  {product.gpio.gpio && (
                    <GPIOCategory>
                      <GPIOTitle>GPIO Pins</GPIOTitle>
                      <GPIOList>
                        {product.gpio.gpio.map((item, idx) => (
                          <GPIOItem key={idx}>{item}</GPIOItem>
                        ))}
                      </GPIOList>
                    </GPIOCategory>
                  )}
                </GPIOSection>
              </DocsCard>
            )}

            {product.powerTable && (
              <DocsCard>
                <CardTitle>Power Budget</CardTitle>
                <CardSubtitle>Detailed power consumption breakdown | Daily: {product.dailyWh} Wh</CardSubtitle>

                <Table>
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th style={{ textAlign: 'center' }}>Voltage</th>
                      <th style={{ textAlign: 'center' }}>Current (A)</th>
                      <th style={{ textAlign: 'center' }}>Duty %</th>
                      <th style={{ textAlign: 'center' }}>Avg Watts</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.powerTable.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.component}</td>
                        <td style={{ textAlign: 'center' }}>{row.voltage}V</td>
                        <td style={{ textAlign: 'center' }}>{row.current}</td>
                        <td style={{ textAlign: 'center' }}>{row.duty}%</td>
                        <td style={{ textAlign: 'center' }}>{row.avgWatts}W</td>
                        <td>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </DocsCard>
            )}

            <DocsCard>
              <CardTitle>MQTT Integration</CardTitle>
              <CardSubtitle>Connect to BlueSignal devices via MQTT for real-time data streaming</CardSubtitle>

              <CodeBlock>{`# MQTT Broker
Broker: mqtt.bluesignal.xyz
Port: 8883 (TLS) / 1883 (dev)
Protocol: MQTT 3.1.1 / 5.0

# Topic Structure
bluesignal/{account_id}/{device_id}/readings
bluesignal/{account_id}/{device_id}/status
bluesignal/{account_id}/{device_id}/command

# Example Payload (readings)
{
  "ts": 1704293400,
  "t": 18.5,      // Temperature (°C)
  "ph": 7.2,      // pH level
  "tds": 342,     // Total dissolved solids (ppm)
  "turb": 12.4,   // Turbidity (NTU)
  "bat": 12.8,    // Battery voltage (V)
  "sol": 45.2,    // Solar power (W)
  "rssi": -72     // Signal strength (dBm)
}`}</CodeBlock>
            </DocsCard>

            <DocsCard>
              <CardTitle>REST API</CardTitle>
              <CardSubtitle>Query historical data and manage devices via the BlueSignal API</CardSubtitle>

              <CodeBlock>{`# Base URL
https://api.bluesignal.xyz/v1

# Authentication
Authorization: Bearer YOUR_API_KEY

# Get Device Readings
GET /devices/{deviceId}/readings?limit=100&since=2025-01-01

# Response
{
  "device_id": "bs-001",
  "readings": [
    {
      "timestamp": "2025-01-03T12:00:00Z",
      "temperature_c": 18.5,
      "ph": 7.2,
      "tds_ppm": 342,
      "turbidity_ntu": 12.4,
      "battery_v": 12.8,
      "solar_w": 45.2
    }
  ],
  "pagination": {
    "total": 8640,
    "limit": 100,
    "offset": 0
  }
}`}</CodeBlock>
            </DocsCard>

            <SectionTitle style={{ marginTop: '48px' }}>Additional Resources</SectionTitle>
            <ResourcesGrid>
              <ResourceCard href="https://github.com/NeptuneChain-Inc/bluesignal-firmware" target="_blank" rel="noopener noreferrer">
                <ResourceIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </ResourceIcon>
                <ResourceContent>
                  <ResourceTitle>Firmware Repository</ResourceTitle>
                  <ResourceDescription>Python-based firmware for Raspberry Pi Zero 2 W. Includes sensor drivers, MQTT client, and OTA update support.</ResourceDescription>
                </ResourceContent>
              </ResourceCard>

              <ResourceCard href="https://github.com/NeptuneChain-Inc/bluesignal-hardware" target="_blank" rel="noopener noreferrer">
                <ResourceIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                  </svg>
                </ResourceIcon>
                <ResourceContent>
                  <ResourceTitle>Hardware Designs</ResourceTitle>
                  <ResourceDescription>CAD files, enclosure designs, wiring diagrams, and PCB layouts for all BlueSignal products.</ResourceDescription>
                </ResourceContent>
              </ResourceCard>

              <ResourceCard href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>
                <ResourceIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </ResourceIcon>
                <ResourceContent>
                  <ResourceTitle>Developer Support</ResourceTitle>
                  <ResourceDescription>Have questions? Contact our engineering team for integration help and custom development requests.</ResourceDescription>
                </ResourceContent>
              </ResourceCard>

              <ResourceCard href="#calculator" onClick={(e) => { e.preventDefault(); navigate('/?section=calculator'); }}>
                <ResourceIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="8" y1="10" x2="12" y2="10" />
                    <line x1="8" y1="14" x2="12" y2="14" />
                    <line x1="8" y1="18" x2="12" y2="18" />
                    <rect x="14" y="10" width="2" height="8" />
                  </svg>
                </ResourceIcon>
                <ResourceContent>
                  <ResourceTitle>ROI Calculator</ResourceTitle>
                  <ResourceDescription>Calculate your return on investment for water quality monitoring and credit generation potential.</ResourceDescription>
                </ResourceContent>
              </ResourceCard>
            </ResourcesGrid>
          </ContentContainer>
        </ContentSection>
      </MainContent>

      <SalesFooter onNavigate={handleNavigate} />
    </PageWrapper>
  );
}
