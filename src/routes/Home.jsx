import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Section, Container, Stack, PageTitle, PageSubtitle } from "../styles/layout";
import { Card } from "../components/shared/Card/Card";
import { ButtonPrimary, ButtonSecondary } from "../components/shared/button/Button";

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors?.bg || "#fafafa"};
`;

const CenteredCard = styled(Card)`
  max-width: 600px;
  text-align: center;
  padding: 48px 40px;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

/**
 * Placeholder for custom dashboard routes (/dashboard/:dashID)
 * Role-based dashboards are at /dashboard/buyer, /dashboard/seller, /dashboard/installer
 */
const Home = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <Container $size="md">
        <Section $spacing="lg">
          <CenteredCard $elevated>
            <Stack $gap="lg">
              <div>
                <PageTitle style={{ marginBottom: 8 }}>Custom Dashboard</PageTitle>
                <PageSubtitle style={{ maxWidth: "none", textAlign: "center" }}>
                  This dashboard feature is coming soon. For now, please use your role-based dashboard.
                </PageSubtitle>
              </div>
              <ButtonGroup>
                <ButtonSecondary onClick={() => navigate(-1)}>
                  Go Back
                </ButtonSecondary>
                <ButtonPrimary onClick={() => navigate("/marketplace")}>
                  Browse Marketplace
                </ButtonPrimary>
              </ButtonGroup>
            </Stack>
          </CenteredCard>
        </Section>
      </Container>
    </Page>
  );
};

export default Home;
