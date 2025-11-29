// /src/routes/marketplace/Marketplace.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors?.bg || "#fafafa"};
`;

const MarketplaceShell = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`;

const HeaderBlock = styled.header`
  text-align: center;
  margin-bottom: 48px;

  h1 {
    margin: 0 0 12px;
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 26px;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary300 || "#7dd3fc"};
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 20px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 16px;

  h2 {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 0 0 24px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const Marketplace = () => {
  const navigate = useNavigate();

  // Placeholder data - replace with real API calls
  const listings = [];

  const exploreOptions = [
    {
      title: "Registry",
      description: "View all registered producers, verifiers, and credit supply data.",
      path: "/registry",
    },
    {
      title: "Map",
      description: "Explore producers and facilities on an interactive map.",
      path: "/map",
    },
    {
      title: "Recent Removals",
      description: "Track recent nutrient removal activity and transactions.",
      path: "/recent-removals",
    },
  ];

  return (
    <PageWrapper>
      <MarketplaceShell>
        <HeaderBlock>
          <h1>WaterQuality.Trading Marketplace</h1>
          <p>
            Buy and sell water quality improvement credits. Connect producers, verifiers, and buyers in a transparent marketplace.
          </p>
        </HeaderBlock>

        {listings.length === 0 ? (
          <>
            <EmptyState>
              <h2>No Active Listings</h2>
              <p>
                There are currently no active credit listings. Check back soon or explore our registry and map.
              </p>
            </EmptyState>

            <HeaderBlock style={{ marginTop: "48px", marginBottom: "24px" }}>
              <h1 style={{ fontSize: "24px" }}>Explore</h1>
              <p>Browse producers, verify credits, and track environmental impact.</p>
            </HeaderBlock>

            <Grid>
              {exploreOptions.map((option) => (
                <Card key={option.path} onClick={() => navigate(option.path)}>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </Card>
              ))}
            </Grid>
          </>
        ) : (
          <Grid>
            {listings.map((listing) => (
              <Card
                key={listing.id}
                onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
              >
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
              </Card>
            ))}
          </Grid>
        )}
      </MarketplaceShell>
    </PageWrapper>
  );
};

export default Marketplace;
