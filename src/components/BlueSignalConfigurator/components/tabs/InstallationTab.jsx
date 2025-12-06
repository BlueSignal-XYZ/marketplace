// Installation Tab Component
import React from "react";
import { SectionTitle, SpecGrid, SpecCard, SpecLabel, SpecValue, FeatureList, FeatureItem, Table, Th, Td } from "../../styles";
import { INSTALLATION, TEST_POINTS } from "../../data";

const InstallationTab = ({ product }) => {
  const isFloating = product.deployment === "Floating";
  const installData = isFloating ? INSTALLATION.buoy : INSTALLATION.shore;

  return (
    <div>
      <SectionTitle>Installation Guide</SectionTitle>

      <SpecGrid>
        {Object.entries(installData).filter(([key]) => key !== "anchorSizing" || isFloating).map(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value)) {
            return (
              <SpecCard key={key}>
                <SpecLabel>{key.replace(/([A-Z])/g, " $1").trim()}</SpecLabel>
                <SpecValue style={{ fontSize: 14 }}>
                  {Object.entries(value).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 4 }}>{k}: {v}</div>
                  ))}
                </SpecValue>
              </SpecCard>
            );
          }
          return (
            <SpecCard key={key}>
              <SpecLabel>{key.replace(/([A-Z])/g, " $1").trim()}</SpecLabel>
              <SpecValue style={{ fontSize: 14 }}>{value}</SpecValue>
            </SpecCard>
          );
        })}
      </SpecGrid>

      <div style={{ marginTop: 24 }}>
        <SectionTitle>Required Tools</SectionTitle>
        <FeatureList>
          {INSTALLATION.tools.map((tool, i) => (
            <FeatureItem key={i}>{tool}</FeatureItem>
          ))}
        </FeatureList>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionTitle>Voltage Test Points</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Location</Th>
                <Th>Expected</Th>
                <Th style={{ textAlign: "left" }}>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {TEST_POINTS.map((tp) => (
                <tr key={tp.id}>
                  <Td style={{ fontWeight: 600, color: "#60a5fa" }}>{tp.id}</Td>
                  <Td>{tp.location}</Td>
                  <Td style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {typeof tp.expected === "object"
                      ? (product.battery?.voltage === 24 ? tp.expected["24V"] : tp.expected["12V"])
                      : tp.expected
                    }
                  </Td>
                  <Td style={{ textAlign: "left", color: "#94a3b8", fontSize: 12 }}>{tp.notes}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InstallationTab;
