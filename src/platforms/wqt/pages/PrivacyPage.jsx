/**
 * PrivacyPage — Privacy Policy for waterquality.trading.
 * Public route, no auth required.
 */

import { useEffect } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 48px 24px 40px;
  background: #0b1120;
  color: #ffffff;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 64px 24px 48px;
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
  color: #ffffff;
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

  &:first-of-type {
    margin-top: 0;
  }
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
    color: #ffffff;
  }
`;

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — WaterQuality.Trading';
  }, []);
  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroTitle>Privacy Policy</HeroTitle>
          <Updated>Last Updated: March 2026</Updated>
        </HeroInner>
      </Hero>
      <Content>
        <Inner>
          <H2>1. Introduction</H2>
          <P>
            BlueSignal LTD ("we", "us", "our") operates waterquality.trading, cloud.bluesignal.xyz,
            and bluesignal.xyz. This Privacy Policy describes how we collect, use, store, and
            protect your personal information when you use our platforms and services.
          </P>

          <H2>2. Information We Collect</H2>
          <P>
            <strong>Account Information:</strong> Name, email address, company or organization name,
            role selection (buyer, seller, utility, verifier), wallet address, and authentication
            credentials managed through Firebase Authentication.
          </P>
          <P>
            <strong>Device and Monitoring Data:</strong> Water production volume from inline flow
            sensors; water quality measurements from BlueSignal WQM-1 devices including pH, TDS,
            turbidity, ORP, and temperature; device status and connectivity data; GPS coordinates
            and geographic boundaries of monitoring sites.
          </P>
          <P>
            <strong>Transaction Data:</strong> Credit purchase and sale history, credit type and
            quantity, listing details, rebate calculations and settlement records, payout history,
            and payment information processed through third-party providers.
          </P>
          <P>
            <strong>Usage Data:</strong> Pages visited, features used, search queries, browser and
            device type, operating system, referral source, IP address, and approximate geographic
            location.
          </P>
          <P>
            <strong>Cookies and Local Storage:</strong> Firebase session cookies for authentication,
            session storage for user state persistence, and analytics cookies if enabled for
            Platform improvement. We do not use third-party advertising cookies or tracking pixels.
          </P>

          <H2>3. How We Use Your Information</H2>
          <P>
            We use your information to: operate and maintain the Platform and your account; process
            credit transactions, calculate rebates, and facilitate settlements; verify water
            production and quality data through our three-layer verification system; generate,
            validate, and issue nutrient credits (AWG credits); communicate about your account,
            transactions, and Platform updates; improve Platform functionality, reliability, and
            user experience; comply with legal and regulatory obligations; detect, prevent, and
            investigate fraud, unauthorized access, or other prohibited activities.
          </P>

          <H2>4. How We Share Your Information</H2>
          <P>
            We do not sell your personal information. We may share data with the following
            categories of recipients:
          </P>
          <P>
            <strong>Utilities and Municipalities:</strong> Aggregated production and credit data
            necessary for rebate program administration. Personal information is not shared without
            your consent.
          </P>
          <P>
            <strong>Verification Partners:</strong> Site location, device data, and monitoring
            records required for independent third-party verification and laboratory analysis.
          </P>
          <P>
            <strong>Service Providers:</strong> Firebase (Google) for infrastructure, Cloudflare for
            CDN and security, Mapbox for geographic services, Alchemy for blockchain infrastructure,
            and payment processors for transaction settlement.
          </P>
          <P>
            <strong>Legal Requirements:</strong> When required by law, court order, subpoena, or
            government request, or to protect the rights, safety, or property of BlueSignal, our
            users, or the public.
          </P>

          <H2>5. Data Security</H2>
          <P>
            We implement industry-standard security measures including: encryption of all data in
            transit using TLS 1.2+; encryption of data at rest through Firebase and cloud provider
            encryption; authentication managed through Firebase with secure token-based sessions;
            role-based access controls limiting data access to authorized personnel; regular
            security assessments and vulnerability reviews; monitoring for unauthorized access
            attempts.
          </P>

          <H2>6. Data Retention</H2>
          <P>
            We retain your data according to the following schedule: account data is retained for
            the life of your account plus three (3) years after deletion; transaction records are
            retained for seven (7) years to meet regulatory and audit requirements; monitoring and
            device data is retained for the verification period plus two (2) years; usage and
            analytics data is retained for twenty-four (24) months in anonymized form. You may
            request deletion of your personal data at any time, subject to our legal retention
            obligations.
          </P>

          <H2>7. Third-Party Services</H2>
          <P>
            The Platform integrates with the following third-party services, each subject to their
            own privacy policies: Firebase (Google) for authentication, real-time database, and
            hosting; Cloudflare for CDN, DDoS protection, and edge optimization; Mapbox for
            interactive map rendering and geographic data; Alchemy for blockchain RPC access on
            Polygon network; Stripe for payment processing (when enabled); Livepeer for video upload
            and streaming services.
          </P>

          <H2>8. Your Rights</H2>
          <P>
            Depending on your jurisdiction (including rights under CCPA, GDPR, and other applicable
            laws), you may have the right to: access the personal information we hold about you;
            correct inaccurate or incomplete information; request deletion of your personal data;
            export your data in a portable, machine-readable format; opt out of certain data
            processing activities; withdraw consent where processing is based on consent; lodge a
            complaint with a supervisory authority. To exercise any of these rights, contact us via
            our{' '}
            <a href="/contact" style={{ color: '#0052CC' }}>
              Contact page
            </a>{' '}
            or email privacy@bluesignal.xyz. We will respond within thirty (30) days.
          </P>

          <H2>9. Children's Privacy</H2>
          <P>
            The Platform is not intended for individuals under 18 years of age. We do not knowingly
            collect personal information from children. If we become aware that we have
            inadvertently collected data from a minor, we will promptly delete it.
          </P>

          <H2>10. International Transfers</H2>
          <P>
            Your data may be processed and stored in the United States and other countries where our
            service providers operate. By using the Platform, you consent to the transfer of your
            information to these jurisdictions, which may have different data protection standards
            than your country of residence.
          </P>

          <H2>11. Changes to This Policy</H2>
          <P>
            We may update this Privacy Policy periodically to reflect changes in our practices,
            services, or legal requirements. Material changes will be communicated through the
            Platform or via email at least thirty (30) days before they take effect. The "Last
            Updated" date at the top of this page indicates when the most recent revision was made.
          </P>

          <H2>12. Contact</H2>
          <P>
            For privacy questions or to exercise your data rights, visit our{' '}
            <a href="/contact" style={{ color: '#0052CC' }}>
              Contact page
            </a>{' '}
            or email us at privacy@bluesignal.xyz.
          </P>
        </Inner>
      </Content>
    </Page>
  );
}
