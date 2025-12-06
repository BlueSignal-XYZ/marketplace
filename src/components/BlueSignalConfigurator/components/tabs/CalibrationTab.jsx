// Calibration Tab Component
import React from "react";
import { SectionTitle } from "../../styles";
import { CALIBRATION } from "../../data";

const CalibrationTab = ({ product }) => (
  <div>
    <SectionTitle>Sensor Calibration</SectionTitle>

    {Object.entries(CALIBRATION).filter(([key]) => {
      // Only show relevant sensors for this product
      if (key === "dissolvedOxygen" && !product.sensorList.some(s => s.includes("Dissolved") || s.includes("DO"))) return false;
      if (key === "voltageMonitor") return product.battery !== null;
      return true;
    }).map(([key, cal]) => (
      <div key={key} style={{ marginBottom: 24, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16 }}>
        <h4 style={{ color: "#60a5fa", margin: "0 0 12px", fontSize: 16 }}>{cal.name}</h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div>
            <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>Formula</span>
            <p style={{ color: "#e2e8f0", fontSize: 13, fontFamily: "monospace", margin: "4px 0 0" }}>{cal.formula}</p>
          </div>
          {cal.voltageRange && (
            <div>
              <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>Input Range</span>
              <p style={{ color: "#e2e8f0", fontSize: 13, margin: "4px 0 0" }}>{cal.voltageRange}</p>
            </div>
          )}
          {cal.outputRange && (
            <div>
              <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>Output Range</span>
              <p style={{ color: "#e2e8f0", fontSize: 13, margin: "4px 0 0" }}>{cal.outputRange}</p>
            </div>
          )}
          {cal.interval && (
            <div>
              <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>Calibration Interval</span>
              <p style={{ color: "#4ade80", fontSize: 13, fontWeight: 600, margin: "4px 0 0" }}>{cal.interval}</p>
            </div>
          )}
        </div>

        {cal.temperatureCompensation && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>Temperature Compensation</span>
            <p style={{ color: "#fbbf24", fontSize: 12, fontFamily: "monospace", margin: "4px 0 0" }}>{cal.temperatureCompensation}</p>
          </div>
        )}

        {cal.calibrationPoints && (
          <div>
            <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>Calibration Points</span>
            <ul style={{ margin: "8px 0 0", paddingLeft: 16 }}>
              {cal.calibrationPoints.map((point, i) => (
                <li key={i} style={{ color: "#cbd5e1", fontSize: 12, marginBottom: 4 }}>
                  <strong>{point.standard}</strong>: {point.expectedVoltage || point.action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {cal.saturationTable && (
          <div style={{ marginTop: 12 }}>
            <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>DO Saturation Table</span>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
              {Object.entries(cal.saturationTable).map(([temp, value]) => (
                <span key={temp} style={{ background: "rgba(59,130,246,0.2)", padding: "4px 8px", borderRadius: 4, fontSize: 12 }}>
                  {temp}: <strong>{value}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default CalibrationTab;
