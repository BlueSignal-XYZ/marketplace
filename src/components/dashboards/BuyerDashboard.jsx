import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fetchUserCredits, fetchUserOrders, fetchUserDevices } from '../../services/wqtDataService';

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 80px 16px 40px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);

  @media (max-width: 768px) {
    padding: 70px 12px 32px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  p {
    margin: 0;
    font-size: 15px;
    color: #64748b;
  }
`;

const DemoBanner = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #92400e;

  .icon {
    font-size: 18px;
  }

  strong {
    font-weight: 600;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

const StatusCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 12px;
  background: ${({ color }) => color || '#e0f2ff'};
`;

const CardLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CardSubtext = styled.div`
  font-size: 13px;
  color: ${({ positive }) => (positive ? '#10b981' : '#64748b')};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }
`;

const ViewAllLink = styled.span`
  font-size: 14px;
  color: #1D7072;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: #64748b;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  p {
    margin: 0 0 20px;
    font-size: 14px;
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  min-height: 48px;
  transition: all 0.2s;

  background: ${({ variant }) =>
    variant === 'secondary'
      ? '#ffffff'
      : 'linear-gradient(135deg, #1D7072 0%, #155e5f 100%)'};
  color: ${({ variant }) => (variant === 'secondary' ? '#1D7072' : '#ffffff')};
  border: ${({ variant }) =>
    variant === 'secondary' ? '1px solid #1D7072' : 'none'};
  box-shadow: ${({ variant }) =>
    variant === 'secondary'
      ? 'none'
      : '0 4px 12px rgba(29, 112, 114, 0.3)'};

  &:hover {
    background: ${({ variant }) =>
      variant === 'secondary'
        ? '#e0f2ff'
        : 'linear-gradient(135deg, #155e5f 0%, #0f4344 100%)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #d1d5db;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const CreditCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #1D7072;
    background: #f8fafc;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CreditHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CreditTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;

const CreditMeta = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
`;

const CreditTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;

  background: ${({ type }) => {
    switch (type) {
      case 'Nitrogen':
      case 'Nutrient Reduction':
        return '#dbeafe';
      case 'Phosphorus':
        return '#d1fae5';
      case 'Stormwater':
      case 'Stormwater Retention':
        return '#cffafe';
      case 'Thermal':
      case 'Thermal Mitigation':
        return '#fed7aa';
      default:
        return '#f3f4f6';
    }
  }};

  color: ${({ type }) => {
    switch (type) {
      case 'Nitrogen':
      case 'Nutrient Reduction':
        return '#1e40af';
      case 'Phosphorus':
        return '#065f46';
      case 'Stormwater':
      case 'Stormwater Retention':
        return '#155e75';
      case 'Thermal':
      case 'Thermal Mitigation':
        return '#9a3412';
      default:
        return '#374151';
    }
  }};
`;

const CreditStats = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const CreditStat = styled.div`
  .label {
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: ${({ highlight }) => (highlight ? '#1D7072' : '#0f172a')};
  }
`;

const PurchaseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const PurchaseInfo = styled.div`
  .type {
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
  }

  .details {
    font-size: 13px;
    color: #64748b;
  }
`;

const PurchaseAmount = styled.div`
  text-align: right;

  .price {
    font-size: 16px;
    font-weight: 600;
    color: #1D7072;
  }

  .date {
    font-size: 12px;
    color: #94a3b8;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuickActionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e0f7f8;
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .content {
    flex: 1;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }

  .description {
    font-size: 12px;
    color: #64748b;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top-color: #1D7072;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const GettingStartedCard = styled.div`
  background: linear-gradient(135deg, #e0f7f8 0%, #c5e8e9 100%);
  border: 1px solid #1D7072;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const GettingStartedIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #1D7072;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const GettingStartedContent = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }

  p {
    margin: 0 0 16px;
    font-size: 14px;
    color: #475569;
    line-height: 1.5;
  }
`;

const StepList = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #1D7072;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1D7072;
    color: white;
  }

  .number {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ $completed }) => $completed ? '#10b981' : '#1D7072'};
    color: white;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  background: ${({ status }) => {
    switch (status) {
      case 'Completed':
        return '#d1fae5';
      case 'Pending':
      case 'Pending Verification':
        return '#fef3c7';
      default:
        return '#f3f4f6';
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case 'Completed':
        return '#065f46';
      case 'Pending':
      case 'Pending Verification':
        return '#92400e';
      default:
        return '#374151';
    }
  }};
`;

const BuyerDashboard = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [credits, setCredits] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadDevices();
  }, [user?.uid]);

  const loadDevices = async () => {
    try {
      const userDevices = await fetchUserDevices();
      setDevices(Array.isArray(userDevices) ? userDevices : []);
    } catch {
      setDevices([]);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data from RTDB
      const [realCredits, realOrders] = await Promise.all([
        user?.uid ? fetchUserCredits(user.uid) : [],
        user?.uid ? fetchUserOrders(user.uid) : [],
      ]);

      if (realCredits.length > 0) {
        setCredits(realCredits.map(c => ({
          id: c.id,
          type: c.type ? c.type.charAt(0).toUpperCase() + c.type.slice(1) : 'Nutrient Reduction',
          amount: c.quantity || 0,
          unit: c.unit || 'lbs',
          price: 0,
          location: c.location || 'Unknown',
          seller: c.verifier || 'Unknown',
        })));
      } else {
        // Fallback mock data for empty state
        setCredits([]);
      }

      if (realOrders.length > 0) {
        setPurchases(realOrders
          .filter(o => o.buyerId === user?.uid)
          .map(o => ({
            id: o.id,
            date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
            type: o.type === 'credit_purchase' ? 'Credit Purchase' : o.type,
            amount: 0,
            unit: '',
            price: o.amount || 0,
            status: o.status === 'completed' ? 'Completed' : 'Pending Verification',
          }))
        );
      } else {
        setPurchases([]);
      }
    } catch (error) {
      console.error('Error loading buyer dashboard:', error);
      setCredits([]);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCredit = (creditId) => {
    navigate(`/marketplace/listing/${creditId}`);
  };

  const handleBrowseMarketplace = () => {
    navigate('/marketplace');
  };

  if (loading) {
    return (
      <Page>
        <Shell>
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        </Shell>
      </Page>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0);
  const pendingCount = purchases.filter((p) => p.status.includes('Pending')).length;
  const isNewUser = purchases.length === 0;

  return (
    <Page>
      <Shell>
        <Header>
          <h1>
            {user?.username ? `Welcome back, ${user.username}` : 'Buyer Dashboard'}
          </h1>
          <p>Browse available credits, track purchases, and manage compliance requirements.</p>
        </Header>

        <DemoBanner>
          <span className="icon">ℹ️</span>
          <span><strong>Sample Data:</strong> This dashboard shows example credits and purchases for demonstration purposes. Your actual data will appear here once you make purchases.</span>
        </DemoBanner>

        {isNewUser && (
          <GettingStartedCard>
            <GettingStartedIcon>Start</GettingStartedIcon>
            <GettingStartedContent>
              <h3>Get Started with Water Credits</h3>
              <p>
                Welcome to WaterQuality.Trading! Here's how to make your first credit purchase
                and start meeting your environmental compliance goals.
              </p>
              <StepList>
                <Step onClick={handleBrowseMarketplace}>
                  <span className="number">1</span>
                  Browse Credits
                </Step>
                <Step onClick={() => navigate('/registry')}>
                  <span className="number">2</span>
                  Verify Sources
                </Step>
                <Step onClick={() => navigate('/map')}>
                  <span className="number">3</span>
                  View Projects
                </Step>
              </StepList>
            </GettingStartedContent>
          </GettingStartedCard>
        )}

        <HeaderActions>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <ActionButton onClick={handleBrowseMarketplace}>
              Browse Marketplace
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => navigate('/registry')}>
              View Registry
            </ActionButton>
          </div>
        </HeaderActions>

        <Grid>
          <StatusCard>
            <CardIcon color="#d1fae5">Avail</CardIcon>
            <CardLabel>Available Credits</CardLabel>
            <CardValue>{credits.length}</CardValue>
            <CardSubtext>Ready to purchase</CardSubtext>
          </StatusCard>

          <StatusCard>
            <CardIcon color="#dbeafe">$</CardIcon>
            <CardLabel>Total Spent</CardLabel>
            <CardValue>${totalSpent.toFixed(0)}</CardValue>
            <CardSubtext>{purchases.length} purchases</CardSubtext>
          </StatusCard>

          <StatusCard>
            <CardIcon color="#fef3c7">Wait</CardIcon>
            <CardLabel>Pending Verification</CardLabel>
            <CardValue>{pendingCount}</CardValue>
            <CardSubtext positive={pendingCount === 0}>
              {pendingCount === 0 ? 'All verified' : 'Awaiting approval'}
            </CardSubtext>
          </StatusCard>
        </Grid>

        <SectionGrid>
          <div>
            <Section>
              <SectionHeader>
                <h2>Available Credits</h2>
                <ViewAllLink onClick={handleBrowseMarketplace}>View All</ViewAllLink>
              </SectionHeader>

              {credits.length === 0 ? (
                <EmptyState>
                  <div className="icon">Credits</div>
                  <h3>No credits available</h3>
                  <p>Check back soon or contact sellers directly.</p>
                  <ActionButton onClick={handleBrowseMarketplace}>
                    Browse Marketplace
                  </ActionButton>
                </EmptyState>
              ) : (
                credits.map((credit) => (
                  <CreditCard key={credit.id} onClick={() => handleViewCredit(credit.id)}>
                    <CreditHeader>
                      <div>
                        <CreditTitle>{credit.type}</CreditTitle>
                        <CreditMeta>
                          <CreditTypeBadge type={credit.type}>{credit.type}</CreditTypeBadge>
                          {credit.location}
                        </CreditMeta>
                      </div>
                    </CreditHeader>
                    <CreditStats>
                      <CreditStat>
                        <div className="label">Amount</div>
                        <div className="value">{credit.amount.toLocaleString()} {credit.unit}</div>
                      </CreditStat>
                      <CreditStat highlight>
                        <div className="label">Price</div>
                        <div className="value">${credit.price}</div>
                      </CreditStat>
                      <CreditStat>
                        <div className="label">Seller</div>
                        <div className="value">{credit.seller}</div>
                      </CreditStat>
                    </CreditStats>
                  </CreditCard>
                ))
              )}
            </Section>

            <Section>
              <SectionHeader>
                <h2>Recent Purchases</h2>
              </SectionHeader>

              {purchases.length === 0 ? (
                <EmptyState>
                  <div className="icon">Cart</div>
                  <h3>No purchases yet</h3>
                  <p>Start by browsing available credits above.</p>
                </EmptyState>
              ) : (
                purchases.map((purchase) => (
                  <PurchaseItem key={purchase.id}>
                    <PurchaseInfo>
                      <div className="type">
                        <CreditTypeBadge type={purchase.type}>{purchase.type}</CreditTypeBadge>
                        {purchase.amount} {purchase.unit}
                      </div>
                      <div className="details">
                        <StatusBadge status={purchase.status}>{purchase.status}</StatusBadge>
                      </div>
                    </PurchaseInfo>
                    <PurchaseAmount>
                      <div className="price">${purchase.price.toLocaleString()}</div>
                      <div className="date">{purchase.date}</div>
                    </PurchaseAmount>
                  </PurchaseItem>
                ))
              )}
            </Section>
          </div>

          <div>
            <Section>
              <SectionHeader>
                <h2>Quick Actions</h2>
              </SectionHeader>
              <QuickActions>
                <QuickActionCard onClick={handleBrowseMarketplace}>
                  <div className="icon">Browse</div>
                  <div className="content">
                    <div className="title">Browse Credits</div>
                    <div className="description">Find credits to purchase</div>
                  </div>
                </QuickActionCard>
                <QuickActionCard onClick={() => navigate('/map')}>
                  <div className="icon">Map</div>
                  <div className="content">
                    <div className="title">Project Map</div>
                    <div className="description">View project locations</div>
                  </div>
                </QuickActionCard>
                <QuickActionCard onClick={() => navigate('/registry')}>
                  <div className="icon">Registry</div>
                  <div className="content">
                    <div className="title">Credit Registry</div>
                    <div className="description">View verified credits</div>
                  </div>
                </QuickActionCard>
              </QuickActions>
            </Section>
          </div>
        </SectionGrid>

        {/* Cross-platform: Devices from BlueSignal Cloud */}
        {devices.length > 0 && (
          <Section style={{ marginTop: '24px' }}>
            <SectionHeader>
              <h2>My Devices</h2>
              <ViewAllLink onClick={() => window.open('https://cloud.bluesignal.xyz/cloud/devices', '_blank')}>
                Manage in Cloud
              </ViewAllLink>
            </SectionHeader>
            <Grid>
              {devices.slice(0, 4).map((device) => (
                <StatusCard key={device.id || device.serialNumber}>
                  <CardLabel>{device.name || device.serialNumber || device.id}</CardLabel>
                  <CardValue style={{ fontSize: '16px' }}>
                    {device.type || device.deviceType || 'WQM-1'}
                  </CardValue>
                  <CardSubtext positive={device.installation?.status === 'active' || device.lifecycle === 'active'}>
                    {device.installation?.status || device.lifecycle || 'Unknown'}
                  </CardSubtext>
                </StatusCard>
              ))}
            </Grid>
          </Section>
        )}
      </Shell>
    </Page>
  );
};

export default BuyerDashboard;
