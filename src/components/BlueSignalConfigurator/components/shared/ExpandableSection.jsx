// Expandable Section Component - Progressive disclosure UI pattern
import { useState } from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.02);
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${({ isOpen }) => (isOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent')};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.span`
  font-size: 18px;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ isOpen }) => (isOpen ? '#60a5fa' : '#e2e8f0')};
`;

const Badge = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: ${({ variant }) =>
    variant === 'count'
      ? 'rgba(59, 130, 246, 0.2)'
      : variant === 'warning'
        ? 'rgba(251, 146, 60, 0.2)'
        : variant === 'success'
          ? 'rgba(74, 222, 128, 0.2)'
          : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ variant }) =>
    variant === 'count'
      ? '#60a5fa'
      : variant === 'warning'
        ? '#fb923c'
        : variant === 'success'
          ? '#4ade80'
          : '#94a3b8'};
  font-weight: 600;
  margin-left: 8px;
`;

const Chevron = styled.span`
  color: #64748b;
  transition: transform 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  font-size: 12px;
`;

const Content = styled.div`
  padding: ${({ isOpen }) => (isOpen ? '16px 20px' : '0 20px')};
  max-height: ${({ isOpen }) => (isOpen ? '2000px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${({ isOpen }) => (isOpen ? '1px solid rgba(255, 255, 255, 0.05)' : 'none')};
`;

const ExpandableSection = ({
  id,
  title,
  icon,
  badge,
  badgeVariant = 'count',
  defaultOpen = false,
  children,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle(id, !isOpen);
  };

  return (
    <SectionWrapper>
      <SectionHeader onClick={handleToggle} isOpen={isOpen} aria-expanded={isOpen}>
        <TitleWrapper>
          {icon && <Icon>{icon}</Icon>}
          <Title isOpen={isOpen}>{title}</Title>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </TitleWrapper>
        <Chevron isOpen={isOpen}>▼</Chevron>
      </SectionHeader>
      <Content isOpen={isOpen}>{children}</Content>
    </SectionWrapper>
  );
};

export default ExpandableSection;
