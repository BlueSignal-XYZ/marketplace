import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 32px 20px 48px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors?.bg || "#fafafa"};

  @media (max-width: 600px) {
    padding: 20px 16px 40px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08);
  padding: 48px 32px;
  box-sizing: border-box;
  text-align: center;

  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 16px;
  }
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  color: #ffffff;
  transition: background 0.15s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  }
`;

/**
 * Placeholder for custom dashboard routes (/dashboard/:dashID)
 * Role-based dashboards are at /dashboard/buyer, /dashboard/seller, /dashboard/installer
 */
const Home = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <Shell>
        <Title>Custom Dashboard</Title>
        <Description>
          This dashboard feature is coming soon. For now, please use your role-based dashboard.
        </Description>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Shell>
    </Page>
  );
};

export default Home;
