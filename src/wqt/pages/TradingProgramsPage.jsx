import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TradingProgramAPI } from '../../scripts/back_door';
import { db } from '../../apis/firebase';
import { ref, get } from 'firebase/database';
import SEOHead from '../../components/seo/SEOHead';
import {
  PageShell,
  ContentWrapper,
  PageTitle,
  PageSubtitle,
  FiltersRow,
  FilterChip,
  Card,
  StatusBadge,
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

const ProgramGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProgramCard = styled(Card)`
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const ProgramHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgramName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const ProgramType = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: capitalize;
`;

const ProgramDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  line-height: 1.5;
`;

const IncentiveBlock = styled.div`
  background: ${({ theme }) => theme.colors.success50};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const IncentiveLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success600};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const IncentiveValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success800};
`;

const ProgramMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

/* ---- component ---- */

export function TradingProgramsPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try backend API first
      try {
        const response = await TradingProgramAPI.list();
        if (response?.programs && response.programs.length > 0) {
          setPrograms(response.programs);
          setLoading(false);
          return;
        }
      } catch {
        // Fall through to direct RTDB
      }

      // Direct RTDB read
      const programsRef = ref(db, 'tradingPrograms');
      const snapshot = await get(programsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, p]) => ({ id, ...p }));
        setPrograms(list);
      } else {
        setPrograms([]);
      }
    } catch (err) {
      console.error('Failed to load trading programs:', err);
      setError('Unable to load trading programs. Please try again later.');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <PageShell>
      <SEOHead
        title="Water Quality Trading Programs"
        description="Browse active water quality trading programs in your area. Opt in your monitoring devices to generate and trade nutrient credits."
        canonical="/programs"
        keywords="trading programs, water quality, nutrient trading, credit generation"
      />
      <ContentWrapper>
        <Header>
          <PageTitle>Trading Programs</PageTitle>
          <PageSubtitle>
            Browse available water quality trading programs. Enroll your monitoring devices to generate credits.
          </PageSubtitle>
        </Header>

        <FiltersRow>
          <FilterChip $active={filter === 'all'} onClick={() => setFilter('all')}>
            All Programs
          </FilterChip>
          <FilterChip $active={filter === 'active'} onClick={() => setFilter('active')}>
            Active
          </FilterChip>
          <FilterChip $active={filter === 'upcoming'} onClick={() => setFilter('upcoming')}>
            Upcoming
          </FilterChip>
          <FilterChip $active={filter === 'closed'} onClick={() => setFilter('closed')}>
            Closed
          </FilterChip>
        </FiltersRow>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {loading ? (
          <LoadingContainer><Spinner /></LoadingContainer>
        ) : filteredPrograms.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateTitle>No Trading Programs Available</EmptyStateTitle>
            <EmptyStateText>
              {filter === 'all'
                ? 'There are no trading programs available yet. Check back soon as new programs are being developed.'
                : `No ${filter} programs found. Try changing the filter.`}
            </EmptyStateText>
          </EmptyStateContainer>
        ) : (
          <ProgramGrid>
            {filteredPrograms.map(program => (
              <ProgramCard
                key={program.id}
                $hoverable
                onClick={() => navigate(`/programs/${program.id}`)}
              >
                <ProgramHeader>
                  <div>
                    <ProgramName>{program.name}</ProgramName>
                    <ProgramType>{program.type} trading</ProgramType>
                  </div>
                  <StatusBadge $status={program.status}>
                    {program.status}
                  </StatusBadge>
                </ProgramHeader>

                {program.incentives?.description && (
                  <ProgramDescription>{program.incentives.description}</ProgramDescription>
                )}

                {program.incentives?.ratePerUnit > 0 && (
                  <IncentiveBlock>
                    <IncentiveLabel>Incentive Rate</IncentiveLabel>
                    <IncentiveValue>
                      ${program.incentives.ratePerUnit}/{program.incentives.unit || 'unit'}
                    </IncentiveValue>
                  </IncentiveBlock>
                )}

                <ProgramMeta>
                  {program.requirements?.complianceStandard && (
                    <MetaItem>
                      Standard: <span>{program.requirements.complianceStandard}</span>
                    </MetaItem>
                  )}
                  {program.geography?.postalCodes && (
                    <MetaItem>
                      ZIP Codes: <span>{program.geography.postalCodes.length}</span>
                    </MetaItem>
                  )}
                </ProgramMeta>
              </ProgramCard>
            ))}
          </ProgramGrid>
        )}
      </ContentWrapper>
    </PageShell>
  );
}
