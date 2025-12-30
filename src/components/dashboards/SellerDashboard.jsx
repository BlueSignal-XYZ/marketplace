import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        ? '#e0f7f8'
        : 'linear-gradient(135deg, #155e5f 0%, #0f4344 100%)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
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

const ListingCard = styled.div`
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

const ListingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ListingTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;

const ListingMeta = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  background: ${({ status }) => {
    switch (status) {
      case 'Active':
        return '#d1fae5';
      case 'Pending':
        return '#fef3c7';
      case 'Sold':
        return '#e0e7ff';
      default:
        return '#f3f4f6';
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case 'Active':
        return '#065f46';
      case 'Pending':
        return '#92400e';
      case 'Sold':
        return '#3730a3';
      default:
        return '#374151';
    }
  }};
`;

const CreditTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 8px;

  background: ${({ type }) => {
    switch (type) {
      case 'Nitrogen':
        return '#dbeafe';
      case 'Phosphorus':
        return '#d1fae5';
      case 'Stormwater':
        return '#cffafe';
      case 'Thermal':
        return '#fed7aa';
      default:
        return '#f3f4f6';
    }
  }};

  color: ${({ type }) => {
    switch (type) {
      case 'Nitrogen':
        return '#1e40af';
      case 'Phosphorus':
        return '#065f46';
      case 'Stormwater':
        return '#155e75';
      case 'Thermal':
        return '#9a3412';
      default:
        return '#374151';
    }
  }};
`;

const ListingStats = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const ListingStat = styled.div`
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

const SaleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const SaleInfo = styled.div`
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

const SaleAmount = styled.div`
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

const ChartContainer = styled.div`
  height: 200px;
  margin-top: 16px;

  @media (max-width: 768px) {
    height: 180px;
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
    background: #1D7072;
    color: white;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SellerDashboard = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.uid]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Enhanced mock data
      setListings([
        {
          id: 'l1',
          type: 'Nitrogen',
          name: 'Chesapeake Bay Nitrogen Reduction Credits',
          amount: 2500,
          unit: 'lbs N',
          price: 45.0,
          status: 'Active',
          listedDate: '2025-11-15',
          views: 142,
          inquiries: 8,
        },
        {
          id: 'l2',
          type: 'Phosphorus',
          name: 'Maryland Agricultural P Credits',
          amount: 800,
          unit: 'lbs P',
          price: 52.0,
          status: 'Active',
          listedDate: '2025-11-20',
          views: 67,
          inquiries: 3,
        },
        {
          id: 'l3',
          type: 'Stormwater',
          name: 'Urban Stormwater Retention Credits',
          amount: 15000,
          unit: 'gal',
          price: 0.15,
          status: 'Pending',
          listedDate: '2025-12-01',
          views: 23,
          inquiries: 1,
        },
      ]);

      setSales([
        {
          id: 's1',
          date: '2025-11-28',
          type: 'Nitrogen',
          amount: 500,
          unit: 'lbs N',
          buyer: 'City of Baltimore',
          price: 22500,
        },
        {
          id: 's2',
          date: '2025-11-22',
          type: 'Phosphorus',
          amount: 200,
          unit: 'lbs P',
          buyer: 'Patuxent River Commission',
          price: 10400,
        },
        {
          id: 's3',
          date: '2025-11-15',
          type: 'Thermal',
          amount: 1000,
          unit: 'BTU/day',
          buyer: 'Montgomery County DPW',
          price: 15000,
        },
        {
          id: 's4',
          date: '2025-11-08',
          type: 'Nitrogen',
          amount: 300,
          unit: 'lbs N',
          buyer: 'Anne Arundel County',
          price: 13500,
        },
      ]);
    } catch (error) {
      console.error('Error loading seller dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = () => {
    navigate('/marketplace/seller-dashboard');
  };

  const handleViewListing = (listingId) => {
    navigate(`/marketplace/listing/${listingId}`);
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

  const totalRevenue = sales.reduce((sum, s) => sum + s.price, 0);
  const activeListings = listings.filter((l) => l.status === 'Active').length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalInquiries = listings.reduce((sum, l) => sum + (l.inquiries || 0), 0);
  const isNewSeller = listings.length === 0;

  // Chart data
  const chartData = {
    labels: ['Nov 8', 'Nov 15', 'Nov 22', 'Nov 28'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [13500, 15000, 10400, 22500],
        backgroundColor: 'rgba(29, 112, 114, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          callback: (value) => '$' + value.toLocaleString(),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Page>
      <Shell>
        <Header>
          <h1>
            {user?.username ? `Welcome back, ${user.username}` : 'Seller Dashboard'}
          </h1>
          <p>Manage your listings, track sales, and maximize revenue from water quality improvements.</p>
        </Header>

        {isNewSeller && (
          <GettingStartedCard>
            <GettingStartedIcon>Sell</GettingStartedIcon>
            <GettingStartedContent>
              <h3>Start Selling Water Credits</h3>
              <p>
                Turn your environmental improvements into revenue. List your verified water quality
                credits and connect with buyers across the region.
              </p>
              <StepList>
                <Step onClick={handleCreateListing}>
                  <span className="number">1</span>
                  Create Listing
                </Step>
                <Step onClick={() => navigate('/marketplace/tools/verification')}>
                  <span className="number">2</span>
                  Get Verified
                </Step>
                <Step onClick={() => navigate('/marketplace/tools/calculator')}>
                  <span className="number">3</span>
                  Calculate Value
                </Step>
              </StepList>
            </GettingStartedContent>
          </GettingStartedCard>
        )}

        <HeaderActions>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <ActionButton onClick={handleCreateListing}>
              + Create New Listing
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => navigate('/dashboard/financial')}>
              View Financial Report
            </ActionButton>
          </div>
        </HeaderActions>

        <Grid>
          <StatusCard>
            <CardIcon color="#d1fae5">Active</CardIcon>
            <CardLabel>Active Listings</CardLabel>
            <CardValue>{activeListings}</CardValue>
            <CardSubtext>{listings.length} total listings</CardSubtext>
          </StatusCard>

          <StatusCard>
            <CardIcon color="#dbeafe">$</CardIcon>
            <CardLabel>Total Revenue</CardLabel>
            <CardValue>${(totalRevenue / 1000).toFixed(1)}k</CardValue>
            <CardSubtext positive>+23% this month</CardSubtext>
          </StatusCard>

          <StatusCard>
            <CardIcon color="#fef3c7">Views</CardIcon>
            <CardLabel>Listing Views</CardLabel>
            <CardValue>{totalViews}</CardValue>
            <CardSubtext>Last 30 days</CardSubtext>
          </StatusCard>

          <StatusCard>
            <CardIcon color="#e0e7ff">Asks</CardIcon>
            <CardLabel>Inquiries</CardLabel>
            <CardValue>{totalInquiries}</CardValue>
            <CardSubtext positive>{totalInquiries > 0 ? 'New messages' : 'No new'}</CardSubtext>
          </StatusCard>
        </Grid>

        <SectionGrid>
          <div>
            <Section>
              <SectionHeader>
                <h2>Your Listings</h2>
                <ViewAllLink onClick={() => navigate('/marketplace')}>View All</ViewAllLink>
              </SectionHeader>

              {listings.length === 0 ? (
                <EmptyState>
                  <div className="icon">No listings</div>
                  <h3>No listings yet</h3>
                  <p>Create your first listing to start selling water quality credits.</p>
                  <ActionButton onClick={handleCreateListing}>
                    Create Your First Listing
                  </ActionButton>
                </EmptyState>
              ) : (
                listings.map((listing) => (
                  <ListingCard key={listing.id} onClick={() => handleViewListing(listing.id)}>
                    <ListingHeader>
                      <div>
                        <ListingTitle>{listing.name}</ListingTitle>
                        <ListingMeta>
                          <CreditTypeBadge type={listing.type}>{listing.type}</CreditTypeBadge>
                          Listed {listing.listedDate}
                        </ListingMeta>
                      </div>
                      <StatusBadge status={listing.status}>{listing.status}</StatusBadge>
                    </ListingHeader>
                    <ListingStats>
                      <ListingStat>
                        <div className="label">Available</div>
                        <div className="value">{listing.amount.toLocaleString()} {listing.unit}</div>
                      </ListingStat>
                      <ListingStat highlight>
                        <div className="label">Price</div>
                        <div className="value">${listing.price}/{listing.unit.split(' ')[1] || 'unit'}</div>
                      </ListingStat>
                      <ListingStat>
                        <div className="label">Views</div>
                        <div className="value">{listing.views}</div>
                      </ListingStat>
                      <ListingStat>
                        <div className="label">Inquiries</div>
                        <div className="value">{listing.inquiries || 0}</div>
                      </ListingStat>
                    </ListingStats>
                  </ListingCard>
                ))
              )}
            </Section>

            <Section>
              <SectionHeader>
                <h2>Revenue Overview</h2>
              </SectionHeader>
              <ChartContainer>
                <Bar data={chartData} options={chartOptions} />
              </ChartContainer>
            </Section>
          </div>

          <div>
            <Section>
              <SectionHeader>
                <h2>Recent Sales</h2>
              </SectionHeader>

              {sales.length === 0 ? (
                <EmptyState>
                  <div className="icon">No sales</div>
                  <h3>No sales yet</h3>
                  <p>Create listings to start selling.</p>
                </EmptyState>
              ) : (
                sales.slice(0, 4).map((sale) => (
                  <SaleItem key={sale.id}>
                    <SaleInfo>
                      <div className="type">
                        <CreditTypeBadge type={sale.type}>{sale.type}</CreditTypeBadge>
                        {sale.amount} {sale.unit}
                      </div>
                      <div className="details">{sale.buyer}</div>
                    </SaleInfo>
                    <SaleAmount>
                      <div className="price">+${sale.price.toLocaleString()}</div>
                      <div className="date">{sale.date}</div>
                    </SaleAmount>
                  </SaleItem>
                ))
              )}
            </Section>

            <Section>
              <SectionHeader>
                <h2>Quick Actions</h2>
              </SectionHeader>
              <QuickActions>
                <QuickActionCard onClick={handleCreateListing}>
                  <div className="icon">+</div>
                  <div className="content">
                    <div className="title">New Listing</div>
                    <div className="description">List credits for sale</div>
                  </div>
                </QuickActionCard>
                <QuickActionCard onClick={() => navigate('/marketplace/tools/calculator')}>
                  <div className="icon">Calc</div>
                  <div className="content">
                    <div className="title">Credit Calculator</div>
                    <div className="description">Estimate credit value</div>
                  </div>
                </QuickActionCard>
                <QuickActionCard onClick={() => navigate('/marketplace/tools/verification')}>
                  <div className="icon">Check</div>
                  <div className="content">
                    <div className="title">Verification</div>
                    <div className="description">Verify your credits</div>
                  </div>
                </QuickActionCard>
              </QuickActions>
            </Section>
          </div>
        </SectionGrid>
      </Shell>
    </Page>
  );
};

export default SellerDashboard;
