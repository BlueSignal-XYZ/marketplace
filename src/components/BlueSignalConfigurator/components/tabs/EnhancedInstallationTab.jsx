// Enhanced Installation Tab with Interactive Checklists
import { useState } from "react";
import styled from "styled-components";
import { SectionTitle, Table, Th, Td } from "../../styles";
import { ExpandableSection, ChecklistCard } from "../shared";
import {
  INSTALLATION,
  TEST_POINTS,
  PRE_DEPLOYMENT_CHECKLISTS,
  COMMISSIONING_CHECKLISTS,
  REQUIRED_TOOLS,
  DEPLOYMENT_STEPS
} from "../../data";

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
  background: ${({ active }) => active ? 'rgba(59, 130, 246, 0.2)' : 'transparent'};
  border: none;
  border-radius: 6px;
  color: ${({ active }) => active ? '#60a5fa' : '#94a3b8'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StepCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 4px;
`;

const StepDescription = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const SpecItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
`;

const SpecLabel = styled.div`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const SpecValue = styled.div`
  font-size: 14px;
  color: #e2e8f0;
  font-weight: 500;
`;

const EnhancedInstallationTab = ({ product }) => {
  const [activeSection, setActiveSection] = useState('checklist');
  const isFloating = product.deployment === "Floating";
  const deploymentType = isFloating ? 'buoy' : 'shore';

  const installData = isFloating ? INSTALLATION.buoy : INSTALLATION.shore;
  const preChecklist = PRE_DEPLOYMENT_CHECKLISTS[deploymentType];
  const commissioningChecklist = COMMISSIONING_CHECKLISTS[deploymentType];
  const tools = REQUIRED_TOOLS[deploymentType];
  const steps = DEPLOYMENT_STEPS[deploymentType];

  const renderContent = () => {
    switch (activeSection) {
      case 'checklist':
        return (
          <div>
            <ChecklistCard
              title="Pre-Deployment Checklist"
              icon="📋"
              items={preChecklist}
              interactive={true}
              groupByCategory={true}
              showProgress={true}
              storageKey={`pre-deploy-${product.id}`}
            />
            <ChecklistCard
              title="Commissioning Checklist"
              icon="✅"
              items={commissioningChecklist}
              interactive={true}
              groupByCategory={true}
              showProgress={true}
              storageKey={`commission-${product.id}`}
            />
          </div>
        );

      case 'steps':
        return (
          <div>
            <SectionTitle>Deployment Steps</SectionTitle>
            <StepsContainer>
              {steps.map((step) => (
                <StepCard key={step.step}>
                  <StepNumber>{step.step}</StepNumber>
                  <StepContent>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </StepContent>
                </StepCard>
              ))}
            </StepsContainer>
          </div>
        );

      case 'tools':
        return (
          <div>
            <SectionTitle>Required Tools</SectionTitle>
            <ChecklistCard
              title={`Tools for ${isFloating ? 'Buoy' : 'Shore'} Deployment`}
              icon="🔧"
              items={tools}
              interactive={false}
              groupByCategory={false}
              showProgress={false}
            />
          </div>
        );

      case 'specs':
        return (
          <div>
            <SectionTitle>Mounting Specifications</SectionTitle>
            <SpecsGrid>
              {Object.entries(installData)
                .filter(([key]) => key !== 'anchorSizing' || isFloating)
                .map(([key, value]) => {
                  if (typeof value === 'object' && !Array.isArray(value)) {
                    return (
                      <SpecItem key={key}>
                        <SpecLabel>{key.replace(/([A-Z])/g, ' $1').trim()}</SpecLabel>
                        <SpecValue style={{ fontSize: 12 }}>
                          {Object.entries(value).map(([k, v]) => (
                            <div key={k}>{k}: {v}</div>
                          ))}
                        </SpecValue>
                      </SpecItem>
                    );
                  }
                  return (
                    <SpecItem key={key}>
                      <SpecLabel>{key.replace(/([A-Z])/g, ' $1').trim()}</SpecLabel>
                      <SpecValue>{value}</SpecValue>
                    </SpecItem>
                  );
                })}
            </SpecsGrid>

            <ExpandableSection
              id="test-points"
              title="Voltage Test Points"
              icon="⚡"
              badge={`${TEST_POINTS.length} points`}
            >
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>ID</Th>
                      <Th>Location</Th>
                      <Th>Expected</Th>
                      <Th style={{ textAlign: 'left' }}>Notes</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEST_POINTS.map((tp) => (
                      <tr key={tp.id}>
                        <Td style={{ fontWeight: 600, color: '#60a5fa' }}>{tp.id}</Td>
                        <Td>{tp.location}</Td>
                        <Td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                          {typeof tp.expected === 'object'
                            ? (product.battery?.voltage === 24 ? tp.expected['24V'] : tp.expected['12V'])
                            : tp.expected
                          }
                        </Td>
                        <Td style={{ textAlign: 'left', color: '#94a3b8', fontSize: 12 }}>{tp.notes}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </ExpandableSection>
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
          active={activeSection === 'checklist'}
          onClick={() => setActiveSection('checklist')}
        >
          Checklists
        </SubNavButton>
        <SubNavButton
          active={activeSection === 'steps'}
          onClick={() => setActiveSection('steps')}
        >
          Deployment Steps
        </SubNavButton>
        <SubNavButton
          active={activeSection === 'tools'}
          onClick={() => setActiveSection('tools')}
        >
          Required Tools
        </SubNavButton>
        <SubNavButton
          active={activeSection === 'specs'}
          onClick={() => setActiveSection('specs')}
        >
          Mounting Specs
        </SubNavButton>
      </SubNav>

      {renderContent()}
    </div>
  );
};

export default EnhancedInstallationTab;
