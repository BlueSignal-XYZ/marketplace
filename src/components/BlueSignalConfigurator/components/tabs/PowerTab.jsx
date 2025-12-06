// Power Tab Component
import React from "react";
import { SectionTitle, SpecGrid, SpecCard, SpecLabel, SpecValue, Table, Th, Td, TotalRow } from "../../styles";

const PowerTab = ({ product }) => {
  const totalAvgWatts = product.powerTable.reduce((sum, row) => sum + row.avgWatts, 0);
  const dailyWh = product.dailyWh || totalAvgWatts * 24;
  const batteryWh = product.battery?.wh || 0;
  const calculatedAutonomy = batteryWh > 0 ? (batteryWh / (dailyWh / 24)).toFixed(1) : "N/A";

  return (
    <div>
      <SectionTitle>Power Budget</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <Table>
          <thead>
            <tr>
              <Th>Component</Th>
              <Th>Voltage</Th>
              <Th>Current (A)</Th>
              <Th>Duty %</Th>
              <Th>Avg Watts</Th>
              <Th style={{ textAlign: "left" }}>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {product.powerTable.map((row, i) => (
              <tr key={i}>
                <Td>{row.component}</Td>
                <Td>{row.voltage}V</Td>
                <Td>{row.current}</Td>
                <Td>{row.duty}%</Td>
                <Td>{row.avgWatts.toFixed(2)}W</Td>
                <Td style={{ textAlign: "left", color: "#94a3b8", fontSize: 12 }}>{row.notes || "—"}</Td>
              </tr>
            ))}
            <TotalRow>
              <Td colSpan={4}>Total Average Power</Td>
              <Td>{totalAvgWatts.toFixed(2)}W</Td>
              <Td></Td>
            </TotalRow>
          </tbody>
        </Table>
      </div>

      <SpecGrid style={{ marginTop: 24 }}>
        <SpecCard>
          <SpecLabel>Daily Consumption</SpecLabel>
          <SpecValue>{dailyWh.toFixed(0)} Wh</SpecValue>
        </SpecCard>
        {product.battery && (
          <>
            <SpecCard>
              <SpecLabel>Battery Capacity</SpecLabel>
              <SpecValue>{product.battery.wh} Wh</SpecValue>
            </SpecCard>
            <SpecCard>
              <SpecLabel>Calculated Autonomy</SpecLabel>
              <SpecValue>{calculatedAutonomy} days</SpecValue>
            </SpecCard>
          </>
        )}
        {product.solar && (
          <SpecCard>
            <SpecLabel>Solar Input</SpecLabel>
            <SpecValue>{product.solar.watts}W ({product.solar.panels} panel{product.solar.panels > 1 ? "s" : ""})</SpecValue>
          </SpecCard>
        )}
      </SpecGrid>
    </div>
  );
};

export default PowerTab;
