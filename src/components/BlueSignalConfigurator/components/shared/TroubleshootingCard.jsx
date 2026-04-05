// Troubleshooting Decision Tree Card Component
import { useState } from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const CardHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${({ isOpen }) => isOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.span`
  font-size: 20px;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Symptom = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
`;

const SeverityBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${({ severity }) =>
    severity === 'high' ? 'rgba(239, 68, 68, 0.2)' :
    severity === 'medium' ? 'rgba(251, 146, 60, 0.2)' :
    'rgba(74, 222, 128, 0.2)'
  };
  color: ${({ severity }) =>
    severity === 'high' ? '#f87171' :
    severity === 'medium' ? '#fb923c' :
    '#4ade80'
  };
`;

const Chevron = styled.span`
  color: #64748b;
  transition: transform 0.2s;
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  font-size: 12px;
`;

const Content = styled.div`
  padding: ${({ isOpen }) => isOpen ? '0' : '0'};
  max-height: ${({ isOpen }) => isOpen ? '2000px' : '0'};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const Section = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const SectionTitle = styled.h6`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin: 0 0 12px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.4;

  &::before {
    content: '${({ bullet }) => bullet || '•'}';
    color: ${({ bulletColor }) => bulletColor || '#64748b'};
    flex-shrink: 0;
    width: 16px;
    text-align: center;
  }
`;

const FixItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
  }
`;

const FixText = styled.span`
  font-size: 13px;
  color: #e2e8f0;
  flex: 1;
`;

const DifficultyBadge = styled.span`
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ difficulty }) =>
    difficulty === 'easy' ? 'rgba(74, 222, 128, 0.2)' :
    difficulty === 'medium' ? 'rgba(251, 191, 36, 0.2)' :
    'rgba(239, 68, 68, 0.2)'
  };
  color: ${({ difficulty }) =>
    difficulty === 'easy' ? '#4ade80' :
    difficulty === 'medium' ? '#fbbf24' :
    '#f87171'
  };
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 12px;
  flex-shrink: 0;
`;

const TroubleshootingCard = ({ issue }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardWrapper>
      <CardHeader onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <HeaderLeft>
          <Icon>{issue.icon}</Icon>
          <HeaderText>
            <Symptom>{issue.symptom}</Symptom>
          </HeaderText>
        </HeaderLeft>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SeverityBadge severity={issue.severity}>{issue.severity}</SeverityBadge>
          <Chevron isOpen={isOpen}>▼</Chevron>
        </div>
      </CardHeader>
      <Content isOpen={isOpen}>
        <Section>
          <SectionTitle>Possible Causes</SectionTitle>
          <List>
            {issue.causes.map((cause, i) => (
              <ListItem key={i} bullet="?" bulletColor="#f59e0b">{cause}</ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>Diagnostic Steps</SectionTitle>
          <List>
            {issue.diagnosticSteps.map((step, i) => (
              <ListItem key={i} bullet={`${i + 1}.`} bulletColor="#60a5fa">{step}</ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>Fixes</SectionTitle>
          {issue.fixes.map((fix, i) => (
            <FixItem key={i}>
              <FixText>{fix.action}</FixText>
              <DifficultyBadge difficulty={fix.difficulty}>{fix.difficulty}</DifficultyBadge>
            </FixItem>
          ))}
        </Section>
      </Content>
    </CardWrapper>
  );
};

export default TroubleshootingCard;
