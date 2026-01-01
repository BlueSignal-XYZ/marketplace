// Benchmark View Component - Market Comparison
import React from "react";
import styled from "styled-components";
import { PRODUCTS } from "../data";
import { COMPETITORS } from "../data";
import { salesTheme } from "../styles/theme";

// Dark-mode compatible styled components for Benchmark section
const BenchmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`;

const BenchmarkCard = styled.div`
  background: ${({ highlight }) =>
    highlight
      ? `linear-gradient(135deg, ${salesTheme.colors.accentPrimary}15 0%, ${salesTheme.colors.accentPrimary}25 100%)`
      : "rgba(255, 255, 255, 0.05)"};
  border: 2px solid ${({ highlight }) => (highlight ? salesTheme.colors.accentPrimary : "rgba(255, 255, 255, 0.1)")};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }
`;

const BenchmarkName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 8px;
`;

const BenchmarkPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ highlight }) => (highlight ? salesTheme.colors.accentPrimary : "#f59e0b")};
  margin-bottom: 16px;
`;

const BenchmarkSection = styled.div`
  margin-bottom: 12px;

  h5 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${salesTheme.colors.textSecondary};
    margin: 0 0 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 14px;
      color: ${salesTheme.colors.textPrimary};
      padding: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: "${({ type }) => (type === "pro" ? "✓" : "✗")}";
        color: ${({ type }) => (type === "pro" ? salesTheme.colors.accentPrimary : "#ef4444")};
        font-weight: 600;
      }
    }
  }
`;

const SavingsCallout = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 1px solid ${salesTheme.colors.accentPrimary};
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
  text-align: center;

  h4 {
    font-size: 18px;
    color: ${salesTheme.colors.accentPrimary};
    margin: 0 0 12px;
    font-weight: 700;
  }

  p {
    font-size: 15px;
    color: ${salesTheme.colors.textPrimary};
    margin: 0;
    line-height: 1.6;
  }

  strong {
    color: ${salesTheme.colors.accentPrimary};
  }
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  color: ${salesTheme.colors.textPrimary};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  border-radius: 12px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.08);
  color: ${salesTheme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    text-align: right;
  }
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: ${salesTheme.colors.textPrimary};

  &:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

const BenchmarkView = () => {
  const bluesignalProducts = Object.values(PRODUCTS);

  return (
    <div>
      <BenchmarkGrid>
        {/* Enterprise Algae Control */}
        <BenchmarkCard>
          <BenchmarkName>{COMPETITORS.enterprise.name}</BenchmarkName>
          <BenchmarkPrice>{COMPETITORS.enterprise.priceRange}</BenchmarkPrice>
          <BenchmarkSection type="pro">
            <h5>Capabilities</h5>
            <ul>
              {COMPETITORS.enterprise.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </BenchmarkSection>
          <BenchmarkSection type="con">
            <h5>Limitations</h5>
            <ul>
              {COMPETITORS.enterprise.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </BenchmarkSection>
        </BenchmarkCard>

        {/* Pro Sondes */}
        <BenchmarkCard>
          <BenchmarkName>{COMPETITORS.proSondes.name}</BenchmarkName>
          <BenchmarkPrice>{COMPETITORS.proSondes.priceRange}</BenchmarkPrice>
          <BenchmarkSection type="pro">
            <h5>Capabilities</h5>
            <ul>
              {COMPETITORS.proSondes.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </BenchmarkSection>
          <BenchmarkSection type="con">
            <h5>Limitations</h5>
            <ul>
              {COMPETITORS.proSondes.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </BenchmarkSection>
        </BenchmarkCard>

        {/* BlueSignal */}
        <BenchmarkCard highlight>
          <BenchmarkName>BlueSignal Platform</BenchmarkName>
          <BenchmarkPrice highlight>$599 - $19,999</BenchmarkPrice>
          <BenchmarkSection type="pro">
            <h5>Capabilities</h5>
            <ul>
              <li>Integrated algae control + monitoring</li>
              <li>LTE connectivity included</li>
              <li>Cloud dashboard & alerts</li>
              <li>Solar-powered options</li>
              <li>Floating & shore deployments</li>
              <li>Open platform (Pi-based)</li>
            </ul>
          </BenchmarkSection>
          <BenchmarkSection type="pro">
            <h5>Unique Value</h5>
            <ul>
              <li>ONLY affordable option with both</li>
              <li>monitoring AND control</li>
            </ul>
          </BenchmarkSection>
        </BenchmarkCard>
      </BenchmarkGrid>

      <SavingsCallout>
        <h4>Cost Advantage</h4>
        <p>
          BlueSignal delivers <strong>algae control + water quality monitoring</strong> starting at{" "}
          <strong>$599</strong> — compared to <strong>$36,000+</strong> for equivalent enterprise
          solutions (ultrasonic system + multi-parameter sonde).
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>That's up to 98% cost savings</strong> with integrated LTE connectivity and cloud
          dashboard included.
        </p>
      </SavingsCallout>

      {/* Product comparison table */}
      <div style={{ marginTop: 32 }}>
        <SectionTitle>BlueSignal Product Line</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Model</Th>
                <Th>Price</Th>
                <Th>Deployment</Th>
                <Th>Ultrasonic</Th>
                <Th>Sensors</Th>
                <Th>Autonomy</Th>
              </tr>
            </thead>
            <tbody>
              {bluesignalProducts.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <strong style={{ color: salesTheme.colors.textPrimary }}>{p.name}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: salesTheme.colors.textSecondary }}>{p.subtitle}</span>
                  </Td>
                  <Td style={{ color: salesTheme.colors.accentPrimary, fontWeight: 700 }}>${p.price.toLocaleString()}</Td>
                  <Td style={{ color: salesTheme.colors.textSecondary }}>{p.deployment}</Td>
                  <Td style={{ color: salesTheme.colors.textSecondary }}>{p.ultrasonic?.enabled ? `${p.ultrasonic.watts}W` : "—"}</Td>
                  <Td style={{ color: salesTheme.colors.textSecondary }}>{p.sensors}</Td>
                  <Td style={{ color: salesTheme.colors.textSecondary }}>{p.autonomy}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkView;
