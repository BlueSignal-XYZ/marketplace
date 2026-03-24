/**
 * PrivacyPage — Privacy Policy for waterquality.trading.
 * Public route, no auth required.
 */

import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 80px 24px 48px;
  background: #0B1120;
  color: #FFFFFF;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 100px 24px 64px;
  }
`;

const HeroInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin: 0 0 12px;
`;

const Updated = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
`;

const Content = styled.section`
  padding: 48px 24px 80px;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 640px) {
    padding: 32px 16px 56px;
  }
`;

const Inner = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const H2 = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 40px 0 12px;
  letter-spacing: -0.01em;

  &:first-of-type { margin-top: 0; }
`;

const P = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 16px;
`;

const BackLink = styled.a`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.15s;

  &:hover {
    color: #FFFFFF;
  }
`;

export default function PrivacyPage() {
  return (
    <Page>
      <Hero>
        <HeroInner>
          <BackLink href="/">&larr; Back to home</BackLink>
          <HeroTitle>Privacy Policy</HeroTitle>
          <Updated>Last Updated: February 2026</Updated>
        </HeroInner>
      </Hero>
      <Content>
        <Inner>
          <H2>1. Introduction</H2>
          <P>BlueSignal LTD ("we", "us", "our") operates waterquality.trading and cloud.bluesignal.xyz. This Privacy Policy describes how we collect, use, and protect your personal information.</P>

          <H2>2. Information We Collect</H2>
          <P><strong>Account Information:</strong> Name, email address, company/organization name, role selection, authentication credentials managed through Firebase Authentication.</P>
          <P><strong>Device and Monitoring Data:</strong> Water production volume from inline flow sensors, water quality measurements from BlueSignal devices, device status and connectivity data, GPS coordinates of monitoring sites.</P>
          <P><strong>Transaction Data:</strong> Credit purchase and sale history, rebate calculations and settlement records, payment information processed through third-party providers.</P>
          <P><strong>Usage Data:</strong> Pages visited, features used, browser and device type, IP address and approximate location.</P>
          <P><strong>Cookies:</strong> Firebase session cookies for authentication, analytics cookies if enabled for Platform improvement. No third-party advertising cookies are used.</P>

          <H2>3. How We Use Your Information</H2>
          <P>To operate and maintain the Platform and your account. To process credit transactions and calculate rebates. To verify water production and quality data. To generate and validate nutrient credits. To communicate about your account and transactions. To improve the Platform. To comply with legal obligations. To detect and prevent fraud.</P>

          <H2>4. How We Share Your Information</H2>
          <P>We do not sell your personal information. We may share data with: Utilities and Municipalities (aggregated production data for rebate programs), Verification Partners (site data for independent verification), Service Providers (Firebase, Cloudflare, payment processors), Aggregators (credit data, not personal info, if you participate in portfolios), Legal Requirements (when required by law or government request).</P>

          <H2>5. Data Security</H2>
          <P>All data encrypted in transit (TLS) and at rest (Firebase encryption). Authentication managed through Firebase with industry-standard security. Access restricted by role-based permissions. Regular security reviews.</P>

          <H2>6. Data Retention</H2>
          <P>Account data retained for life of account plus 3 years. Transaction records retained for 7 years for regulatory compliance. Monitoring data retained for verification period plus 2 years. You may request deletion at any time.</P>

          <H2>7. Third-Party Services</H2>
          <P>Firebase (Google) for authentication, database, and hosting. Cloudflare for CDN and security. Mapbox for map rendering. Stripe for payment processing when enabled.</P>

          <H2>8. Your Rights</H2>
          <P>Depending on jurisdiction, you may: access personal information we hold, correct inaccurate information, delete your information, export data in portable format, opt out of certain processing, withdraw consent. Contact us via the <a href="/contact" style={{ color: '#0052CC' }}>Contact page</a>.</P>

          <H2>9. Children's Privacy</H2>
          <P>The Platform is not intended for children under 18. We do not knowingly collect information from children.</P>

          <H2>10. International Transfers</H2>
          <P>Data may be processed in the United States. By using the Platform, you consent to this transfer.</P>

          <H2>11. Changes</H2>
          <P>We may update this policy periodically. Material changes communicated via Platform or email.</P>

          <H2>12. Contact</H2>
          <P>For privacy questions, visit our <a href="/contact" style={{ color: '#0052CC' }}>Contact page</a>.</P>
        </Inner>
      </Content>
    </Page>
  );
}
