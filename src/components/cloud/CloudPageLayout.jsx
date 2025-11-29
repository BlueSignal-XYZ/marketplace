// /src/components/cloud/CloudPageLayout.jsx
import React from "react";
import styled from "styled-components";

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 24px 20px 48px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors?.bg || "#fafafa"};

  @media (max-width: 600px) {
    padding: 16px 12px 40px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || "1200px"};
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;

  @media (max-width: 600px) {
    margin-bottom: 20px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  letter-spacing: -0.02em;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin-bottom: 12px;

  a {
    color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  span.separator {
    color: ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Content = styled.div`
  width: 100%;
`;

/**
 * CloudPageLayout - Standardized layout for all Cloud mode pages
 *
 * @param {string} title - Page title
 * @param {string} subtitle - Optional subtitle/description
 * @param {React.ReactNode} breadcrumbs - Optional breadcrumb navigation
 * @param {React.ReactNode} actions - Optional action buttons/controls
 * @param {React.ReactNode} children - Page content
 * @param {string} maxWidth - Optional max-width override (default: 1200px)
 */
export function CloudPageLayout({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  maxWidth,
}) {
  return (
    <Page>
      <Shell $maxWidth={maxWidth}>
        <Header>
          {breadcrumbs && <Breadcrumbs>{breadcrumbs}</Breadcrumbs>}
          <TitleRow>
            <TitleBlock>
              <Title>{title}</Title>
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </TitleBlock>
            {actions && <ActionBar>{actions}</ActionBar>}
          </TitleRow>
        </Header>
        <Content>{children}</Content>
      </Shell>
    </Page>
  );
}

export default CloudPageLayout;
