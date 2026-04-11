import type { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius};
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h2`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 10px;
`;

const Body = styled.div`
  padding: 0.75rem 1rem;
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.8rem;
  text-align: center;
  padding: 1.5rem 0;
`;

interface PanelProps {
  id: string;
  title: string;
  badge?: string | number;
  actions?: ReactNode;
  children: ReactNode;
  empty?: boolean;
}

export default function Panel({ id, title, badge, actions, children, empty }: PanelProps) {
  return (
    <Wrapper id={id}>
      <Header>
        <TitleRow>
          <Title>{title}</Title>
          {badge !== undefined && <Badge>{badge}</Badge>}
        </TitleRow>
        {actions}
      </Header>
      <Body>{empty ? <Empty>No data available</Empty> : children}</Body>
    </Wrapper>
  );
}
