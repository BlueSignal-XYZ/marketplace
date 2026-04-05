/**
 * WQT Certificate Detail — shareable verification page.
 * Wired to /v2/blockchain/certificate/:id.
 * html2canvas lazy-loaded on "Export as Image" click.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Button } from '../../../design-system/primitives/Button';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { getCertificate, ApiError } from '../../../services/v2/client';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Back = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const VerifiedBanner = styled.div`
  background: linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,82,204,0.06));
  border: 1px solid rgba(139,92,246,0.15);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
  text-align: center;
  margin-bottom: 32px;
`;

const PendingBanner = styled.div`
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
  text-align: center;
  margin-bottom: 32px;
`;

const CheckIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const BannerTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const BannerSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ExtLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
`;

const ErrorBox = styled.div`
  text-align: center;
  padding: 64px 24px;
`;

const ErrorTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const ErrorDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 16px;
`;

function CertSkeleton() {
  return (
    <Page>
      <Skeleton width={120} height={14} />
      <div style={{ height: 20 }} />
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Skeleton width={48} height={48} style={{ margin: '0 auto 12px' }} />
        <Skeleton width={280} height={24} style={{ margin: '0 auto 8px' }} />
        <Skeleton width={200} height={14} style={{ margin: '0 auto' }} />
      </div>
      <div style={{ height: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} height={70} />)}
      </div>
    </Page>
  );
}

export function CertificateDetailPage() {
  useEffect(() => { document.title = 'Certificate — WaterQuality.Trading'; }, []);
  const { id } = useParams();
  const { toast } = useToastContext();
  const certRef = useRef(null);

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCertificate(id);
        if (!cancelled) setCert(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load certificate.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleExportImage = useCallback(async () => {
    if (!certRef.current) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(certRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `certificate-${id}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast({ type: 'success', message: 'Certificate image downloaded.' });
    } catch {
      toast({ type: 'error', message: 'Failed to export image.' });
    } finally {
      setExporting(false);
    }
  }, [id, toast]);

  if (loading) return <CertSkeleton />;

  if (error || !cert) {
    return (
      <Page>
        <Back to="/marketplace">{'\u2190'} Back to Marketplace</Back>
        <ErrorBox>
          <ErrorTitle>Certificate not found</ErrorTitle>
          <ErrorDesc>{error || 'This certificate may not exist or has been removed.'}</ErrorDesc>
          <Button variant="outline" as={Link} to="/marketplace">Back to Marketplace</Button>
        </ErrorBox>
      </Page>
    );
  }

  const credit = cert.credit || {};
  const hasMint = !!(cert.transactionHash && cert.tokenId);
  const nutrientLabel = credit.nutrientType === 'nitrogen' ? 'Nitrogen (N)' : credit.nutrientType === 'phosphorus' ? 'Phosphorus (P)' : 'Combined';

  return (
    <Page>
      <Back to="/marketplace">{'\u2190'} Back to Marketplace</Back>

      <div ref={certRef}>
        {hasMint ? (
          <VerifiedBanner>
            <CheckIcon>{'\uD83D\uDEE1'}</CheckIcon>
            <BannerTitle>Verified Environmental Credit</BannerTitle>
            <BannerSub>
              This certificate has been verified on the {cert.network === 'polygon' ? 'Polygon' : 'Polygon Amoy'} blockchain.
              <br />
              Certificate #{cert.tokenId} &middot; Minted {cert.mintedAt ? new Date(cert.mintedAt).toLocaleDateString() : '\u2014'}
            </BannerSub>
            <div style={{ marginTop: 12 }}>
              <Badge variant="verified" dot>Blockchain Verified</Badge>
            </div>
          </VerifiedBanner>
        ) : (
          <PendingBanner>
            <CheckIcon>{'\u23F3'}</CheckIcon>
            <BannerTitle>Pending Verification</BannerTitle>
            <BannerSub>This certificate has not yet been minted on-chain. On-chain verification is in progress.</BannerSub>
            <div style={{ marginTop: 12 }}>
              <Badge variant="warning" dot>Pending Mint</Badge>
            </div>
          </PendingBanner>
        )}

        <StatsRow>
          <DataCard label="Nutrient Type" value={nutrientLabel} compact />
          <DataCard label="Quantity Removed" value={(credit.quantity || 0).toLocaleString()} unit="kg" compact />
          <DataCard label="Region" value={credit.region || '\u2014'} compact />
          <DataCard label="Status" value={credit.status === 'retired' ? 'Retired' : 'Active'} compact />
        </StatsRow>

        <Section>
          <SectionTitle>Credit Details</SectionTitle>
          <Grid>
            <Row><Label>Credit ID</Label><Value>{cert.creditId || '\u2014'}</Value></Row>
            <Row><Label>Nutrient Type</Label><Value>{credit.nutrientType || '\u2014'}</Value></Row>
            <Row><Label>Quantity</Label><Value>{credit.quantity || 0} kg</Value></Row>
            <Row><Label>Region</Label><Value>{credit.region || '\u2014'}</Value></Row>
            <Row><Label>Vintage</Label><Value>{credit.vintage || '\u2014'}</Value></Row>
            <Row><Label>Verification</Label><Value>{credit.verificationLevel || '\u2014'}</Value></Row>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>On-Chain Verification</SectionTitle>
          {hasMint ? (
            <>
              <Grid>
                <Row><Label>Token ID</Label><Value>#{cert.tokenId}</Value></Row>
                <Row><Label>Contract</Label><Value>{cert.contractAddress || '\u2014'}</Value></Row>
                <Row><Label>Tx Hash</Label><Value>{cert.transactionHash || '\u2014'}</Value></Row>
                <Row><Label>Block</Label><Value>{(cert.blockNumber || 0).toLocaleString()}</Value></Row>
                <Row><Label>Network</Label><Value>{cert.network === 'polygon' ? 'Polygon Mainnet' : 'Polygon Amoy (Testnet)'}</Value></Row>
                <Row><Label>Minted</Label><Value>{cert.mintedAt ? new Date(cert.mintedAt).toLocaleDateString() : '\u2014'}</Value></Row>
              </Grid>
              {cert.explorerUrl && (
                <div style={{ marginTop: 12 }}>
                  <ExtLink href={cert.explorerUrl} target="_blank" rel="noopener">
                    View on Polygonscan {'\u2192'}
                  </ExtLink>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 14 }}>
              On-chain data will appear here once the certificate has been minted.
            </div>
          )}
        </Section>

        <Section>
          <SectionTitle>Owner</SectionTitle>
          <Row>
            <Label>Wallet Address</Label>
            <Value>{cert.owner?.address || '\u2014'}</Value>
          </Row>
          {cert.owner?.displayName && (
            <Row><Label>Display Name</Label><Value>{cert.owner.displayName}</Value></Row>
          )}
        </Section>

        {cert.retirement && (
          <Section>
            <SectionTitle>Retirement</SectionTitle>
            <Grid>
              <Row><Label>Reason</Label><Value>{cert.retirement.reason || '\u2014'}</Value></Row>
              <Row><Label>Retired At</Label><Value>{cert.retirement.retiredAt ? new Date(cert.retirement.retiredAt).toLocaleDateString() : '\u2014'}</Value></Row>
              {cert.retirement.beneficiary && <Row><Label>Beneficiary</Label><Value>{cert.retirement.beneficiary}</Value></Row>}
              {cert.retirement.burnTxHash && <Row><Label>Burn Tx</Label><Value>{cert.retirement.burnTxHash}</Value></Row>}
            </Grid>
          </Section>
        )}
      </div>

      <ActionsRow>
        <Button variant="outline" onClick={handleExportImage} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export as Image'}
        </Button>
      </ActionsRow>
    </Page>
  );
}

export default CertificateDetailPage;
