// AboutPage - Company story and values for BlueSignal
import React from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";
import { useNavigate } from "react-router-dom";
import bluesignalLogo from "../../../assets/bluesignal-logo.png";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${salesTheme.colors.bgSurface};
`;

const MainContent = styled.main`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  background: ${salesTheme.colors.bgPrimary};
  padding: 80px 24px 100px;
  text-align: center;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px 80px;
  }
`;

const HeroContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const LogoImage = styled.img`
  height: 48px;
  width: auto;
  margin-bottom: 32px;
  opacity: 0.9;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    height: 40px;
    margin-bottom: 24px;
  }
`;

const Tagline = styled.h1`
  font-size: 42px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  line-height: 1.25;
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 32px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 26px;
  }
`;

const ContentSection = styled.section`
  padding: 80px 24px;
  background: ${salesTheme.colors.bgSurface};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Card = styled.div`
  background: ${salesTheme.colors.bgCard};
  border-radius: 16px;
  padding: 40px;
  border: 1px solid ${salesTheme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${salesTheme.shadows.lg};
    border-color: rgba(16, 185, 129, 0.2);
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 32px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 24px;
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  color: ${salesTheme.colors.textMuted};

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
  }
`;

const CardTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 16px;
  letter-spacing: -0.01em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`;

const CardText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${salesTheme.colors.textMuted};
  margin: 0;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 15px;
  }
`;

const aboutContent = [
  {
    id: "our-story",
    icon: null,
    title: "Our Story",
    content: "We deploy and support smart water quality buoys, soil nutrient sensors, and submersible ultrasonic emitters that control and prevent algal blooms. Every system is configured for your site, installed by trained technicians, and backed by ongoing service options. Whether it's a single pond or an entire lake, we help it run clean and stay that way."
  },
  {
    id: "craftsmanship",
    icon: null,
    title: "Craftsmanship",
    content: "We start with a conversation\u2014what you manage, what's not working, and what you want to improve. From there, we scope a solution, handle the install, and keep it running with optional maintenance and a free dashboard for remote monitoring. You'll always know what's in your pond, in your field, and where it's headed."
  },
  {
    id: "why-we-started",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Why We Started",
    content: "BlueSignal was founded by people who've worked alongside farmers, facility managers, utility staff, and property owners. Water quality solutions are often expensive, fragile, and poorly supported. We built BlueSignal to change that."
  },
  {
    id: "mission",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    title: "Mission and Values",
    content: "We believe in keeping things simple, building for long term American growth, standing behind our service, and delivering practical tools for managing water and land."
  }
];

export default function AboutPage() {
  const navigate = useNavigate();

  const handleNavigate = (sectionId) => {
    navigate(`/?section=${sectionId}`);
  };

  return (
    <PageWrapper>
      <SalesHeader
        activeSection="about"
        onNavigate={handleNavigate}
        quoteItemCount={0}
        onOpenQuote={() => navigate("/?quote=true")}
      />

      <MainContent>
        <HeroSection>
          <HeroContainer>
            <LogoImage src={bluesignalLogo} alt="BlueSignal" />
            <Tagline>
              BlueSignal, practical tools for managing water and land—built for those who care.
            </Tagline>
          </HeroContainer>
        </HeroSection>

        <ContentSection>
          <ContentContainer>
            <Grid>
              {aboutContent.map((item) => (
                <Card key={item.id}>
                  {item.icon && <CardIcon>{item.icon}</CardIcon>}
                  <CardTitle>{item.title}</CardTitle>
                  <CardText>{item.content}</CardText>
                </Card>
              ))}
            </Grid>
          </ContentContainer>
        </ContentSection>
      </MainContent>

      <SalesFooter onNavigate={handleNavigate} />
    </PageWrapper>
  );
}
