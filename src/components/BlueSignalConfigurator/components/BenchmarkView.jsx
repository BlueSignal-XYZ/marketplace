// Benchmark View Component - Market Comparison
import React from "react";
import { PRODUCTS } from "../data";
import { COMPETITORS } from "../data";
import {
  SectionTitle,
  BenchmarkGrid,
  BenchmarkCard,
  BenchmarkName,
  BenchmarkPrice,
  BenchmarkSection,
  SavingsCallout,
  Table,
  Th,
  Td,
} from "../styles";

const BenchmarkView = () => {
  const bluesignalProducts = Object.values(PRODUCTS);

  return (
    <div>
      <SectionTitle style={{ marginBottom: 24 }}>Market Comparison</SectionTitle>

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
                    <strong>{p.name}</strong>
                    <br />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{p.subtitle}</span>
                  </Td>
                  <Td style={{ color: "#38bdf8" }}>${p.price.toLocaleString()}</Td>
                  <Td>{p.deployment}</Td>
                  <Td>{p.ultrasonic?.enabled ? `${p.ultrasonic.watts}W` : "—"}</Td>
                  <Td>{p.sensors}</Td>
                  <Td>{p.autonomy}</Td>
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
