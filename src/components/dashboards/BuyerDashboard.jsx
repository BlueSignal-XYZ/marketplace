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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
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

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors?.primary600 || '#0284c7'};
  color: #ffffff;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary700 || '#0369a1'};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui300 || '#d1d5db'};
    cursor: not-allowed;
  }
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

const BuyerDashboard = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [credits, setCredits] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.uid]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API calls
      // const availableCredits = await CreditAPI.getAvailableCredits();
      // const userPurchases = await UserAPI.purchases.getHistory(user.uid);

      // Mock data for now
      setCredits([
        {
          id: 'c1',
          type: 'Nutrient Reduction',
          amount: 150,
          unit: 'lbs N',
          price: 45.0,
          location: 'Upper Chesapeake Bay',
          seller: 'Johnson Farm Co-op',
        },
        {
          id: 'c2',
          type: 'Stormwater Retention',
          amount: 3200,
          unit: 'gal',
          price: 120.0,
          location: 'Baltimore County',
          seller: 'Green Infrastructure LLC',
        },
        {
          id: 'c3',
          type: 'Thermal Mitigation',
          amount: 500,
          unit: 'BTU',
          price: 75.0,
          location: 'Patuxent River Watershed',
          seller: 'Riverkeep Solutions',
        },
      ]);

      setPurchases([
        {
          id: 'p1',
          date: '2025-11-20',
          type: 'Nutrient Reduction',
          amount: 100,
          unit: 'lbs N',
          price: 30.0,
          status: 'Completed',
        },
        {
          id: 'p2',
          date: '2025-11-15',
          type: 'Stormwater Retention',
          amount: 2000,
          unit: 'gal',
          price: 80.0,
          status: 'Pending Verification',
        },
      ]);
    } catch (error) {
      console.error('Error loading buyer dashboard:', error);
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
          <EmptyState>Loading your dashboard...</EmptyState>
        </Shell>
      </Page>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0);
  const pendingCount = purchases.filter((p) => p.status.includes('Pending')).length;

  return (
    <Page>
      <Shell>
        <Header>
          <h1>Credit Buyer Dashboard</h1>
          <p>
            Browse available credits, track your purchases, and meet compliance requirements.
          </p>
        </Header>

        <Grid>
          <StatusCard>
            <div className="label">Available Credits</div>
            <div className="value">{credits.length}</div>
            <div className="subtext">Ready to purchase</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Total Spent</div>
            <div className="value">${totalSpent.toFixed(0)}</div>
            <div className="subtext">{purchases.length} purchases</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Pending Verification</div>
            <div className="value">{pendingCount}</div>
            <div className="subtext">Awaiting approval</div>
          </StatusCard>
        </Grid>

        <Section>
          <h2>Available Credits for Purchase</h2>
          {credits.length === 0 ? (
            <EmptyState>
              <p>No credits currently available.</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                Check back soon or contact sellers directly.
              </p>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Credit Type</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {credits.map((credit) => (
                  <tr key={credit.id}>
                    <td className="credit-type">{credit.type}</td>
                    <td>
                      {credit.amount} {credit.unit}
                    </td>
                    <td>{credit.location}</td>
                    <td>{credit.seller}</td>
                    <td className="price">${credit.price}</td>
                    <td>
                      <span
                        className="btn-link"
                        onClick={() => handleViewCredit(credit.id)}
                      >
                        View Details
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <div style={{ marginTop: '20px' }}>
            <ActionButton onClick={handleBrowseMarketplace}>
              Browse All Credits
            </ActionButton>
          </div>
        </Section>

        <Section>
          <h2>Recent Purchases</h2>
          {purchases.length === 0 ? (
            <EmptyState>
              <p>You haven't made any purchases yet.</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                Start by browsing available credits above.
              </p>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.date}</td>
                    <td className="credit-type">{purchase.type}</td>
                    <td>
                      {purchase.amount} {purchase.unit}
                    </td>
                    <td className="price">${purchase.price}</td>
                    <td>{purchase.status}</td>
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

export default BuyerDashboard;
