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
  max-width: 14ch;
  margin: 0 auto 24px;
  animation: fadeUp 0.9s ${({ theme }) => theme.ease} 0.25s both;
  text-wrap: balance;
`;

const GradientWord = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.algae},
    ${({ theme }) => theme.colors.algaeLight},
    ${({ theme }) => theme.colors.algaeDark}
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

const SpecsBar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
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
        Raspberry Pi HAT&ensp;&middot;&ensp;Open Platform
      </Badge>

      <Headline>
        Monitor. Detect.<br /><GradientWord>Control.</GradientWord>
      </Headline>

      <Subhead>
        Continuous water quality monitoring for tanks, ponds, and treatment systems.
        Detect contamination and algae before they start — then automate the&nbsp;response.
      </Subhead>

      <CTARow>
        <PrimaryBtn href="#order" onClick={() => trackCTA('order_devkit_hero', 'Hero CTA')}>
          Order Dev Kit — $499
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </PrimaryBtn>
        <SecondaryBtn href="#specs" onClick={() => trackCTA('view_specs', 'Hero Specs')}>Full Specifications</SecondaryBtn>
      </CTARow>

      <SceneWrapper>
        <SystemScene />
        <SceneFade />
      </SceneWrapper>

      <SpecsBar>
        <SpecItem>
          <SpecLabel>Sensors</SpecLabel>
          <SpecVal>6-Channel &middot; 16-bit</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Radio</SpecLabel>
          <SpecVal>SX1262 &middot; 15&nbsp;km</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Power</SpecLabel>
          <SpecVal>9 – 24&nbsp;V&nbsp;DC</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Storage</SpecLabel>
          <SpecVal>SQLite WAL</SpecVal>
        </SpecItem>
        <SpecItem>
          <SpecLabel>Control</SpecLabel>
          <SpecVal>Relay &middot; 10&nbsp;A</SpecVal>
        </SpecItem>
      </SpecsBar>
    </Container>
  </HeroWrapper>
);

export default HeroSection;
