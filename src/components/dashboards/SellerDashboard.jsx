import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 24px 16px 40px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors?.bg || '#f5f5f5'};

  @media (max-width: 600px) {
    padding: 16px 8px 32px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || '#0f172a'};
  }

  p {
    margin: 0;
    font-size: 15px;
    color: ${({ theme }) => theme.colors?.ui600 || '#4b5563'};
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ variant }) =>
    variant === 'secondary' ? '#ffffff' : '#0284c7'};
  color: ${({ variant }) => (variant === 'secondary' ? '#0284c7' : '#ffffff')};
  border: ${({ variant }) =>
    variant === 'secondary' ? '1px solid #0284c7' : 'none'};

  &:hover {
    background: ${({ variant }) =>
      variant === 'secondary' ? '#e0f2ff' : '#0369a1'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatusCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;

  .label {
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.ui500 || '#6b7280'};
    margin-bottom: 8px;
  }

  .value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.primary700 || '#0369a1'};
    margin-bottom: 4px;
  }

  .subtext {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || '#4b5563'};
  }
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;

  h2 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || '#0f172a'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors?.ui500 || '#6b7280'};
  font-size: 14px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || '#374151'};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 14px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || '#f3f4f6'};
    color: ${({ theme }) => theme.colors?.ui800 || '#1f2937'};
  }

  tr:hover {
    background: ${({ theme }) => theme.colors?.ui50 || '#f9fafb'};
  }

  .credit-type {
    font-weight: 500;
  }

  .price {
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.primary700 || '#0369a1'};
  }

  .status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-active {
    background: #d1fae5;
    color: #065f46;
  }

  .status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  .status-sold {
    background: #e0e7ff;
    color: #3730a3;
  }

  .btn-link {
    color: ${({ theme }) => theme.colors?.primary600 || '#0284c7'};
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
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
      // TODO: Replace with real API calls
      // const userListings = await CreditAPI.getSellerListings(user.uid);
      // const userSales = await SalesAPI.getHistory(user.uid);

      // Mock data
      setListings([
        {
          id: 'l1',
          type: 'Nutrient Reduction',
          amount: 250,
          unit: 'lbs N',
          price: 75.0,
          status: 'Active',
          listedDate: '2025-11-01',
          views: 42,
        },
        {
          id: 'l2',
          type: 'Stormwater Retention',
          amount: 5000,
          unit: 'gal',
          price: 200.0,
          status: 'Pending',
          listedDate: '2025-11-22',
          views: 12,
        },
      ]);

      setSales([
        {
          id: 's1',
          date: '2025-11-18',
          type: 'Nutrient Reduction',
          amount: 100,
          unit: 'lbs N',
          buyer: 'City of Baltimore',
          price: 30.0,
        },
        {
          id: 's2',
          date: '2025-11-10',
          type: 'Thermal Mitigation',
          amount: 300,
          unit: 'BTU',
          buyer: 'Patuxent Utilities',
          price: 45.0,
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
          <EmptyState>Loading your dashboard...</EmptyState>
        </Shell>
      </Page>
    );
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.price, 0);
  const activeListings = listings.filter((l) => l.status === 'Active').length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);

  return (
    <Page>
      <Shell>
        <Header>
          <div>
            <h1>Credit Seller Dashboard</h1>
            <p>
              Manage your listings, track sales, and maximize revenue from your water quality improvements.
            </p>
          </div>
          <ActionButton onClick={handleCreateListing}>
            + Create New Listing
          </ActionButton>
        </Header>

        <Grid>
          <StatusCard>
            <div className="label">Active Listings</div>
            <div className="value">{activeListings}</div>
            <div className="subtext">{listings.length} total</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Total Revenue</div>
            <div className="value">${totalRevenue.toFixed(0)}</div>
            <div className="subtext">{sales.length} sales</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Listing Views</div>
            <div className="value">{totalViews}</div>
            <div className="subtext">Last 30 days</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Avg Sale Price</div>
            <div className="value">
              ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(0) : 0}
            </div>
            <div className="subtext">Per credit</div>
          </StatusCard>
        </Grid>

        <Section>
          <h2>Your Listings</h2>
          {listings.length === 0 ? (
            <EmptyState>
              <p>You don't have any active listings.</p>
              <p style={{ marginTop: '12px' }}>
                <ActionButton onClick={handleCreateListing}>
                  Create Your First Listing
                </ActionButton>
              </p>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Credit Type</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Listed Date</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="credit-type">{listing.type}</td>
                    <td>
                      {listing.amount} {listing.unit}
                    </td>
                    <td className="price">${listing.price}</td>
                    <td>{listing.listedDate}</td>
                    <td>{listing.views}</td>
                    <td>
                      <span
                        className={`status status-${listing.status.toLowerCase()}`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className="btn-link"
                        onClick={() => handleViewListing(listing.id)}
                      >
                        Manage
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Section>

        <Section>
          <h2>Recent Sales</h2>
          {sales.length === 0 ? (
            <EmptyState>
              <p>No sales yet.</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                Create listings to start selling credits.
              </p>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Buyer</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.date}</td>
                    <td className="credit-type">{sale.type}</td>
                    <td>
                      {sale.amount} {sale.unit}
                    </td>
                    <td>{sale.buyer}</td>
                    <td className="price">${sale.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Section>
      </Shell>
    </Page>
  );
};

export default SellerDashboard;
