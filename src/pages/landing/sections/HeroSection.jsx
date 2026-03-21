import styled from 'styled-components';
import { Container } from '../styles/typography';
import SystemScene from '../components/SystemScene';
import { trackCTA } from '../utils/analytics';

const HeroWrapper = styled.section`
  padding-top: 140px;
  padding-bottom: 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  ${({ theme }) => theme.media.md} {
    padding-top: 110px;
  }

  ${({ theme }) => theme.media.sm} {
    padding-top: 100px;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.green};
  background: ${({ theme }) => theme.colors.greenDim};
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 32px;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.1s both;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 24px;
  }
`;

const PulseDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.green};
  animation: pulse 2s ease-in-out infinite;
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(36px, 5.6vw, 72px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.white};
  max-width: 18ch;
  margin: 0 auto 24px;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.25s both;
  text-wrap: balance;
`;

const GradientWord = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.blue},
    ${({ theme }) => theme.colors.blueB},
    ${({ theme }) => theme.colors.green}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subhead = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(15px, 1.6vw, 19px);
  font-weight: 400;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.w50};
  max-width: 540px;
  margin: 0 auto 40px;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.4s both;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 32px;
  }
`;

const CTARow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 72px;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.55s both;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 32px;
  }

  ${({ theme }) => theme.media.sm} {
    flex-direction: column;
    width: 100%;
    padding: 0 16px;
  }
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 14px 28px;
  border-radius: 100px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 0 24px rgba(255,255,255,0.15);
  }

  ${({ theme }) => theme.media.sm} {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.w70};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.w15};
  padding: 14px 28px;
  border-radius: 100px;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.w30};
    color: ${({ theme }) => theme.colors.white};
  }

  ${({ theme }) => theme.media.sm} {
    width: 100%;
    justify-content: center;
  }
`;

const SceneWrapper = styled.div`
  position: relative;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.6s both;

  ${({ theme }) => theme.media.md} {
    display: none;
  }
`;

const SceneFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.bg});
  pointer-events: none;
  z-index: 1;
`;

/* ── Mobile Hero Visualization ────────────────────────────────── */
const MobileVizWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.media.md} {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    width: 100%;
    max-width: 280px;
    margin: 0 auto 48px;
    animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.6s both;
  }
`;

const MobileStage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $highlight }) => $highlight ? 'rgba(52,211,153,0.3)' : theme.colors.w08};
  border-radius: 12px;
  padding: 12px 16px;
  position: relative;
`;

const MobileStageIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg || 'rgba(45,140,240,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileStageText = styled.div`
  min-width: 0;
`;

const MobileStageName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.3;
`;

const MobileStageDetail = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.w50};
  margin-top: 2px;
`;

const MobileConnector = styled.div`
  display: flex;
  justify-content: center;
  height: 20px;
  position: relative;

  &::before {
    content: '';
    width: 1.5px;
    height: 100%;
    background: ${({ theme }) => theme.colors.blue};
    opacity: 0.4;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    border-left: 1.5px solid ${({ theme }) => theme.colors.blue};
    border-bottom: 1.5px solid ${({ theme }) => theme.colors.blue};
    transform: translateX(-50%) rotate(-45deg);
    opacity: 0.4;
  }
`;

const PulseDotMobile = styled.span`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.green};
  animation: pulse 2s ease-in-out infinite;
`;

const MobileHeroViz = () => (
  <MobileVizWrapper>
    <MobileStage>
      <MobileStageIcon $bg="rgba(45,140,240,0.1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="#2d8cf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
      </MobileStageIcon>
      <MobileStageText>
        <MobileStageName>Water Generation</MobileStageName>
        <MobileStageDetail>AWG &middot; Atmospheric Water Generator</MobileStageDetail>
      </MobileStageText>
    </MobileStage>

    <MobileConnector />

    <MobileStage $highlight>
      <MobileStageIcon $bg="rgba(52,211,153,0.12)">
        <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="13" y2="13" />
        </svg>
      </MobileStageIcon>
      <MobileStageText>
        <MobileStageName>BlueSignal WQM-1</MobileStageName>
        <MobileStageDetail>Monitors &middot; Verifies &middot; Reports</MobileStageDetail>
      </MobileStageText>
      <PulseDotMobile />
    </MobileStage>

    <MobileConnector />

    <MobileStage>
      <MobileStageIcon $bg="rgba(45,140,240,0.1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="#5badff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" />
        </svg>
      </MobileStageIcon>
      <MobileStageText>
        <MobileStageName>Credits &amp; Rebates</MobileStageName>
        <MobileStageDetail>waterquality.trading &middot; Municipal Rebates</MobileStageDetail>
      </MobileStageText>
    </MobileStage>
  </MobileVizWrapper>
);

const SpecsBar = styled.div`
  background: ${({ theme }) => theme.colors.w04};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 16px;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 900px;
  margin: 48px auto 0;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.9s both;

  ${({ theme }) => theme.media.md} {
    gap: 24px;
    padding: 16px 20px;
    flex-wrap: wrap;
    margin-top: 0;
  }

  ${({ theme }) => theme.media.sm} {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 20px 24px;
  }
`;

const SpecItem = styled.div`
  text-align: center;

  ${({ theme }) => theme.media.sm} {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }
`;

const SpecLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 4px;

  ${({ theme }) => theme.media.sm} {
    margin-bottom: 0;
    min-width: 60px;
  }
`;

const SpecVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.w70};
  white-space: nowrap;
`;

const HeroSection = () => (
  <HeroWrapper id="top">
    <Container>
      <Badge>
        <PulseDot />
        Municipal Rebate Infrastructure&ensp;&middot;&ensp;Verified Credits
      </Badge>

      <Headline>
        Where Clean Water Becomes&nbsp;<GradientWord>Revenue.</GradientWord>
      </Headline>

      <Subhead>
        BlueSignal is the sensor infrastructure behind municipal water quality rebate programs.
        From atmospheric water generation to verified credits on waterquality.trading — we connect
        your property to the&nbsp;marketplace.
      </Subhead>

      <CTARow>
        <PrimaryBtn href="#order" onClick={() => trackCTA('schedule_consultation', 'Hero CTA')}>
          Join a Rebate Program
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </PrimaryBtn>
        <SecondaryBtn href="#how-it-works" onClick={() => trackCTA('how_it_works', 'Hero')}>How It Works</SecondaryBtn>
      </CTARow>

      <SceneWrapper>
        <SystemScene />
        <SceneFade />
      </SceneWrapper>

      <MobileHeroViz />

      <SpecsBar>
        <SpecItem>
          <SpecLabel>Monitor</SpecLabel>
          <SpecVal>6 Sensors &middot; Real-time</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Verify</SpecLabel>
          <SpecVal>Blockchain &middot; Immutable</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Trade</SpecLabel>
          <SpecVal>Nutrient Credits &middot; WQT</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Rebate</SpecLabel>
          <SpecVal>Municipal &middot; Automated</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Connect</SpecLabel>
          <SpecVal>LoRa &middot; 15&nbsp;km Range</SpecVal>
        </SpecItem>
      </SpecsBar>
    </Container>
  </HeroWrapper>
);

export default HeroSection;
