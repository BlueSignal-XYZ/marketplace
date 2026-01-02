// LegalPage - Simple legal information pages for the sales portal
import React from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { salesTheme } from "../styles/theme";
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${salesTheme.colors.bgPrimary};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 120px 24px 80px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 100px 16px 60px;
  }
`;

const PageTitle = styled.h1`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 16px;
  letter-spacing: -0.02em;
`;

const LastUpdated = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textSecondary};
  margin: 0 0 40px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 16px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${salesTheme.colors.textSecondary};
  margin: 0 0 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactBox = styled.div`
  background: ${salesTheme.colors.bgSecondary};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  margin-top: 40px;
`;

const ContactTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 12px;
`;

const ContactLink = styled.a`
  color: ${salesTheme.colors.accentPrimary};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #34d399;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${salesTheme.colors.textSecondary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  transition: color 0.2s ease;

  &:hover {
    color: ${salesTheme.colors.accentPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const legalContent = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "January 2, 2026",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect information you provide directly to us, including your name, email address, and any other information you choose to provide when contacting us or subscribing to our newsletter. We also collect device and usage data through our monitoring hardware to provide our water quality services."
      },
      {
        title: "How We Use Your Information",
        content: "We use the information we collect to provide, maintain, and improve our services, communicate with you about products and services, and comply with legal obligations. Water quality data collected through our monitoring devices is used to generate tradeable credits and provide insights through our cloud dashboard."
      },
      {
        title: "Data Security",
        content: "We implement appropriate technical and organizational measures to protect your personal information. All data transmissions are encrypted using industry-standard SSL/TLS protocols. Device data is securely transmitted via LTE and stored in encrypted databases."
      },
      {
        title: "Your Rights",
        content: "You have the right to access, correct, or delete your personal information. You may opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly."
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "January 2, 2026",
    sections: [
      {
        title: "Acceptance of Terms",
        content: "By accessing or using BlueSignal products and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
      },
      {
        title: "Products and Services",
        content: "BlueSignal provides water quality monitoring hardware and related software services. All products are sold as-is with the warranties described in our Warranty Policy. Product specifications and availability are subject to change without notice."
      },
      {
        title: "User Responsibilities",
        content: "You are responsible for the proper installation and maintenance of BlueSignal equipment according to provided documentation. You agree to use our services only for lawful purposes and in accordance with these terms."
      },
      {
        title: "Limitation of Liability",
        content: "To the maximum extent permitted by law, BlueSignal shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or services."
      }
    ]
  },
  warranty: {
    title: "Warranty Information",
    lastUpdated: "January 2, 2026",
    sections: [
      {
        title: "Standard Warranty Coverage",
        content: "All BlueSignal monitoring equipment comes with a standard 2-year limited warranty covering manufacturing defects and component failures under normal use conditions. This warranty begins from the date of purchase."
      },
      {
        title: "What's Covered",
        content: "The warranty covers defects in materials and workmanship, including electronic components, sensors (except consumable probes), solar panels, and enclosures. We will repair or replace defective equipment at our discretion."
      },
      {
        title: "What's Not Covered",
        content: "This warranty does not cover damage caused by misuse, improper installation, unauthorized modifications, natural disasters, or normal wear and tear. Consumable items such as pH electrode probes have a separate 1-year warranty due to their limited lifespan in harsh environments."
      },
      {
        title: "Warranty Claims",
        content: "To make a warranty claim, contact our support team at hi@bluesignal.xyz with your order number and a description of the issue. We may request photos or diagnostic information to assess the problem. Approved claims will be fulfilled within 10 business days."
      },
      {
        title: "Extended Warranty",
        content: "Extended warranty options up to 4 years are available for purchase within 30 days of your original order. Contact our sales team for pricing and coverage details."
      }
    ]
  },
  accessibility: {
    title: "Accessibility Statement",
    lastUpdated: "January 2, 2026",
    sections: [
      {
        title: "Our Commitment",
        content: "BlueSignal is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards to our website and products."
      },
      {
        title: "Accessibility Features",
        content: "Our website includes features such as keyboard navigation support, descriptive alt text for images, sufficient color contrast ratios, and responsive design for various devices and screen sizes."
      },
      {
        title: "Standards Compliance",
        content: "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. We regularly review our website and take steps to address any accessibility issues."
      },
      {
        title: "Feedback",
        content: "We welcome your feedback on the accessibility of our website. If you encounter any barriers or have suggestions for improvement, please contact us at hi@bluesignal.xyz."
      }
    ]
  }
};

export default function LegalPage() {
  const location = useLocation();
  // Extract page type from pathname (e.g., "/privacy" -> "privacy")
  const type = location.pathname.replace('/', '').toLowerCase() || 'privacy';
  const content = legalContent[type] || legalContent.privacy;

  const scrollToContact = () => {
    // Navigate to home and scroll to contact
    window.location.href = "/#contact";
  };

  return (
    <PageWrapper>
      <SalesHeader onScrollToContact={scrollToContact} />
      <MainContent>
        <BackLink to="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </BackLink>

        <PageTitle>{content.title}</PageTitle>
        <LastUpdated>Last updated: {content.lastUpdated}</LastUpdated>

        {content.sections.map((section, index) => (
          <Section key={index}>
            <SectionTitle>{section.title}</SectionTitle>
            <Paragraph>{section.content}</Paragraph>
          </Section>
        ))}

        <ContactBox>
          <ContactTitle>Questions about this policy?</ContactTitle>
          <Paragraph>
            If you have any questions about this {content.title.toLowerCase()}, please contact us at{" "}
            <ContactLink href="mailto:hi@bluesignal.xyz">hi@bluesignal.xyz</ContactLink> or call{" "}
            <ContactLink href="tel:+15127300843">+1.512.730.0843</ContactLink>.
          </Paragraph>
        </ContactBox>
      </MainContent>
      <SalesFooter />
    </PageWrapper>
  );
}
