// src/routes/marketplace/ListingDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getCreditById } from "../../apis/creditsApi";
import { ButtonPrimary, ButtonSecondary } from "../../components/shared/button/Button";
import { RequestQuoteModal } from "../../components/elements/marketplace/RequestQuoteModal";
import PurchaseFlow from "../../components/elements/marketplace/PurchaseFlow";
import { PropertyMap } from "../../components/shared/PropertyMap";
import { useAppContext } from "../../context/AppContext";
import { media } from "../../styles/breakpoints";
import { creditTypeColors } from "../../styles/colors";

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px clamp(16px, 4vw, 32px) 64px;
`;

const BackLink = styled.button`
  border: none;
  padding: 0;
  margin-bottom: 16px;
  background: transparent;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  align-items: flex-start;

  ${media.mobileOnly} {
    flex-direction: column;
    gap: 16px;
  }
`;

const TitleBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h1`
  font-size: clamp(1.4rem, 4vw, 1.8rem);
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
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

const CreditTypeBadge = styled.span`
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
  background: ${({ $creditType }) => creditTypeColors[$creditType]?.bg || "#f3f4f6"};
  color: ${({ $creditType }) => creditTypeColors[$creditType]?.text || "#374151"};
  border: 1px solid ${({ $creditType }) => creditTypeColors[$creditType]?.border || "#d1d5db"};
`;

const PriceBlock = styled.div`
  text-align: right;
  flex-shrink: 0;

  ${media.mobileOnly} {
    text-align: left;
    width: 100%;
  }
`;

const PriceLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
`;

const PriceValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const CTARow = styled.div`
  display: flex;
  gap: 8px;

  ${media.mobileOnly} {
    flex-direction: column;
    width: 100%;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin-bottom: 2px;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const Section = styled.section`
  margin-top: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const SectionBody = styled.p`
  margin: 0;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const MapSection = styled.section`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const MapTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const MapSubtitle = styled.span`
  font-size: 0.85rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors?.ui500 || "#64748b"};
`;

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);

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
        <BackLink onClick={handleBack}>&larr; Back to marketplace</BackLink>
        <p>Loading credit&hellip;</p>
      </Page>
    );
  }

  if (notFound || !credit) {
    return (
      <Page>
        <BackLink onClick={handleBack}>&larr; Back to marketplace</BackLink>
        <h1>Credit not found</h1>
        <p>This listing may have been removed or is temporarily unavailable.</p>
      </Page>
    );
  }

  const totalValue = credit.pricePerUnit * credit.quantityAvailable;

  // Build a listing object for PurchaseFlow
  const purchaseListing = {
    id: credit.id,
    title: credit.name,
    creditType: credit.creditType || credit.pollutant?.toLowerCase(),
    unit: credit.unit,
    pricePerUnit: credit.pricePerUnit,
    quantity: credit.quantityAvailable,
    minimumPurchase: 1,
    sellerName: credit.sellerName,
  };

  return (
    <Page>
      <BackLink onClick={handleBack}>&larr; Back to marketplace</BackLink>

      <Header>
        <TitleBlock>
          <Title>{credit.name}</Title>
          <Subtitle>
            {credit.location} &middot; {credit.watershed} &middot; Vintage {credit.vintageYear}
          </Subtitle>
          <BadgeRow>
            <CreditTypeBadge $creditType={credit.creditType || credit.pollutant?.toLowerCase()}>
              {credit.creditType
                ? credit.creditType.charAt(0).toUpperCase() + credit.creditType.slice(1)
                : credit.pollutant}
            </CreditTypeBadge>
            <Badge>{credit.verificationStatus} credit</Badge>
            <Badge>
              {credit.pollutant} &middot; {credit.unit}
            </Badge>
            <Badge>
              {credit.sellerType}: {credit.sellerName}
            </Badge>
          </BadgeRow>
        </TitleBlock>

        <PriceBlock>
          <PriceLabel>Price per unit</PriceLabel>
          <PriceValue>
            ${credit.pricePerUnit.toLocaleString()}/{credit.unit}
          </PriceValue>
          <CTARow>
            {user?.uid && (
              <ButtonPrimary onClick={() => setPurchaseOpen(true)}>
                Buy Now
              </ButtonPrimary>
            )}
            <ButtonSecondary onClick={() => setQuoteOpen(true)}>
              Request Quote
            </ButtonSecondary>
          </CTARow>
        </PriceBlock>
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
              ? credit.tags.join(" \u00b7 ")
              : "None"}
          </StatValue>
        </StatCard>
      </StatGrid>

      {credit.lat && credit.lng && (
        <MapSection>
          <MapTitle>
            Property Location
            {credit.acreage && (
              <MapSubtitle>{credit.acreage} acres</MapSubtitle>
            )}
          </MapTitle>
          <PropertyMap
            lat={credit.lat}
            lng={credit.lng}
            boundary={credit.boundary}
            pollutant={credit.pollutant}
            propertyName={credit.name}
            height="350px"
          />
        </MapSection>
      )}

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

      {purchaseOpen && (
        <PurchaseFlow
          listing={purchaseListing}
          onClose={() => setPurchaseOpen(false)}
          onSuccess={() => setPurchaseOpen(false)}
        />
      )}
    </Page>
  );
}
