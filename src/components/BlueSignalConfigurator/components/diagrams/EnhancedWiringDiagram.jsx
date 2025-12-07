// EnhancedWiringDiagram - Realistic wiring diagram with wire runs and test points
import React, { useState } from "react";
import styled from "styled-components";
import { WIRING_DIAGRAMS, WIRE_LEGEND } from "../../data";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DiagramCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

const DiagramTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
`;

const SvgWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;

  svg {
    display: block;
    width: 100%;
    max-height: 600px;
  }
`;

const LegendCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

const LegendTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div`
  width: 24px;
  height: 12px;
  border-radius: 2px;
  background: ${({ color }) => color};
  border: ${({ border }) => (border ? "1px solid #9ca3af" : "none")};
`;

const LegendInfo = styled.div``;

const LegendLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #374151;
`;

const LegendGauge = styled.div`
  font-size: 10px;
  color: #6b7280;
`;

const TestPointsCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

const TestPointsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
`;

const TestPointsGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestPoint = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
`;

const TestPointBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fef3c7;
  color: #b45309;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
`;

const TestPointInfo = styled.div``;

const TestPointLocation = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const TestPointProbe = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const TestPointExpected = styled.div`
  font-size: 12px;
  font-family: monospace;
  color: #059669;
  margin-top: 4px;
`;

const SafetyCard = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
`;

const SafetyIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const SafetyContent = styled.div``;

const SafetyTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 8px;
`;

const SafetyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SafetyItem = styled.li`
  font-size: 12px;
  color: #b91c1c;
  padding: 2px 0;

  &::before {
    content: "•";
    margin-right: 8px;
  }
`;

const WireRunsCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

const WireRunsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
`;

const WireRunsTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 12px;
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: top;
`;

const WireColor = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "";
    width: 12px;
    height: 4px;
    border-radius: 1px;
    background: ${({ color }) => color || "#9ca3af"};
    border: ${({ hasBorder }) => (hasBorder ? "1px solid #9ca3af" : "none")};
  }
`;

const Notes = styled.span`
  font-size: 11px;
  color: #6b7280;
  font-style: italic;
`;

// Color mapping for wire types
const getWireColor = (type, color) => {
  const colorMap = {
    ac: "#1f2937",
    power: "#dc2626",
    ground: "#1f2937",
    signal: "#22c55e",
    data: "#3b82f6",
  };
  return color?.toLowerCase().includes("white")
    ? "#f3f4f6"
    : colorMap[type] || "#9ca3af";
};

const EnhancedWiringDiagram = ({ product }) => {
  const [hoveredWire, setHoveredWire] = useState(null);
  const diagram = WIRING_DIAGRAMS[product.id];

  if (!diagram) {
    return (
      <Container>
        <DiagramCard>
          <DiagramTitle>Wiring Diagram</DiagramTitle>
          <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
            Detailed wiring diagram not available for this product
          </div>
        </DiagramCard>
      </Container>
    );
  }

  const hasAC =
    product.power.type === "AC" || diagram.buses.some((b) => b.id.includes("ac"));

  return (
    <Container>
      {/* Main Diagram */}
      <DiagramCard>
        <DiagramTitle>{product.name} - {diagram.description}</DiagramTitle>
        <SvgWrapper>
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            {/* Background grid */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#grid)" />

            {/* Zone separators for AC products */}
            {hasAC && (
              <>
                <line
                  x1="0"
                  y1="320"
                  x2="800"
                  y2="320"
                  stroke="#fca5a5"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                />
                <text x="10" y="310" fontSize="11" fill="#dc2626" fontWeight="600">
                  AC ZONE BELOW (120V)
                </text>
                <text x="10" y="30" fontSize="11" fill="#374151" fontWeight="600">
                  DC ZONE ({diagram.buses.find(b => b.id === '24v' || b.id === '12v')?.voltage || '12V'})
                </text>
              </>
            )}

            {/* Voltage Buses */}
            {diagram.buses.filter(b => b.rail).map((bus, idx) => (
              <g key={bus.id}>
                <line
                  x1="50"
                  y1={80 + idx * 30}
                  x2="750"
                  y2={80 + idx * 30}
                  stroke={bus.color}
                  strokeWidth={idx === 0 ? 4 : 3}
                />
                <text
                  x="55"
                  y={95 + idx * 30}
                  fontSize="10"
                  fill={bus.color}
                  fontWeight="600"
                >
                  {bus.name} ({bus.voltage})
                </text>
              </g>
            ))}

            {/* GND Bus at bottom */}
            <line x1="50" y1="460" x2="750" y2="460" stroke="#64748b" strokeWidth="4" />
            <text x="55" y="475" fontSize="10" fill="#64748b" fontWeight="600">
              Ground (0V)
            </text>

            {/* Component Blocks */}
            {/* Power Source */}
            <g transform="translate(70, 180)">
              <rect
                width="100"
                height="70"
                rx="6"
                fill={product.power.type === "AC" ? "#fef3c7" : "#dcfce7"}
                stroke={product.power.type === "AC" ? "#f59e0b" : "#16a34a"}
                strokeWidth="2"
              />
              <text
                x="50"
                y="25"
                textAnchor="middle"
                fill={product.power.type === "AC" ? "#b45309" : "#166534"}
                fontSize="10"
                fontWeight="600"
              >
                {product.power.type === "AC" ? "AC/DC PSU" : "SOLAR + MPPT"}
              </text>
              {product.solar && (
                <text x="50" y="45" textAnchor="middle" fill="#374151" fontSize="9">
                  {product.solar.watts}W Panel
                </text>
              )}
              {product.power.type === "AC" && (
                <text x="50" y="45" textAnchor="middle" fill="#374151" fontSize="9">
                  {product.power.voltage}
                </text>
              )}
            </g>

            {/* Battery (if present) */}
            {product.battery && (
              <g transform="translate(200, 180)">
                <rect
                  width="90"
                  height="70"
                  rx="6"
                  fill="#dcfce7"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                <text
                  x="45"
                  y="25"
                  textAnchor="middle"
                  fill="#166534"
                  fontSize="10"
                  fontWeight="600"
                >
                  BATTERY
                </text>
                <text x="45" y="42" textAnchor="middle" fill="#374151" fontSize="9">
                  {product.battery.voltage}V {product.battery.capacity}Ah
                </text>
                <text x="45" y="55" textAnchor="middle" fill="#6b7280" fontSize="8">
                  LiFePO4
                </text>
              </g>
            )}

            {/* Buck Converter */}
            <g transform="translate(320, 180)">
              <rect
                width="80"
                height="50"
                rx="6"
                fill="#fef3c7"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text x="40" y="20" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="600">
                BUCK
              </text>
              <text x="40" y="36" textAnchor="middle" fill="#374151" fontSize="9">
                → 5V DC
              </text>
            </g>

            {/* Controller */}
            <g transform="translate(430, 170)">
              <rect
                width="110"
                height="80"
                rx="6"
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <text x="55" y="22" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">
                {product.id === "smart-buoy-xl" ? "Pi CM4" : "Pi Zero 2W"}
              </text>
              <text x="55" y="40" textAnchor="middle" fill="#374151" fontSize="9">
                Controller
              </text>
              <text x="55" y="55" textAnchor="middle" fill="#6b7280" fontSize="8">
                I2C / UART / GPIO
              </text>
              {/* GPIO pins */}
              <rect x="95" y="25" width="8" height="35" fill="#1e3a5f" rx="1" />
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx="99" cy={30 + i * 8} r="2.5" fill="#60a5fa" />
              ))}
            </g>

            {/* LTE HAT */}
            <g transform="translate(570, 175)">
              <rect
                width="90"
                height="60"
                rx="6"
                fill="#e0e7ff"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <text x="45" y="22" textAnchor="middle" fill="#4338ca" fontSize="10" fontWeight="600">
                SIM7670G
              </text>
              <text x="45" y="38" textAnchor="middle" fill="#374151" fontSize="9">
                LTE Cat-1 HAT
              </text>
              <text x="45" y="52" textAnchor="middle" fill="#6b7280" fontSize="8">
                UART
              </text>
            </g>

            {/* ADC */}
            <g transform="translate(320, 280)">
              <rect
                width="70"
                height="50"
                rx="6"
                fill="#f3e8ff"
                stroke="#9333ea"
                strokeWidth="2"
              />
              <text x="35" y="20" textAnchor="middle" fill="#7e22ce" fontSize="10" fontWeight="600">
                ADS1115
              </text>
              <text x="35" y="35" textAnchor="middle" fill="#374151" fontSize="9">
                16-bit ADC
              </text>
              <text x="35" y="48" textAnchor="middle" fill="#6b7280" fontSize="8">
                I2C 0x48
              </text>
            </g>

            {/* Sensors */}
            <g transform="translate(200, 290)">
              <rect
                width="100"
                height="70"
                rx="6"
                fill="#ecfdf5"
                stroke="#10b981"
                strokeWidth="2"
              />
              <text x="50" y="20" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="600">
                SENSORS
              </text>
              {product.sensorList.slice(0, 3).map((s, i) => (
                <text
                  key={i}
                  x="50"
                  y={35 + i * 12}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="8"
                >
                  {s}
                </text>
              ))}
            </g>

            {/* Relay Module */}
            <g transform="translate(430, 280)">
              <rect
                width="80"
                height="60"
                rx="6"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="2"
              />
              <text x="40" y="22" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="600">
                RELAYS
              </text>
              <text x="40" y="40" textAnchor="middle" fill="#374151" fontSize="9">
                4-Channel
              </text>
              <text x="40" y="53" textAnchor="middle" fill="#6b7280" fontSize="8">
                Active-LOW
              </text>
            </g>

            {/* Ultrasonic (if present) */}
            {product.ultrasonic?.enabled && (
              <g transform="translate(550, 280)">
                <rect
                  width="100"
                  height="70"
                  rx="6"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text x="50" y="22" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="600">
                  ULTRASONIC
                </text>
                <text x="50" y="40" textAnchor="middle" fill="#374151" fontSize="9">
                  {product.ultrasonic.watts}W @ 28kHz
                </text>
                <text x="50" y="55" textAnchor="middle" fill="#6b7280" fontSize="8">
                  Driver + Transducer
                </text>
                {product.ultrasonic.units > 1 && (
                  <text x="50" y="68" textAnchor="middle" fill="#6b7280" fontSize="8">
                    (×{product.ultrasonic.units} units)
                  </text>
                )}
              </g>
            )}

            {/* Wire connections (simplified) */}
            {/* Power connections */}
            <path
              d="M 170 200 L 200 200"
              stroke="#dc2626"
              strokeWidth="2"
              fill="none"
            />
            {product.battery && (
              <path
                d="M 290 200 L 320 200"
                stroke="#dc2626"
                strokeWidth="2"
                fill="none"
              />
            )}
            <path
              d="M 400 200 L 430 200"
              stroke="#22c55e"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 540 210 L 570 210"
              stroke="#22c55e"
              strokeWidth="2"
              fill="none"
            />

            {/* I2C connections */}
            <path
              d="M 355 280 L 355 260 L 485 260 L 485 250"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4,2"
              fill="none"
            />
            <path
              d="M 300 305 L 320 305"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4,2"
              fill="none"
            />

            {/* GPIO to Relays */}
            <path
              d="M 495 250 L 495 280"
              stroke="#22c55e"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Legend */}
            <g transform="translate(50, 420)">
              <text fontSize="10" fill="#374151" fontWeight="600">
                WIRE TYPES:
              </text>
              <line x1="100" y1="-5" x2="130" y2="-5" stroke="#dc2626" strokeWidth="2" />
              <text x="135" y="-2" fontSize="9" fill="#374151">
                Power
              </text>
              <line x1="200" y1="-5" x2="230" y2="-5" stroke="#22c55e" strokeWidth="2" />
              <text x="235" y="-2" fontSize="9" fill="#374151">
                5V/Signal
              </text>
              <line
                x1="300"
                y1="-5"
                x2="330"
                y2="-5"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />
              <text x="335" y="-2" fontSize="9" fill="#374151">
                I2C/Data
              </text>
              <line x1="400" y1="-5" x2="430" y2="-5" stroke="#64748b" strokeWidth="2" />
              <text x="435" y="-2" fontSize="9" fill="#374151">
                Ground
              </text>
            </g>
          </svg>
        </SvgWrapper>
      </DiagramCard>

      {/* Wire Color Legend */}
      <LegendCard>
        <LegendTitle>Wire Color Code</LegendTitle>
        <LegendGrid>
          {WIRE_LEGEND.map((wire) => (
            <LegendItem key={wire.label}>
              <LegendColor color={wire.color} border={wire.border} />
              <LegendInfo>
                <LegendLabel>{wire.label}</LegendLabel>
                <LegendGauge>{wire.gauge}</LegendGauge>
              </LegendInfo>
            </LegendItem>
          ))}
        </LegendGrid>
      </LegendCard>

      {/* Test Points */}
      {diagram.testPoints && diagram.testPoints.length > 0 && (
        <TestPointsCard>
          <TestPointsTitle>Test Points</TestPointsTitle>
          <TestPointsGrid>
            {diagram.testPoints.map((tp) => (
              <TestPoint key={tp.id}>
                <TestPointBadge>{tp.id.toUpperCase()}</TestPointBadge>
                <TestPointInfo>
                  <TestPointLocation>{tp.location}</TestPointLocation>
                  <TestPointProbe>{tp.probe}</TestPointProbe>
                  <TestPointExpected>{tp.expected}</TestPointExpected>
                </TestPointInfo>
              </TestPoint>
            ))}
          </TestPointsGrid>
        </TestPointsCard>
      )}

      {/* Wire Runs Table */}
      {diagram.runs && diagram.runs.length > 0 && (
        <WireRunsCard>
          <WireRunsTitle>Wire Run Details</WireRunsTitle>
          <WireRunsTable>
            <Table>
              <thead>
                <tr>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Wire</Th>
                  <Th>Length</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {diagram.runs.slice(0, 15).map((run) => (
                  <tr key={run.id}>
                    <Td>
                      {run.from.component}
                      <br />
                      <Notes>{run.from.terminal}</Notes>
                    </Td>
                    <Td>
                      {run.to.component}
                      <br />
                      <Notes>{run.to.terminal}</Notes>
                    </Td>
                    <Td>
                      <WireColor
                        color={getWireColor(run.wire.type, run.wire.color)}
                        hasBorder={run.wire.color?.toLowerCase().includes("white")}
                      >
                        {run.wire.color} {run.wire.gauge}
                      </WireColor>
                    </Td>
                    <Td>{run.length}</Td>
                    <Td>
                      <Notes>{run.notes || "—"}</Notes>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {diagram.runs.length > 15 && (
              <div style={{ padding: "12px", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
                Showing first 15 of {diagram.runs.length} wire runs
              </div>
            )}
          </WireRunsTable>
        </WireRunsCard>
      )}

      {/* Safety Warning */}
      {hasAC && (
        <SafetyCard>
          <SafetyIcon>⚠️</SafetyIcon>
          <SafetyContent>
            <SafetyTitle>AC Wiring Safety</SafetyTitle>
            <SafetyList>
              <SafetyItem>Always disconnect power before servicing</SafetyItem>
              <SafetyItem>Use properly rated wire gauges (see legend)</SafetyItem>
              <SafetyItem>Verify all AC connections are tight and insulated</SafetyItem>
              <SafetyItem>Test with multimeter before powering on</SafetyItem>
              <SafetyItem>Ground wire must connect to enclosure</SafetyItem>
            </SafetyList>
          </SafetyContent>
        </SafetyCard>
      )}
    </Container>
  );
};

export default EnhancedWiringDiagram;
