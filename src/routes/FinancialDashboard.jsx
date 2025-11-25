// /src/routes/FinancialDashboard.jsx
import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Shell = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 16px 48px;

  @media (min-width: 1024px) {
    padding: 40px 0 64px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.ui900};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.ui600};
  margin-bottom: 24px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  padding: 16px;
  background: ${({ theme }) => theme.colors.bg};

  h2 {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ui700};
    margin-bottom: 4px;
  }

  p {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ui900};
  }

  span {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.ui600};
  }
`;

const Placeholder = styled.div`
  margin-top: 32px;
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.ui300};
  background: ${({ theme }) => theme.colors.bgAlt || "#fafafa"};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.ui700};
`;

const FinancialDashboard = () => {
  return (
    <PageWrapper>
      <Shell>
        <Title>Financial Dashboard</Title>
        <Subtitle>
          High-level view of credit sales, payouts, and marketplace activity.
          This is a working placeholder — we’ll wire it to real data next.
        </Subtitle>

        <CardGrid>
          <StatCard>
            <h2>Total Sales</h2>
            <p>$0</p>
            <span>Lifetime NPC sales across all listings.</span>
          </StatCard>

          <StatCard>
            <h2>Pending Payouts</h2>
            <p>$0</p>
            <span>Credits sold but not yet settled.</span>
          </StatCard>

          <StatCard>
            <h2>Open Listings</h2>
            <p>0</p>
            <span>Marketplace listings currently active.</span>
          </StatCard>
        </CardGrid>

        <Placeholder>
          Detailed revenue analytics, credit flows, and exporter/utility
          breakdowns will live here. For now, this keeps the route alive and
          navigable from the marketplace menu.
        </Placeholder>
      </Shell>
    </PageWrapper>
  );
};

export default FinancialDashboard;