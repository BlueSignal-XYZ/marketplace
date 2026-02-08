import styled from 'styled-components';
import { Container, Section } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const Wrapper = styled.div`
  text-align: center;
  position: relative;
  padding: 40px 0;
`;

const BlueGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 500px;
  background: ${({ theme }) => theme.colors.blueGlow};
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  pointer-events: none;

  ${({ theme }) => theme.media.md} {
    width: 100%;
    max-width: 400px;
    height: 300px;
    filter: blur(60px);
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(32px, 4.5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 20px;
  position: relative;
  text-wrap: balance;
`;

const Desc = styled.p`
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.w50};
  max-width: 520px;
  margin: 0 auto 36px;
  position: relative;
`;

const CTARow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;

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

const Note = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.w30};
  position: relative;
`;

const CTASection = () => (
  <Section id="order">
    <Container>
      <RevealOnScroll>
        <Wrapper>
          <BlueGlow />
          <Title>Start monitoring water quality&nbsp;today.</Title>
          <Desc>
            The dev kit includes the WQM-1 HAT, Pi Zero 2W, pH and TDS probes,
            waterproof temperature sensor, LoRa antenna, and power&nbsp;supply.
          </Desc>
          <CTARow>
            <PrimaryBtn href="mailto:hello@bluesignal.xyz?subject=Order%20Dev%20Kit">
              Order Dev Kit — $349
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PrimaryBtn>
            <SecondaryBtn href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener noreferrer">
              Try the Dashboard
            </SecondaryBtn>
          </CTARow>
          <Note>Ships Q2 2026 &middot; Free shipping in the US &middot; Volume pricing&nbsp;available</Note>
        </Wrapper>
      </RevealOnScroll>
    </Container>
  </Section>
);

export default CTASection;
