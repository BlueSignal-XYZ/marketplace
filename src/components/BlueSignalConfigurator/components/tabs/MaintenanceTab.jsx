// Maintenance Tab Component
import React from "react";
import { SectionTitle, Table, Th, Td } from "../../styles";
import { MAINTENANCE, LED_CODES, LED_COLORS } from "../../data";

const MaintenanceTab = ({ product }) => {
  const hasDO = product.sensorList.some(s => s.includes("Dissolved") || s.includes("DO"));
  const isBuoy = product.deployment === "Floating";

  const relevantMaintenance = MAINTENANCE.filter(m => {
    if (m.component.includes("DO") && !hasDO) return false;
    if (m.component.includes("Buoy") && !isBuoy) return false;
    if (m.component.includes("Mooring") && !isBuoy) return false;
    if (m.component.includes("Solar") && !product.solar) return false;
    return true;
  });

  return (
    <div>
      <SectionTitle>Maintenance Schedule</SectionTitle>

      <div style={{ overflowX: "auto" }}>
        <Table>
          <thead>
            <tr>
              <Th>Component</Th>
              <Th>Interval</Th>
              <Th style={{ textAlign: "left" }}>Action</Th>
              <Th>Cost</Th>
            </tr>
          </thead>
          <tbody>
            {relevantMaintenance.map((m, i) => (
              <tr key={i}>
                <Td style={{ fontWeight: 600 }}>{m.component}</Td>
                <Td>
                  <span style={{
                    background: m.interval.includes("day") ? "rgba(74,222,128,0.2)" : "rgba(251,146,60,0.2)",
                    color: m.interval.includes("day") ? "#4ade80" : "#fb923c",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                  }}>
                    {m.interval}
                  </span>
                </Td>
                <Td style={{ textAlign: "left" }}>{m.action}</Td>
                <Td style={{ color: m.cost ? "#f87171" : "#4ade80" }}>{m.cost || "Free"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionTitle>LED Status Codes</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Pattern</Th>
                <Th>Color</Th>
                <Th style={{ textAlign: "left" }}>Meaning</Th>
                <Th style={{ textAlign: "left" }}>Action</Th>
              </tr>
            </thead>
            <tbody>
              {LED_CODES.map((led, i) => (
                <tr key={i}>
                  <Td style={{ fontFamily: "monospace", fontSize: 12 }}>{led.pattern}</Td>
                  <Td>
                    <span style={{
                      background: LED_COLORS[led.color] || "#64748b",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {led.color}
                    </span>
                  </Td>
                  <Td style={{ textAlign: "left", fontSize: 13 }}>{led.meaning}</Td>
                  <Td style={{ textAlign: "left", color: led.action ? "#fbbf24" : "#64748b", fontSize: 12 }}>
                    {led.action || "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTab;
