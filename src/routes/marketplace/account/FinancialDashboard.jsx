// /src/routes/FinancialDashboard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 80px 16px 40px;
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
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;

  background: ${({ variant }) =>
    variant === "secondary"
      ? "#ffffff"
      : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"};
  color: ${({ variant }) => (variant === "secondary" ? "#0284c7" : "#ffffff")};
  border: ${({ variant }) =>
    variant === "secondary" ? "1px solid #0284c7" : "none"};

  &:hover {
    transform: translateY(-2px);
    background: ${({ variant }) =>
      variant === "secondary"
        ? "#e0f2ff"
        : "linear-gradient(135deg, #0369a1 0%, #075985 100%)"};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 12px;
  background: ${({ color }) => color || "#e0f2ff"};
`;

const StatLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const StatChange = styled.div`
  font-size: 13px;
  margin-top: 4px;
  color: ${({ positive }) => (positive ? "#10b981" : "#ef4444")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContentGrid = styled.div`
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
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
`;

const PeriodSelect = styled.select`
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0284c7;
  }
`;

const ChartContainer = styled.div`
  height: 280px;

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const DonutContainer = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
`;

const TransactionTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;

  th {
    text-align: left;
    padding: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e5e7eb;
  }

  td {
    padding: 14px 12px;
    font-size: 14px;
    color: #1f2937;
    border-bottom: 1px solid #f3f4f6;
  }

  tr:hover {
    background: #f8fafc;
  }
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  background: ${({ type }) => {
    switch (type) {
      case "sale":
        return "#d1fae5";
      case "payout":
        return "#dbeafe";
      case "fee":
        return "#fef3c7";
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ type }) => {
    switch (type) {
      case "sale":
        return "#065f46";
      case "payout":
        return "#1e40af";
      case "fee":
        return "#92400e";
      default:
        return "#374151";
    }
  }};
`;

const AmountCell = styled.span`
  font-weight: 600;
  color: ${({ positive }) => (positive ? "#10b981" : "#ef4444")};
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    font-size: 14px;
    color: #64748b;
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
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
    border-top-color: #0284c7;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const FinancialDashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const stats = {
    totalRevenue: 61400,
    pendingPayouts: 22500,
    completedPayouts: 38900,
    activeListings: 3,
  };

  const transactions = [
    {
      id: "t1",
      date: "2025-11-28",
      type: "sale",
      description: "Nitrogen credits - City of Baltimore",
      amount: 22500,
    },
    {
      id: "t2",
      date: "2025-11-25",
      type: "payout",
      description: "Payout to bank account ****4521",
      amount: -15000,
    },
    {
      id: "t3",
      date: "2025-11-22",
      type: "sale",
      description: "Phosphorus credits - Patuxent River Commission",
      amount: 10400,
    },
    {
      id: "t4",
      date: "2025-11-20",
      type: "fee",
      description: "Platform fee (2.5%)",
      amount: -260,
    },
    {
      id: "t5",
      date: "2025-11-15",
      type: "sale",
      description: "Thermal credits - Montgomery County DPW",
      amount: 15000,
    },
  ];

  // Revenue chart data
  const revenueChartData = {
    labels: ["Oct 1", "Oct 8", "Oct 15", "Oct 22", "Nov 1", "Nov 8", "Nov 15", "Nov 22", "Nov 28"],
    datasets: [
      {
        label: "Revenue",
        data: [5200, 8400, 12000, 18500, 25000, 38500, 53500, 48900, 61400],
        fill: true,
        borderColor: "#0284c7",
        backgroundColor: "rgba(2, 132, 199, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#0284c7",
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          callback: (value) => "$" + (value / 1000) + "k",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Credit type distribution
  const creditTypeData = {
    labels: ["Nitrogen", "Phosphorus", "Thermal", "Stormwater"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#3b82f6", "#10b981", "#f97316", "#06b6d4"],
        borderWidth: 0,
      },
    ],
  };

  const creditTypeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  if (loading) {
    return (
      <PageWrapper>
        <Shell>
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        </Shell>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Shell>
        <Header>
          <h1>Financial Dashboard</h1>
          <p>Track your revenue, payouts, and marketplace activity.</p>
        </Header>

        <HeaderActions>
          <ActionButton onClick={() => navigate("/dashboard/seller")}>
            View Seller Dashboard
          </ActionButton>
          <ActionButton variant="secondary">
            Export Report
          </ActionButton>
        </HeaderActions>

        <StatsGrid>
          <StatCard>
            <StatIcon color="#d1fae5">$</StatIcon>
            <StatLabel>Total Revenue</StatLabel>
            <StatValue>${(stats.totalRevenue / 1000).toFixed(1)}k</StatValue>
            <StatChange positive>+23% from last month</StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="#fef3c7">Clock</StatIcon>
            <StatLabel>Pending Payouts</StatLabel>
            <StatValue>${(stats.pendingPayouts / 1000).toFixed(1)}k</StatValue>
            <StatChange>Processing</StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="#dbeafe">Check</StatIcon>
            <StatLabel>Completed Payouts</StatLabel>
            <StatValue>${(stats.completedPayouts / 1000).toFixed(1)}k</StatValue>
            <StatChange positive>All time</StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="#e0e7ff">List</StatIcon>
            <StatLabel>Active Listings</StatLabel>
            <StatValue>{stats.activeListings}</StatValue>
            <StatChange positive>Generating revenue</StatChange>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <div>
            <Section>
              <SectionHeader>
                <h2>Revenue Over Time</h2>
                <PeriodSelect value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </PeriodSelect>
              </SectionHeader>
              <ChartContainer>
                <Line data={revenueChartData} options={revenueChartOptions} />
              </ChartContainer>
            </Section>

            <Section style={{ marginTop: "24px" }}>
              <SectionHeader>
                <h2>Recent Transactions</h2>
              </SectionHeader>
              <TransactionTable>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.date}</td>
                        <td>
                          <TypeBadge type={tx.type}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </TypeBadge>
                        </td>
                        <td>{tx.description}</td>
                        <td>
                          <AmountCell positive={tx.amount > 0}>
                            {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                          </AmountCell>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TransactionTable>
            </Section>
          </div>

          <div>
            <Section>
              <SectionHeader>
                <h2>Revenue by Credit Type</h2>
              </SectionHeader>
              <DonutContainer>
                <Doughnut data={creditTypeData} options={creditTypeOptions} />
              </DonutContainer>
              <Legend>
                <LegendItem>
                  <LegendDot color="#3b82f6" />
                  Nitrogen (45%)
                </LegendItem>
                <LegendItem>
                  <LegendDot color="#10b981" />
                  Phosphorus (25%)
                </LegendItem>
                <LegendItem>
                  <LegendDot color="#f97316" />
                  Thermal (20%)
                </LegendItem>
                <LegendItem>
                  <LegendDot color="#06b6d4" />
                  Stormwater (10%)
                </LegendItem>
              </Legend>
            </Section>

            <Section style={{ marginTop: "24px" }}>
              <SectionHeader>
                <h2>Payout Summary</h2>
              </SectionHeader>
              <SummaryRow>
                <span className="label">Available Balance</span>
                <span className="value">$22,500</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">Next Payout Date</span>
                <span className="value">Dec 1, 2025</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">Payout Method</span>
                <span className="value">Bank ****4521</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">Platform Fee Rate</span>
                <span className="value">2.5%</span>
              </SummaryRow>
            </Section>
          </div>
        </ContentGrid>
      </Shell>
    </PageWrapper>
  );
};

export default FinancialDashboard;
