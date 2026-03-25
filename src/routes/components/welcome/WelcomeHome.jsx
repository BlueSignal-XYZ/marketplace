import React from "react";
import styled from "styled-components";
import { getAppMode } from "../../../utils/modeDetection";
import BlueSignalLogo from "../../../components/shared/BlueSignalLogo";

// Inline SVG logo for WQT — crisp at any size (avoids pixelated raster logo)
const WQTLogoInline = ({ height = 36 }) => {
  const scale = height / 48;
  const width = 320 * scale;
  return (
    <svg width={width} height={height} viewBox="0 0 320 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M24 4C24 4 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 4 24 4Z" fill="#0F4C81"/>
        <path d="M16 30L20 26L24 32L28 24L32 28" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M20 34L23 37L29 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      <text x="50" y="32" fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="22" fill="#0F4C81">
        <tspan fontWeight="700">WaterQuality</tspan><tspan fontWeight="400" fill="#0EA5E9">.Trading</tspan>
      </text>
    </svg>
  );
};

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  text-align: left;
  margin-bottom: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  text-align: left;
  margin-bottom: 0;
`;

const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const FeatureTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ $isCloud }) => $isCloud ? "rgba(29, 112, 114, 0.08)" : "rgba(37, 99, 235, 0.08)"};
  color: ${({ $isCloud }) => $isCloud ? "#1D7072" : "#2563eb"};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

export const contentVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
};

export const StyledWelcomeHome = styled.div`
  position: relative;
  padding: 24px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    padding: 32px;
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    img {
      height: 36px;
      width: auto;
    }
  }

  .mode-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: ${({ $isCloud }) => $isCloud ? "#1D7072" : "#2563eb"};
    color: white;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const getDynamicWelcomeMessage = (username) => {
  const hours = new Date().getHours();
  let timeOfDay = "Day";
  if (hours < 12) {
    timeOfDay = "Morning";
  } else if (hours < 18) {
    timeOfDay = "Afternoon";
  } else {
    timeOfDay = "Evening";
  }
  return `Good ${timeOfDay}, ${username}`;
};

// Mode-specific content
const MODE_CONTENT = {
  cloud: {
    title: "BlueSignal Cloud",
    description: "Monitor your water quality sensors, manage sites, and track real-time data from anywhere.",
    features: ["Real-time Monitoring", "Device Management", "Alerts & Reports"],
  },
  marketplace: {
    title: "WaterQuality.Trading",
    description: "Buy and sell verified water quality credits. Connect with farmers, utilities, and environmental organizations.",
    features: ["Browse Credits", "Verified Sellers", "Secure Trading"],
  },
};

const WelcomeHome = ({ user, setCardState, enterDash }) => {
  const { username } = user || {};
  const mode = getAppMode();
  const isCloud = mode === 'cloud';
  const content = isCloud ? MODE_CONTENT.cloud : MODE_CONTENT.marketplace;

  return (
    <StyledWelcomeHome
      $isCloud={isCloud}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="logo-wrap">
        {isCloud ? (
          <BlueSignalLogo size={36} />
        ) : (
          <WQTLogoInline height={36} />
        )}
        <span className="mode-badge">
          {isCloud ? "Cloud" : "Marketplace"}
        </span>
      </div>

      <Title>
        {username ? getDynamicWelcomeMessage(username) : content.title}
      </Title>

      <Paragraph>{content.description}</Paragraph>

      {!username && (
        <FeatureList>
          {content.features.map((feature, idx) => (
            <FeatureTag key={idx} $isCloud={isCloud}>
              <span style={{ fontSize: 14 }}>✓</span>
              {feature}
            </FeatureTag>
          ))}
        </FeatureList>
      )}
    </StyledWelcomeHome>
  );
};

export default WelcomeHome;
