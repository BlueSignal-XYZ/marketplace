// /src/components/elements/marketplace/ListingPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getCreditById } from "../../../apis/creditsApi";
import { ButtonPrimary, ButtonSecondary } from "../../shared/button/Button";
import { RequestQuoteModal } from "./RequestQuoteModal";

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 64px;
`;

const BackLink = styled.button`
  border: none;
  padding: 0;
  margin-bottom: 16px;
  background: transparent;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  max-width: 70%;
  min-width: 260px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Badge = styled.span`
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 2px;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Section = styled.section`
  margin-top: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const SectionBody = styled.p`
  margin: 0;
  line-height: 1.5;
  opacity: 0.9;
`;

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setNotFound(false);

      try {
        const data = await getCreditById(id);
        if (cancelled) return;

        if (!data) {
          setNotFound(true);
        } else {
          setCredit(data);
        }
      } catch (err) {
        console.error("Failed to load credit", err);
        if (!cancelled) {
          setNotFound(true);
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
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/marketplace");
    }
  };

  if (loading) {
    return (
      <Page>
        <BackLink onClick={handleBack}>← Back to marketplace</BackLink>
        <p>Loading credit…</p>
      </Page>
    );
  }

  if (notFound || !credit) {
    return (
      <Page>
        <BackLink onClick={handleBack}>← Back to marketplace</BackLink>
        <h1>Credit not found</h1>
        <p>This listing may have been removed or is temporarily unavailable.</p>
      </Page>
    );
  }

  const totalValue = credit.pricePerUnit * credit.quantityAvailable;

  return (
    <Page>
      <BackLink onClick={handleBack}>← Back to marketplace</BackLink>

      <Header>
        <TitleBlock>
          <Title>{credit.name}</Title>
          <Subtitle>
            {credit.location} · {credit.watershed} · Vintage {credit.vintageYear}
          </Subtitle>

          <BadgeRow>
            <Badge>{credit.verificationStatus} credit</Badge>
            <Badge>
              {credit.pollutant} · {credit.unit}
            </Badge>
            <Badge>
              {credit.sellerType}: {credit.sellerName}
            </Badge>
          </BadgeRow>
        </TitleBlock>

        <div style={{ textAlign: "right", minWidth: 220 }}>
          <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>Price per unit</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>
            ${credit.pricePerUnit.toLocaleString()}/{credit.unit}
          </div>
          <ButtonPrimary onClick={() => setQuoteOpen(true)}>
            Request quote
          </ButtonPrimary>

          <div style={{ marginTop: 8 }}>
            <ButtonSecondary onClick={() => navigate("/marketplace")}>
              Keep browsing
            </ButtonSecondary>
          </div>
        </div>
      </Header>

      <StatGrid>
        <StatCard>
          <StatLabel>Available quantity</StatLabel>
          <StatValue>
            {credit.quantityAvailable.toLocaleString()} {credit.unit}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Approx. total value</StatLabel>
          <StatValue>${totalValue.toLocaleString()}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Seller</StatLabel>
          <StatValue>{credit.sellerName}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Tags</StatLabel>
          <StatValue>
            {credit.tags && credit.tags.length
              ? credit.tags.join(" · ")
              : "None"}
          </StatValue>
        </StatCard>
      </StatGrid>

      <Section>
        <SectionTitle>Description</SectionTitle>
        <SectionBody>{credit.description}</SectionBody>
      </Section>

      {credit.methodology && (
        <Section>
          <SectionTitle>Methodology / basis</SectionTitle>
          <SectionBody>{credit.methodology}</SectionBody>
        </Section>
      )}

      <RequestQuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        credit={credit}
      />
    </Page>
  );
}
