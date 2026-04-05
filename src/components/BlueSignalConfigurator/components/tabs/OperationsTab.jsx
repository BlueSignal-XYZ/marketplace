// Operations Tab - Maintenance, Calibration, Troubleshooting, LED Codes
import { useState } from 'react';
import styled from 'styled-components';
import { SectionTitle, Table, Th, Td } from '../../styles';
import { ExpandableSection, TroubleshootingCard } from '../shared';
import {
  MAINTENANCE,
  LED_CODES,
  LED_COLORS,
  CALIBRATION,
  TROUBLESHOOTING,
  LED_STATUS_CODES,
  LED_COLORS_HEX,
} from '../../data';

const SubNav = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  flex-wrap: wrap;
`;

const SubNavButton = styled.button`
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ active }) => (active ? 'rgba(59, 130, 246, 0.2)' : 'transparent')};
  border: none;
  border-radius: 6px;
  color: ${({ active }) => (active ? '#60a5fa' : '#94a3b8')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ScheduleCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const ScheduleLeft = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ComponentName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
`;

const ActionText = styled.div`
  font-size: 13px;
  color: #94a3b8;
`;

const IntervalBadge = styled.span`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  background: ${({ interval }) =>
    interval.includes('day')
      ? 'rgba(74, 222, 128, 0.15)'
      : interval.includes('month')
        ? 'rgba(251, 191, 36, 0.15)'
        : 'rgba(251, 146, 60, 0.15)'};
  color: ${({ interval }) =>
    interval.includes('day') ? '#4ade80' : interval.includes('month') ? '#fbbf24' : '#fb923c'};
`;

const CostBadge = styled.span`
  font-size: 12px;
  color: ${({ hasCost }) => (hasCost ? '#f87171' : '#4ade80')};
  margin-left: 12px;
`;

const CalibrationCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const CalibrationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SensorName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #60a5fa;
  margin: 0;
`;

const FormulaBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  color: #4ade80;
  margin-bottom: 12px;
  overflow-x: auto;
`;

const CalibrationPoints = styled.div`
  margin-top: 12px;
`;

const CalibrationPoint = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const PointNumber = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

const PointText = styled.div`
  font-size: 13px;
  color: #e2e8f0;

  span {
    color: #94a3b8;
    font-size: 12px;
    display: block;
    margin-top: 2px;
  }
`;

const LEDGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
`;

const LEDCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const LEDIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color || '#64748b'};
  box-shadow: 0 0 8px ${({ color }) => color || '#64748b'};
  flex-shrink: 0;
  margin-top: 4px;
`;

const LEDContent = styled.div`
  flex: 1;
`;

const LEDPattern = styled.div`
  font-size: 12px;
  font-family: 'SF Mono', Monaco, monospace;
  color: #94a3b8;
  margin-bottom: 4px;
`;

const LEDMeaning = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: 4px;
`;

const LEDAction = styled.div`
  font-size: 12px;
  color: ${({ hasAction }) => (hasAction ? '#fbbf24' : '#64748b')};
`;

const OperationsTab = ({ product }) => {
  const [activeSection, setActiveSection] = useState('maintenance');

  const hasDO = product.sensorList.some((s) => s.includes('Dissolved') || s.includes('DO'));
  const isBuoy = product.deployment === 'Floating';

  // Filter maintenance items by product capabilities
  const relevantMaintenance = MAINTENANCE.filter((m) => {
    if (m.component.includes('DO') && !hasDO) return false;
    if (m.component.includes('Buoy') && !isBuoy) return false;
    if (m.component.includes('Mooring') && !isBuoy) return false;
    if (m.component.includes('Solar') && !product.solar) return false;
    return true;
  });

  // Get relevant calibration sensors
  const relevantCalibration = Object.entries(CALIBRATION).filter(([key]) => {
    if (key === 'dissolvedOxygen' && !hasDO) return false;
    if (key === 'voltageMonitor' && product.power.type === 'AC') return false;
    return true;
  });

  const renderContent = () => {
    switch (activeSection) {
      case 'maintenance':
        return (
          <div>
            <SectionTitle>Maintenance Schedule</SectionTitle>
            {relevantMaintenance.map((m, i) => (
              <ScheduleCard key={i}>
                <ScheduleLeft>
                  <ComponentName>{m.component}</ComponentName>
                  <ActionText>{m.action}</ActionText>
                </ScheduleLeft>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IntervalBadge interval={m.interval}>{m.interval}</IntervalBadge>
                  <CostBadge hasCost={!!m.cost}>{m.cost || 'Free'}</CostBadge>
                </div>
              </ScheduleCard>
            ))}
          </div>
        );

      case 'calibration':
        return (
          <div>
            <SectionTitle>Sensor Calibration</SectionTitle>
            {relevantCalibration.map(([key, sensor]) => (
              <CalibrationCard key={key}>
                <CalibrationHeader>
                  <SensorName>{sensor.name}</SensorName>
                  {sensor.interval && (
                    <IntervalBadge interval={sensor.interval}>{sensor.interval}</IntervalBadge>
                  )}
                </CalibrationHeader>

                {sensor.formula && <FormulaBox>{sensor.formula}</FormulaBox>}

                {sensor.voltageRange && (
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    <strong>Voltage Range:</strong> {sensor.voltageRange}
                    {sensor.outputRange && (
                      <span>
                        {' '}
                        → <strong>Output:</strong> {sensor.outputRange}
                      </span>
                    )}
                  </div>
                )}

                {sensor.temperatureCompensation && (
                  <ExpandableSection
                    id={`temp-comp-${key}`}
                    title="Temperature Compensation"
                    icon="🌡️"
                  >
                    <FormulaBox>{sensor.temperatureCompensation}</FormulaBox>
                  </ExpandableSection>
                )}

                {sensor.calibrationPoints && (
                  <CalibrationPoints>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}
                    >
                      Calibration Points
                    </div>
                    {sensor.calibrationPoints.map((point, i) => (
                      <CalibrationPoint key={i}>
                        <PointNumber>{i + 1}</PointNumber>
                        <PointText>
                          {point.standard}
                          {point.expectedVoltage && <span>Expected: {point.expectedVoltage}</span>}
                          {point.action && <span>{point.action}</span>}
                        </PointText>
                      </CalibrationPoint>
                    ))}
                  </CalibrationPoints>
                )}

                {sensor.saturationTable && (
                  <ExpandableSection id={`sat-table-${key}`} title="Saturation Table" icon="📊">
                    <Table>
                      <thead>
                        <tr>
                          <Th>Temperature</Th>
                          <Th>Saturation</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sensor.saturationTable).map(([temp, sat]) => (
                          <tr key={temp}>
                            <Td>{temp}</Td>
                            <Td>{sat}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ExpandableSection>
                )}

                {sensor.notes && (
                  <div
                    style={{ fontSize: 12, color: '#64748b', marginTop: 12, fontStyle: 'italic' }}
                  >
                    Note: {sensor.notes}
                  </div>
                )}
              </CalibrationCard>
            ))}
          </div>
        );

      case 'troubleshoot':
        return (
          <div>
            <SectionTitle>Troubleshooting Guide</SectionTitle>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
              Click on a symptom to see possible causes and fixes.
            </p>
            {TROUBLESHOOTING.map((issue) => (
              <TroubleshootingCard key={issue.id} issue={issue} />
            ))}
          </div>
        );

      case 'led':
        return (
          <div>
            <SectionTitle>LED Status Codes</SectionTitle>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
              Use these patterns to diagnose device status without dashboard access.
            </p>
            <LEDGrid>
              {(LED_STATUS_CODES || LED_CODES).map((led, i) => (
                <LEDCard key={i}>
                  <LEDIndicator
                    color={LED_COLORS_HEX?.[led.color] || LED_COLORS?.[led.color] || '#64748b'}
                  />
                  <LEDContent>
                    <LEDPattern>{led.pattern}</LEDPattern>
                    <LEDMeaning>{led.meaning}</LEDMeaning>
                    <LEDAction hasAction={!!led.action}>
                      {led.action || 'No action required'}
                    </LEDAction>
                  </LEDContent>
                </LEDCard>
              ))}
            </LEDGrid>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <SubNav>
        <SubNavButton
          active={activeSection === 'maintenance'}
          onClick={() => setActiveSection('maintenance')}
        >
          Maintenance
        </SubNavButton>
        <SubNavButton
          active={activeSection === 'calibration'}
          onClick={() => setActiveSection('calibration')}
        >
          Calibration
        </SubNavButton>
        <SubNavButton
          active={activeSection === 'troubleshoot'}
          onClick={() => setActiveSection('troubleshoot')}
        >
          Troubleshooting
        </SubNavButton>
        <SubNavButton active={activeSection === 'led'} onClick={() => setActiveSection('led')}>
          LED Codes
        </SubNavButton>
      </SubNav>

      {renderContent()}
    </div>
  );
};

export default OperationsTab;
