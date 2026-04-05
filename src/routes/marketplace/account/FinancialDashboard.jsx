// /src/routes/FinancialDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import { useAppContext } from "../../../context/AppContext";
import { getPortfolio } from "../../../services/v2/client";
import { Skeleton } from "../../../design-system/primitives/Skeleton";
import { Button } from "../../../design-system/primitives/Button";
import { EmptyState } from "../../../design-system/primitives/EmptyState";
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

const LegendContainer = styled.div`
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

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const ErrorBanner = styled.div`
  padding: 20px 24px;
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

const ErrorText = styled.span`
  font-size: 14px;
  color: #1f2937;
`;

const FinancialDashboard = () => {
  useEffect(() => { document.title = 'Financial Dashboard — WaterQuality.Trading'; }, []);
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  const loadFinancialData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      setPortfolio(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getPortfolio(user.uid);
      setPortfolio(data);
    } catch (err) {
      setError(err?.message || "Failed to load financial data.");
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  // Derive transactions for table
  const transactions = (portfolio?.transactions || []).map((t) => ({
    id: t.id,
    date: t.timestamp ? new Date(t.timestamp).toISOString().split("T")[0] : "",
    type: t.type,
    description: `${t.nutrientType || "Credit"} - ${t.counterparty || "Transaction"}`,
    amount: t.type === "sale" ? (t.price || 0) : t.type === "purchase" ? -(t.price || 0) : 0,
  }));

  // Derive stats from portfolio
  const summary = portfolio?.summary || {};
  const saleTotal = transactions.filter((t) => t.type === "sale").reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
  const stats = {
    totalRevenue: saleTotal,
    pendingPayouts: 0,
    completedPayouts: saleTotal,
    activeListings: summary.listedCredits ?? 0,
  };

  // Revenue chart: bucket transactions by date (period)
  const getBucketKey = (d) => {
    const date = new Date(d);
    if (period === "7d") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (period === "30d" || period === "90d") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };
  const now = Date.now();
  const periodMs = { "7d": 7 * 864e5, "30d": 30 * 864e5, "90d": 90 * 864e5, "1y": 365 * 864e5 }[period] || 30 * 864e5;
  const cutoff = now - periodMs;
  const saleTxns = (portfolio?.transactions || [])
    .filter((t) => t.type === "sale" && new Date(t.timestamp).getTime() >= cutoff)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const revenueByBucket = {};
  saleTxns.forEach((t) => {
    const k = getBucketKey(t.timestamp);
    revenueByBucket[k] = (revenueByBucket[k] || 0) + (t.price || 0);
  });
  const sortedBuckets = [...new Set(saleTxns.map((t) => getBucketKey(t.timestamp)))];
  const revenueChartData = {
    labels: sortedBuckets.length > 0 ? sortedBuckets : ["—"],
    datasets: [
      {
        label: "Revenue",
        data: sortedBuckets.length > 0 ? sortedBuckets.map((k) => revenueByBucket[k]) : [0],
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

  // Credit type distribution: derive from transactions
  const typeColors = { nitrogen: "#3b82f6", phosphorus: "#10b981", thermal: "#f97316", stormwater: "#06b6d4" };
  const typeTotals = {};
  (portfolio?.transactions || []).filter((t) => t.type === "sale").forEach((t) => {
    const k = (t.nutrientType || "nitrogen").toLowerCase();
    typeTotals[k] = (typeTotals[k] || 0) + (t.price || 0);
  });
  const typeLabels = Object.keys(typeTotals).length > 0 ? Object.keys(typeTotals) : ["—"];
  const typeValues = typeLabels[0] === "—" ? [0] : typeLabels.map((k) => typeTotals[k]);
  const creditTypeData = {
    labels: typeLabels.map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [
      {
        data: typeValues,
        backgroundColor: typeLabels.map((k) => typeColors[k] || "#94a3b8"),
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
          <SkeletonGrid>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={100} />
            ))}
          </SkeletonGrid>
          <Skeleton width="100%" height={280} style={{ marginBottom: 24 }} />
          <Skeleton width="100%" height={200} />
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

        {error && (
          <ErrorBanner>
            <ErrorText>{error}</ErrorText>
            <Button variant="outline" size="sm" onClick={loadFinancialData}>
              Retry
            </Button>
          </ErrorBanner>
        )}

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
            <StatChange positive>{stats.totalRevenue > 0 ? "From sales" : "—"}</StatChange>
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
                {transactions.length === 0 ? (
                  <EmptyState
                    compact
                    title="No transactions yet"
                    description="Your sales and purchases will appear here."
                    action={{ label: "Browse Marketplace", onClick: () => navigate("/marketplace") }}
                  />
                ) : (
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
                )}
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
              <LegendContainer>
                {creditTypeData.labels?.map((label, i) => {
                  const total = creditTypeData.datasets?.[0]?.data?.reduce((a, b) => a + b, 0) || 0;
                  const pct = total > 0 ? Math.round((creditTypeData.datasets[0].data[i] / total) * 100) : 0;
                  return (
                    <LegendItem key={label}>
                      <LegendDot color={creditTypeData.datasets?.[0]?.backgroundColor?.[i]} />
                      {label} ({pct}%)
                    </LegendItem>
                  );
                })}
              </LegendContainer>
            </Section>

            <Section style={{ marginTop: "24px" }}>
              <SectionHeader>
                <h2>Payout Summary</h2>
              </SectionHeader>
              <SummaryRow>
                <span className="label">Available Balance</span>
                <span className="value">$0</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">Next Payout Date</span>
                <span className="value">—</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">Payout Method</span>
                <span className="value">—</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">Platform Fee Rate</span>
                <span className="value">—</span>
              </SummaryRow>
            </Section>
          </div>
        </ContentGrid>
      </Shell>
    </PageWrapper>
  );
};

export default FinancialDashboard;
