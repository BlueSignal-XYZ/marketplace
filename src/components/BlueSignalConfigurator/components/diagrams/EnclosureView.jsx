// EnclosureView - Interactive SVG component showing physical enclosure layout
import React, { useState } from "react";
import styled from "styled-components";
import { ENCLOSURE_COMPONENTS, CATEGORY_COLORS } from "../../data";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const DiagramWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

const DiagramHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DiagramTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const DiagramHint = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const SvgWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    max-height: 500px;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6b7280;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ color }) => color};
`;

const DetailPanel = styled.div`
  @media (max-width: 1023px) {
    order: -1;
  }
`;

const DetailCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 16px;
`;

const DetailHeader = styled.div`
  padding: 16px;
  color: #ffffff;
  background: ${({ color }) => color || '#374151'};
`;

const DetailCategory = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
`;

const DetailName = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-top: 4px;
`;

const DetailPartNumber = styled.div`
  font-size: 12px;
  font-family: monospace;
  opacity: 0.9;
  margin-top: 2px;
`;

const DetailBody = styled.div`
  padding: 16px;
`;

const DetailSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const DetailText = styled.p`
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.5;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const DetailValue = styled.div`
  font-size: 13px;
  font-family: monospace;
  color: #1f2937;
`;

const ConnectionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ConnectionItem = styled.li`
  font-size: 11px;
  font-family: monospace;
  color: #4b5563;
  padding: 4px 0;
  display: flex;

  &::before {
    content: "•";
    color: #9ca3af;
    margin-right: 8px;
  }
`;

const DetailNotes = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const DatasheetLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
  margin-top: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  font-size: 13px;
  margin: 0 0 4px;
`;

const EmptyHint = styled.p`
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
`;

const EnclosureView = ({ product }) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const components = ENCLOSURE_COMPONENTS[product.id] || [];
  const activeId = selectedComponent || hoveredComponent;
  const activeComponent = components.find((c) => c.id === activeId);

  if (components.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📦</EmptyIcon>
        <EmptyText>Enclosure diagram not available for this product</EmptyText>
      </EmptyState>
    );
  }

  return (
    <Container>
      {/* SVG Enclosure Diagram */}
      <DiagramWrapper>
        <DiagramHeader>
          <DiagramTitle>Enclosure Layout</DiagramTitle>
          <DiagramHint>Hover or tap components for details</DiagramHint>
        </DiagramHeader>

        <SvgWrapper>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Enclosure outline */}
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              rx="2"
              fill="white"
              stroke="#d1d5db"
              strokeWidth="0.5"
            />

            {/* DIN rail visual (if AC or solar shore mount) */}
            {(product.id === 's-ac' || product.id === 's-sol' || product.id === 's-mon') && (
              <rect x="5" y="45" width="90" height="2" fill="#9ca3af" rx="0.5" />
            )}

            {/* Zone labels for AC products */}
            {product.id === 's-ac' && (
              <>
                <text x="5" y="8" fontSize="2.5" fill="#374151" fontWeight="500">
                  DC ZONE (5V / 12V)
                </text>
                <text x="5" y="52" fontSize="2.5" fill="#dc2626" fontWeight="500">
                  ⚠ AC ZONE (120V)
                </text>
              </>
            )}

            {/* Component regions */}
            {components.map((comp) => {
              const isActive = activeId === comp.id;
              return (
                <g
                  key={comp.id}
                  onMouseEnter={() => setHoveredComponent(comp.id)}
                  onMouseLeave={() => setHoveredComponent(null)}
                  onClick={() =>
                    setSelectedComponent(selectedComponent === comp.id ? null : comp.id)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {/* Component rectangle */}
                  <rect
                    x={comp.position.x}
                    y={comp.position.y}
                    width={comp.position.width}
                    height={comp.position.height}
                    rx="1"
                    fill={isActive ? comp.color : `${comp.color}cc`}
                    stroke={isActive ? comp.color : "transparent"}
                    strokeWidth="0.5"
                    style={{ transition: "all 0.15s ease" }}
                  />

                  {/* Component label */}
                  <text
                    x={comp.position.x + comp.position.width / 2}
                    y={comp.position.y + comp.position.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={comp.position.width > 15 ? "2.5" : "2"}
                    fontWeight="600"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {comp.shortName}
                  </text>
                </g>
              );
            })}

            {/* Cable entry points */}
            <circle cx="95" cy="20" r="2" fill="#374151" />
            <text x="85" y="17" fontSize="1.8" fill="#6b7280">
              Sensors
            </text>

            {product.id === 's-ac' && (
              <>
                <circle cx="95" cy="70" r="2" fill="#374151" />
                <text x="82" y="67" fontSize="1.8" fill="#6b7280">
                  AC Power
                </text>
              </>
            )}

            {(product.id === 's-sol' || product.id === 's-mon') && (
              <>
                <circle cx="95" cy="15" r="2" fill="#374151" />
                <text x="83" y="12" fontSize="1.8" fill="#6b7280">
                  Solar MC4
                </text>
              </>
            )}

            <circle cx="95" cy="35" r="2" fill="#374151" />
            <text x="82" y="32" fontSize="1.8" fill="#6b7280">
              Antenna
            </text>

            {product.ultrasonic?.enabled && (
              <>
                <circle cx="50" cy="98" r="2" fill="#374151" />
                <text x="35" y="96" fontSize="1.8" fill="#6b7280">
                  Transducer
                </text>
              </>
            )}
          </svg>
        </SvgWrapper>

        {/* Legend */}
        <Legend>
          {Object.entries(CATEGORY_COLORS).map(([key, { color, label }]) => {
            const hasCategory = components.some((c) => c.category === key);
            if (!hasCategory) return null;
            return (
              <LegendItem key={key}>
                <LegendColor color={color} />
                {label}
              </LegendItem>
            );
          })}
        </Legend>
      </DiagramWrapper>

      {/* Component Detail Panel */}
      <DetailPanel>
        {activeComponent ? (
          <DetailCard>
            <DetailHeader color={activeComponent.color}>
              <DetailCategory>{activeComponent.category}</DetailCategory>
              <DetailName>{activeComponent.name}</DetailName>
              <DetailPartNumber>{activeComponent.details.partNumber}</DetailPartNumber>
            </DetailHeader>

            <DetailBody>
              {/* Function */}
              <DetailSection>
                <DetailLabel>Function</DetailLabel>
                <DetailText>{activeComponent.details.function}</DetailText>
              </DetailSection>

              {/* Electrical */}
              <DetailSection>
                <DetailGrid>
                  <div>
                    <DetailLabel>Voltage</DetailLabel>
                    <DetailValue>{activeComponent.details.voltage}</DetailValue>
                  </div>
                  <div>
                    <DetailLabel>Current</DetailLabel>
                    <DetailValue>{activeComponent.details.current}</DetailValue>
                  </div>
                </DetailGrid>
              </DetailSection>

              {/* Connections */}
              {activeComponent.details.connections &&
                activeComponent.details.connections.length > 0 && (
                  <DetailSection>
                    <DetailLabel>Connections</DetailLabel>
                    <ConnectionList>
                      {activeComponent.details.connections.map((conn, i) => (
                        <ConnectionItem key={i}>{conn}</ConnectionItem>
                      ))}
                    </ConnectionList>
                  </DetailSection>
                )}

              {/* Notes */}
              {activeComponent.details.notes && (
                <DetailSection>
                  <DetailLabel>Notes</DetailLabel>
                  <DetailNotes>{activeComponent.details.notes}</DetailNotes>
                </DetailSection>
              )}

              {/* Datasheet link */}
              {activeComponent.details.datasheet && (
                <DatasheetLink
                  href={activeComponent.details.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Datasheet →
                </DatasheetLink>
              )}
            </DetailBody>
          </DetailCard>
        ) : (
          <EmptyState>
            <EmptyIcon>👆</EmptyIcon>
            <EmptyText>Hover over a component to see details</EmptyText>
            <EmptyHint>Click to pin the selection</EmptyHint>
          </EmptyState>
        )}
      </DetailPanel>
    </Container>
  );
};

export default EnclosureView;
