// /src/components/elements/marketplace/TransactionPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { fetchUserOrders } from "../../../services/wqtDataService";

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
  max-width: 1200px;
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

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #1D7072;
  }
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #1D7072;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #1D7072;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const TransactionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  background: ${({ type }) => {
    switch (type) {
      case "purchase":
        return "#dbeafe";
      case "sale":
        return "#d1fae5";
      case "payout":
        return "#e0e7ff";
      case "fee":
        return "#fef3c7";
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ type }) => {
    switch (type) {
      case "purchase":
        return "#1e40af";
      case "sale":
        return "#065f46";
      case "payout":
        return "#3730a3";
      case "fee":
        return "#92400e";
      default:
        return "#374151";
    }
  }};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  background: ${({ status }) => {
    switch (status) {
      case "completed":
        return "#d1fae5";
      case "pending":
        return "#fef3c7";
      case "failed":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case "completed":
        return "#065f46";
      case "pending":
        return "#92400e";
      case "failed":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
`;

const TransactionDetails = styled.div`
  font-size: 14px;
  color: #64748b;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const TransactionAmount = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
    width: 100%;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
  }
`;

const Amount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ positive }) => (positive ? "#10b981" : "#ef4444")};
`;

const TransactionDate = styled.div`
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 24px;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #1D7072 0%, #155e5f 100%);
  color: #ffffff;
  border: none;

  &:hover {
    transform: translateY(-2px);
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ active }) => (active ? "#1D7072" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#374151")};
  border: 1px solid ${({ active }) => (active ? "#1D7072" : "#e5e7eb")};

  &:hover {
    background: ${({ active }) => (active ? "#155e5f" : "#f3f4f6")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TransactionPage = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadTransactions();
  }, [user?.uid]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Fetch real orders from RTDB
      const realOrders = await fetchUserOrders(user?.uid);

      if (realOrders.length > 0) {
        setTransactions(realOrders.map(o => ({
          id: o.id,
          type: o.buyerId === user?.uid ? 'purchase' : 'sale',
          title: `${o.type === 'credit_purchase' ? 'Credit' : 'Device'} ${o.buyerId === user?.uid ? 'Purchase' : 'Sale'}`,
          description: o.buyerId === user?.uid
            ? `Purchase from ${o.sellerCompany || o.sellerEmail || 'Seller'}`
            : `Sale to ${o.buyerCompany || o.buyerEmail || 'Buyer'}`,
          amount: o.buyerId === user?.uid ? -(o.amount || 0) : (o.amount || 0),
          date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
          status: o.status || 'pending',
          counterparty: o.buyerId === user?.uid
            ? (o.sellerCompany || o.sellerEmail || 'Unknown')
            : (o.buyerCompany || o.buyerEmail || 'Unknown'),
          creditType: o.type === 'credit_purchase' ? 'Credit' : 'Device',
        })));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    // Type filter
    if (filter !== "all" && tx.type !== filter) return false;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        tx.title.toLowerCase().includes(searchLower) ||
        tx.description.toLowerCase().includes(searchLower) ||
        tx.counterparty.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1>My Transactions</h1>
          <p>View and track all your credit purchases, sales, and payouts.</p>
        </Header>

        <FilterBar>
          <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="purchase">Purchases</option>
            <option value="sale">Sales</option>
            <option value="payout">Payouts</option>
            <option value="fee">Fees</option>
          </FilterSelect>

          <SearchInput
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterBar>

        {filteredTransactions.length === 0 ? (
          <EmptyState>
            <h3>No transactions found</h3>
            <p>
              {search || filter !== "all"
                ? "Try adjusting your filters or search terms."
                : "You haven't made any transactions yet. Browse the marketplace to get started."}
            </p>
            <ActionButton onClick={() => navigate("/marketplace")}>
              Browse Marketplace
            </ActionButton>
          </EmptyState>
        ) : (
          <>
            <TransactionList>
              {filteredTransactions.map((tx) => (
                <TransactionCard key={tx.id}>
                  <TransactionInfo>
                    <TransactionHeader>
                      <TransactionTitle>{tx.title}</TransactionTitle>
                      <TypeBadge type={tx.type}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </TypeBadge>
                      <StatusBadge status={tx.status}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </StatusBadge>
                    </TransactionHeader>
                    <TransactionDetails>
                      <span>{tx.description}</span>
                      {tx.creditType && <span>Credit Type: {tx.creditType}</span>}
                      <span>With: {tx.counterparty}</span>
                    </TransactionDetails>
                  </TransactionInfo>
                  <TransactionAmount>
                    <Amount positive={tx.amount > 0}>
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                    </Amount>
                    <TransactionDate>{formatDate(tx.date)}</TransactionDate>
                  </TransactionAmount>
                </TransactionCard>
              ))}
            </TransactionList>

            <Pagination>
              <PageButton disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </PageButton>
              <PageButton active>1</PageButton>
              <PageButton disabled>Next</PageButton>
            </Pagination>
          </>
        )}
      </Shell>
    </PageWrapper>
  );
};

export default TransactionPage;
