// /src/routes/marketplace/Marketplace.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getCredits } from "../../apis/creditsApi";

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
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary300 || "#7dd3fc"};
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }

  h3 {
    margin: 0;
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

const MetaRow = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
`;

const PriceRow = styled.div`
  margin-top: 8px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
`;

const Price = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const Quantity = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
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

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  font-size: 14px;
`;

const Marketplace = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getCredits();
        if (!cancelled) {
          setListings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load marketplace credits", err);
        if (!cancelled) {
          setLoadError("Unable to load listings right now.");
          setListings([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageWrapper>
      <MarketplaceShell>
        <HeaderBlock>
          <h1>WaterQuality.Trading Marketplace</h1>
          <p>
            Buy and sell water quality improvement credits. Connect producers, verifiers, and buyers
            in a transparent marketplace.
          </p>
        </HeaderBlock>

        {loading ? (
          <LoadingState>Loading listings…</LoadingState>
        ) : loadError ? (
          <>
            <EmptyState>
              <h2>We couldn’t load listings</h2>
              <p>{loadError}</p>
            </EmptyState>
          </>
        ) : listings.length === 0 ? (
          <>
            <EmptyState>
              <h2>No Active Listings</h2>
              <p>
                There are currently no active credit listings. Check back soon or explore our
                registry and map.
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
          <>
            <Grid>
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
                >
                  <h3>{listing.name}</h3>

                  <MetaRow>
                    {listing.location} · {listing.watershed} · Vintage {listing.vintageYear}
                  </MetaRow>

                  <MetaRow>
                    {listing.pollutant} · {listing.unit} · {listing.verificationStatus} credit
                  </MetaRow>

                  <TagRow>
                    {(listing.tags || []).slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagRow>

                  <PriceRow>
                    <Price>
                      ${listing.pricePerUnit.toLocaleString()}/{listing.unit}
                    </Price>
                    <Quantity>
                      {listing.quantityAvailable.toLocaleString()} {listing.unit} available
                    </Quantity>
                  </PriceRow>
                </Card>
              ))}
            </Grid>
          </>
        )}
      </MarketplaceShell>
    </PageWrapper>
  );
};

export default Marketplace;
