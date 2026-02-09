import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fetchUserCredits } from '../../services/wqtDataService';
import { EnrollmentAPI } from '../../scripts/back_door';
import SEOHead from '../../components/seo/SEOHead';
import { creditTypeColors } from '../../styles/colors';
import {
  PageShell,
  ContentWrapper,
  PageTitle,
  PageSubtitle,
  SectionHeading,
  Card,
  StatCard,
  FiltersRow,
  FilterChip,
  StatusBadge,
  PrimaryButton,
  SecondaryButton,
  LoadingContainer,
  Spinner,
  EmptyStateContainer,
  EmptyStateTitle,
  EmptyStateText,
  ErrorBanner,
} from '../../styles/uiPrimitives';

/* ---- page-specific styled components ---- */

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme, $color }) => $color || theme.colors.text};
`;

const StatSubtext = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.ui400};
  margin-top: 4px;
`;

const CreditGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const creditBorderColor = (type, theme) => {
  const map = {
    nitrogen: '#3b82f6',
    phosphorus: theme.colors.success500,
    stormwater: theme.colors.accent500,
    thermal: '#f97316',
  };
  return map[type] || theme.colors.ui400;
};

const CreditCard = styled(Card)`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xl};
  border-left: 4px solid ${({ theme, $type }) => creditBorderColor($type, theme)};
`;

const CreditHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CreditId = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary500};
`;

const CreditTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ $type }) => {
    const tc = creditTypeColors[$type];
    return tc ? tc.bg : '#f3f4f6';
  }};
  color: ${({ $type }) => {
    const tc = creditTypeColors[$type];
    return tc ? tc.text : '#374151';
  }};
`;

const CreditQuantity = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const CreditMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EnrollmentsSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const EnrollmentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.bgAlt};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const EnrollmentDevice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const EnrollmentMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const EnrollmentCredits = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary500};
`;

const EnrollmentLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ui400};
`;

/* ---- component ---- */

export function CreditPortfolioPage() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [credits, setCredits] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (user?.uid) {
      loadPortfolio();
    }
  }, [user?.uid]);

  const loadPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userCredits, userEnrollments] = await Promise.all([
        fetchUserCredits(user.uid),
        EnrollmentAPI.list(user.uid).then(r => r?.enrollments || []).catch(() => []),
      ]);
      setCredits(userCredits);
      setEnrollments(Array.isArray(userEnrollments) ? userEnrollments : []);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Unable to load your credit portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCredits = useMemo(() => {
    let result = credits;
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      result = result.filter(c => c.type === typeFilter);
    }
    return result;
  }, [credits, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = credits.length;
    const available = credits.filter(c => c.status === 'active' || c.status === 'verified').length;
    const listed = credits.filter(c => c.status === 'listed').length;
    const totalQuantity = credits.reduce((sum, c) => sum + (c.quantity || 0), 0);
    return { total, available, listed, totalQuantity };
  }, [credits]);

  if (!user?.uid) {
    return (
      <PageShell>
        <ContentWrapper>
          <EmptyStateContainer>
            <EmptyStateTitle>Sign In Required</EmptyStateTitle>
            <EmptyStateText>Sign in to view your credit portfolio.</EmptyStateText>
            <PrimaryButton onClick={() => navigate('/')}>Sign In</PrimaryButton>
          </EmptyStateContainer>
        </ContentWrapper>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SEOHead
        title="My Credit Portfolio"
        description="View and manage your water quality credits. Track credit generation, list credits for sale, and monitor enrollment status."
        canonical="/credits"
      />
      <ContentWrapper>
        <Header>
          <PageTitle>My Credit Portfolio</PageTitle>
          <PageSubtitle>Track your water quality credits and program enrollments</PageSubtitle>
        </Header>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {loading ? (
          <LoadingContainer><Spinner /></LoadingContainer>
        ) : (
          <>
            <StatsGrid>
              <StatCard>
                <StatLabel>Total Credits</StatLabel>
                <StatValue>{stats.total}</StatValue>
                <StatSubtext>{stats.totalQuantity.toFixed(2)} total units</StatSubtext>
              </StatCard>
              <StatCard>
                <StatLabel>Available</StatLabel>
                <StatValue $color="#10b981">{stats.available}</StatValue>
                <StatSubtext>Ready to list or use</StatSubtext>
              </StatCard>
              <StatCard>
                <StatLabel>Listed</StatLabel>
                <StatValue $color="#3b82f6">{stats.listed}</StatValue>
                <StatSubtext>On marketplace</StatSubtext>
              </StatCard>
              <StatCard>
                <StatLabel>Enrollments</StatLabel>
                <StatValue $color="#1D7072">{enrollments.length}</StatValue>
                <StatSubtext>Active programs</StatSubtext>
              </StatCard>
            </StatsGrid>

            {/* Active Enrollments */}
            {enrollments.length > 0 && (
              <EnrollmentsSection>
                <SectionHeading>Active Enrollments</SectionHeading>
                {enrollments.map(enrollment => (
                  <EnrollmentItem key={enrollment.id}>
                    <div style={{ flex: 1 }}>
                      <EnrollmentDevice>{enrollment.deviceId}</EnrollmentDevice>
                      <EnrollmentMeta>
                        Program: {enrollment.programId} • Status: {enrollment.status}
                      </EnrollmentMeta>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <EnrollmentCredits>
                        {(enrollment.creditsGenerated || 0).toFixed(2)}
                      </EnrollmentCredits>
                      <EnrollmentLabel>Credits Generated</EnrollmentLabel>
                    </div>
                  </EnrollmentItem>
                ))}
              </EnrollmentsSection>
            )}

            {/* Credit Filters */}
            <FiltersRow>
              <FilterChip $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                All Status
              </FilterChip>
              <FilterChip $active={statusFilter === 'verified'} onClick={() => setStatusFilter('verified')}>
                Verified
              </FilterChip>
              <FilterChip $active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>
                Pending
              </FilterChip>
              <FilterChip $active={statusFilter === 'listed'} onClick={() => setStatusFilter('listed')}>
                Listed
              </FilterChip>
              <FilterChip $active={statusFilter === 'retired'} onClick={() => setStatusFilter('retired')}>
                Retired
              </FilterChip>
            </FiltersRow>

            <FiltersRow>
              <FilterChip $active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
                All Types
              </FilterChip>
              <FilterChip $active={typeFilter === 'nitrogen'} onClick={() => setTypeFilter('nitrogen')}>
                Nitrogen
              </FilterChip>
              <FilterChip $active={typeFilter === 'phosphorus'} onClick={() => setTypeFilter('phosphorus')}>
                Phosphorus
              </FilterChip>
              <FilterChip $active={typeFilter === 'stormwater'} onClick={() => setTypeFilter('stormwater')}>
                Stormwater
              </FilterChip>
              <FilterChip $active={typeFilter === 'thermal'} onClick={() => setTypeFilter('thermal')}>
                Thermal
              </FilterChip>
            </FiltersRow>

            {filteredCredits.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateTitle>No Credits Yet</EmptyStateTitle>
                <EmptyStateText>
                  {credits.length === 0
                    ? 'Enroll your devices in a trading program to start generating credits.'
                    : 'No credits match your current filters.'}
                </EmptyStateText>
                {credits.length === 0 && (
                  <PrimaryButton onClick={() => navigate('/programs')}>
                    Browse Trading Programs
                  </PrimaryButton>
                )}
              </EmptyStateContainer>
            ) : (
              <CreditGrid>
                {filteredCredits.map(credit => (
                  <CreditCard key={credit.id} $type={credit.type} $hoverable>
                    <CreditHeader>
                      <CreditId>{credit.id}</CreditId>
                      <StatusBadge $status={credit.status}>{credit.status}</StatusBadge>
                    </CreditHeader>
                    <CreditTypeBadge $type={credit.type}>{credit.type}</CreditTypeBadge>
                    <CreditQuantity>
                      {(credit.quantity || 0).toLocaleString()} {credit.unit || 'lbs'}
                    </CreditQuantity>
                    <CreditMeta>
                      {credit.projectName || credit.location || 'Unknown origin'}
                    </CreditMeta>
                    <CreditMeta>
                      Issued: {credit.issueDate
                        ? new Date(credit.issueDate).toLocaleDateString()
                        : 'Pending'}
                    </CreditMeta>
                    {(credit.status === 'verified' || credit.status === 'active') && (
                      <SecondaryButton
                        style={{ marginTop: '12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/marketplace/seller-dashboard');
                        }}
                      >
                        List on Marketplace
                      </SecondaryButton>
                    )}
                  </CreditCard>
                ))}
              </CreditGrid>
            )}
          </>
        )}
      </ContentWrapper>
    </PageShell>
  );
}
