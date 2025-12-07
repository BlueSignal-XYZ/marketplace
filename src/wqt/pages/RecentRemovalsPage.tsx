import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { mockRegistryCredits, RegistryCredit, getCreditsByStatus } from '../../data/mockRegistryData';
import SEOHead from '../../components/seo/SEOHead';
import { createBreadcrumbSchema } from '../../components/seo/schemas';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 80px 20px 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);

  @media (max-width: 768px) {
    padding: 70px 16px 24px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#667eea' : '#cbd5e1'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#475569'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#5568d3' : '#f8fafc'};
  }
`;

const DateFilterContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DateFilterLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

const Th = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Tbody = styled.tbody``;

const Tr = styled(motion.tr)`
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px 12px;
  font-size: 14px;
  color: #1e293b;
`;

const CreditTypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    const colors: Record<string, string> = {
      nitrogen: '#dbeafe',
      phosphorus: '#d1fae5',
      stormwater: '#cffafe',
      thermal: '#fed7aa',
    };
    return colors[props.type] || '#f3f4f6';
  }};
  color: ${props => {
    const colors: Record<string, string> = {
      nitrogen: '#1e40af',
      phosphorus: '#065f46',
      stormwater: '#155e75',
      thermal: '#9a3412',
    };
    return colors[props.type] || '#374151';
  }};
  text-transform: capitalize;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
`;

const DetailModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
`;

const ModalSubtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
`;

const DetailRow = styled.div`
  margin-bottom: 20px;
`;

const DetailLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const DetailValue = styled.div`
  font-size: 16px;
  color: #1e293b;
  font-weight: 500;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #475569;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

type DateRange = '30' | '90' | '365' | 'all';

export function RecentRemovalsPage() {
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>('90');
  const [selectedCredit, setSelectedCredit] = useState<RegistryCredit | null>(null);

  const filteredCredits = useMemo(() => {
    let credits = getCreditsByStatus('retired');

    if (filterType !== 'all') {
      credits = credits.filter(credit => credit.type === filterType);
    }

    if (dateRange !== 'all') {
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      credits = credits.filter(credit => {
        if (!credit.retirementDate) return false;
        return new Date(credit.retirementDate) >= cutoffDate;
      });
    }

    return credits.sort((a, b) => {
      if (!a.retirementDate || !b.retirementDate) return 0;
      return new Date(b.retirementDate).getTime() - new Date(a.retirementDate).getTime();
    });
  }, [filterType, dateRange]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const removalsSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://waterquality.trading/' },
    { name: 'Recent Removals', url: 'https://waterquality.trading/recent-removals' },
  ]);

  return (
    <PageContainer>
      <SEOHead
        title="Recent Credit Retirements"
        description="Track recently retired water quality credits. View nitrogen, phosphorus, stormwater, and thermal credit retirement history and usage data."
        canonical="/recent-removals"
        keywords="credit retirements, retired credits, nutrient removal, water quality transactions, credit usage"
        jsonLd={removalsSchema}
      />
      <ContentWrapper>
        <Header>
          <Title>Recent Removals</Title>
          <Subtitle>Recently retired and used nutrient credits</Subtitle>
        </Header>

        <ControlsRow>
          <DateFilterContainer>
            <DateFilterLabel>Time period:</DateFilterLabel>
            <FilterChipsContainer>
              <FilterChip active={dateRange === '30'} onClick={() => setDateRange('30')}>
                Last 30 days
              </FilterChip>
              <FilterChip active={dateRange === '90'} onClick={() => setDateRange('90')}>
                Last 90 days
              </FilterChip>
              <FilterChip active={dateRange === '365'} onClick={() => setDateRange('365')}>
                Last year
              </FilterChip>
              <FilterChip active={dateRange === 'all'} onClick={() => setDateRange('all')}>
                All time
              </FilterChip>
            </FilterChipsContainer>
          </DateFilterContainer>
        </ControlsRow>

        <FilterChipsContainer>
          <FilterChip active={filterType === 'all'} onClick={() => setFilterType('all')}>
            All Types
          </FilterChip>
          <FilterChip active={filterType === 'nitrogen'} onClick={() => setFilterType('nitrogen')}>
            Nitrogen
          </FilterChip>
          <FilterChip active={filterType === 'phosphorus'} onClick={() => setFilterType('phosphorus')}>
            Phosphorus
          </FilterChip>
          <FilterChip active={filterType === 'stormwater'} onClick={() => setFilterType('stormwater')}>
            Stormwater
          </FilterChip>
          <FilterChip active={filterType === 'thermal'} onClick={() => setFilterType('thermal')}>
            Thermal
          </FilterChip>
        </FilterChipsContainer>

        <TableContainer style={{ marginTop: 24 }}>
          <Table>
            <Thead>
              <tr>
                <Th>Credit ID</Th>
                <Th>Type</Th>
                <Th>Quantity</Th>
                <Th>Project</Th>
                <Th>Retired Date</Th>
                <Th>Retired By</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredCredits.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState>
                      <EmptyIcon>🔄</EmptyIcon>
                      <EmptyTitle>No recent retirements</EmptyTitle>
                      <EmptyText>
                        {dateRange === 'all'
                          ? 'No credits have been retired yet'
                          : `No credits retired in the selected time period`}
                      </EmptyText>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                filteredCredits.map((credit) => (
                  <Tr
                    key={credit.id}
                    onClick={() => setSelectedCredit(credit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Td style={{ fontWeight: 600, color: '#667eea' }}>{credit.id}</Td>
                    <Td>
                      <CreditTypeBadge type={credit.type}>{credit.type}</CreditTypeBadge>
                    </Td>
                    <Td>{credit.quantity.toLocaleString()} {credit.unit}</Td>
                    <Td>{credit.projectName}</Td>
                    <Td>
                      {credit.retirementDate && (
                        <>
                          {formatDate(credit.retirementDate)}
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            {getDaysAgo(credit.retirementDate)}
                          </div>
                        </>
                      )}
                    </Td>
                    <Td style={{ color: '#64748b' }}>{credit.verifier}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </ContentWrapper>

      <AnimatePresence>
        {selectedCredit && (
          <DetailModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCredit(null)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <CloseButton onClick={() => setSelectedCredit(null)}>×</CloseButton>
              <ModalHeader>
                <ModalTitle>{selectedCredit.id}</ModalTitle>
                <ModalSubtitle>{selectedCredit.projectName}</ModalSubtitle>
              </ModalHeader>

              <DetailRow>
                <DetailLabel>Credit Type</DetailLabel>
                <DetailValue>
                  <CreditTypeBadge type={selectedCredit.type}>{selectedCredit.type}</CreditTypeBadge>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Quantity</DetailLabel>
                <DetailValue>{selectedCredit.quantity.toLocaleString()} {selectedCredit.unit}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Project ID</DetailLabel>
                <DetailValue>{selectedCredit.projectId}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Location</DetailLabel>
                <DetailValue>{selectedCredit.location}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Original Issue Date</DetailLabel>
                <DetailValue>{formatDate(selectedCredit.issueDate)}</DetailValue>
              </DetailRow>

              {selectedCredit.retirementDate && (
                <DetailRow>
                  <DetailLabel>Retirement Date</DetailLabel>
                  <DetailValue>
                    {formatDate(selectedCredit.retirementDate)}
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
                      {getDaysAgo(selectedCredit.retirementDate)}
                    </div>
                  </DetailValue>
                </DetailRow>
              )}

              <DetailRow>
                <DetailLabel>Verification ID</DetailLabel>
                <DetailValue>{selectedCredit.verificationId}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Retired By</DetailLabel>
                <DetailValue>{selectedCredit.verifier}</DetailValue>
              </DetailRow>
            </ModalContent>
          </DetailModal>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
