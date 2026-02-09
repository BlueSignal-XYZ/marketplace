import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { mockRegistryCredits, RegistryCredit, getCreditsByType, searchCredits as mockSearchCredits } from '../../data/mockRegistryData';
import { fetchRegistryCredits, searchCredits as realSearchCredits } from '../../services/wqtDataService';
import { DemoHint } from '../../components/DemoHint';
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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;

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

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
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
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f1f5f9;
  }
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

const StatusBadge = styled.span<{ status: 'active' | 'retired' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.status === 'active' ? '#d1fae5' : '#e2e8f0'};
  color: ${props => props.status === 'active' ? '#065f46' : '#475569'};
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

const SkeletonRow = styled.tr`
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const SkeletonCell = styled.td`
  padding: 16px 12px;
`;

const SkeletonBar = styled.div<{ width?: string }>`
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  width: ${props => props.width || '100%'};
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

const SortIndicator = styled.span<{ active: boolean; direction: 'asc' | 'desc' }>`
  margin-left: 4px;
  opacity: ${props => props.active ? 1 : 0.3};
  font-size: 12px;
`;

type SortField = 'id' | 'type' | 'quantity' | 'issueDate' | 'status';
type SortDirection = 'asc' | 'desc';

export function RegistryPage() {
  const [loading, setLoading] = useState(true);
  const [allCredits, setAllCredits] = useState<RegistryCredit[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCredit, setSelectedCredit] = useState<RegistryCredit | null>(null);
  const [sortField, setSortField] = useState<SortField>('issueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fetch real data on mount, fall back to mock
  useEffect(() => {
    let cancelled = false;
    const loadCredits = async () => {
      setLoading(true);
      try {
        const realCredits = await fetchRegistryCredits();
        if (!cancelled) {
          setAllCredits(realCredits.length > 0 ? realCredits : mockRegistryCredits);
        }
      } catch {
        if (!cancelled) {
          setAllCredits(mockRegistryCredits);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCredits();
    return () => { cancelled = true; };
  }, []);

  const filteredAndSortedCredits = useMemo(() => {
    let credits = allCredits;

    if (filterType !== 'all') {
      credits = credits.filter(c => c.type === filterType);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      credits = credits.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.projectName.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }

    credits = [...credits].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'issueDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortField === 'quantity') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return credits;
  }, [filterType, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const registrySchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://waterquality.trading/' },
    { name: 'Registry', url: 'https://waterquality.trading/registry' },
  ]);

  return (
    <PageContainer>
      <SEOHead
        title="Water Quality Credit Registry"
        description="Public registry of verified nutrient and stormwater credits. Search nitrogen, phosphorus, stormwater, and thermal credits by project, location, or credit ID."
        canonical="/registry"
        keywords="credit registry, nutrient credits, verified credits, water quality, nitrogen credits, phosphorus credits"
        jsonLd={registrySchema}
      />
      <ContentWrapper>
        <Header>
          <TitleRow>
            <Title>Credit Registry</Title>
            <DemoHint screenName="wqt-registry" />
          </TitleRow>
          <Subtitle>Public registry of verified nutrient and stormwater credits</Subtitle>
        </Header>

        <ControlsRow>
          <SearchInput
            type="text"
            placeholder="Search by credit ID, project name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </ControlsRow>

        <FilterChipsContainer>
          <FilterChip active={filterType === 'all'} onClick={() => setFilterType('all')}>
            All Credits
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
                <Th onClick={() => handleSort('id')}>
                  Credit ID
                  <SortIndicator active={sortField === 'id'} direction={sortDirection}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </SortIndicator>
                </Th>
                <Th onClick={() => handleSort('type')}>
                  Type
                  <SortIndicator active={sortField === 'type'} direction={sortDirection}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </SortIndicator>
                </Th>
                <Th onClick={() => handleSort('quantity')}>
                  Quantity
                  <SortIndicator active={sortField === 'quantity'} direction={sortDirection}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </SortIndicator>
                </Th>
                <Th>Project</Th>
                <Th onClick={() => handleSort('issueDate')}>
                  Issue Date
                  <SortIndicator active={sortField === 'issueDate'} direction={sortDirection}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </SortIndicator>
                </Th>
                <Th onClick={() => handleSort('status')}>
                  Status
                  <SortIndicator active={sortField === 'status'} direction={sortDirection}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </SortIndicator>
                </Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonRow key={i}>
                      <SkeletonCell><SkeletonBar width="80%" /></SkeletonCell>
                      <SkeletonCell><SkeletonBar width="60%" /></SkeletonCell>
                      <SkeletonCell><SkeletonBar width="70%" /></SkeletonCell>
                      <SkeletonCell><SkeletonBar width="90%" /></SkeletonCell>
                      <SkeletonCell><SkeletonBar width="75%" /></SkeletonCell>
                      <SkeletonCell><SkeletonBar width="50%" /></SkeletonCell>
                    </SkeletonRow>
                  ))}
                </>
              ) : filteredAndSortedCredits.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState>
                      <EmptyIcon>📋</EmptyIcon>
                      <EmptyTitle>No credits found</EmptyTitle>
                      <EmptyText>
                        {searchQuery
                          ? 'Try adjusting your search or filter criteria'
                          : 'No credits registered yet'}
                      </EmptyText>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                filteredAndSortedCredits.map((credit) => (
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
                    <Td>{formatDate(credit.issueDate)}</Td>
                    <Td>
                      <StatusBadge status={credit.status}>
                        {credit.status === 'active' ? 'Active' : 'Retired'}
                      </StatusBadge>
                    </Td>
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
                <DetailLabel>Issue Date</DetailLabel>
                <DetailValue>{formatDate(selectedCredit.issueDate)}</DetailValue>
              </DetailRow>

              {selectedCredit.retirementDate && (
                <DetailRow>
                  <DetailLabel>Retirement Date</DetailLabel>
                  <DetailValue>{formatDate(selectedCredit.retirementDate)}</DetailValue>
                </DetailRow>
              )}

              <DetailRow>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <StatusBadge status={selectedCredit.status}>
                    {selectedCredit.status === 'active' ? 'Active' : 'Retired'}
                  </StatusBadge>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Verification ID</DetailLabel>
                <DetailValue>{selectedCredit.verificationId}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Verifier</DetailLabel>
                <DetailValue>{selectedCredit.verifier}</DetailValue>
              </DetailRow>
            </ModalContent>
          </DetailModal>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
