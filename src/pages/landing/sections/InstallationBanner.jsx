import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';
import { trackCTA } from '../utils/analytics';

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 20px;
  padding: 56px 48px;

  ${({ theme }) => theme.media.md} {
    padding: 32px 20px;
    border-radius: 16px;
  }
`;

const Inner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  ${({ theme }) => theme.media.md} {
    gap: 24px;
  }
`;

const Content = styled.div``;

const Desc = styled.p`
  font-size: clamp(14px, 1.4vw, 17px);
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.w50};
  max-width: 520px;
  margin-bottom: 24px;
`;

const StateTags = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const StateTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 100px;
  white-space: nowrap;

  ${({ $available, theme }) => $available ? `
    color: ${theme.colors.green};
    background: ${theme.colors.greenDim};
    border: 1px solid rgba(52,211,153,0.25);
  ` : `
    color: ${theme.colors.w30};
    background: ${theme.colors.w04};
    border: 1px solid ${theme.colors.w08};
  `}
`;

const StateDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $available, theme }) => $available ? theme.colors.green : theme.colors.w30};
  ${({ $available }) => $available && 'animation: pulse 2s ease-in-out infinite;'}
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 14px 28px;
  border-radius: 100px;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 0 24px rgba(255,255,255,0.15);
  }

  ${({ theme }) => theme.media.sm} {
    width: 100%;
  }
`;

const InstallationBanner = () => (
  <Section id="installation">
    <Container>
      <RevealOnScroll>
        <Banner>
          <Inner>
            <Content>
              <SectionLabel>Professional Installation</SectionLabel>
              <SectionTitle>We install it for&nbsp;you.</SectionTitle>
              <Desc>
                Full-service installation for commercial and residential sites.
                Site survey, mounting, probe calibration, LoRa gateway setup, and
                cloud dashboard configuration — all included in one&nbsp;visit.
              </Desc>
              <StateTags>
                <StateTag $available>
                  <StateDot $available />
                  Texas — Available Now
                </StateTag>
                <StateTag>
                  <StateDot />
                  Florida — Coming Soon
                </StateTag>
              </StateTags>
            </Content>
            <CTAButton
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                trackCTA('request_install_quote', 'Installation Banner');
                window.dispatchEvent(new CustomEvent('prefill-inquiry', { detail: 'quote' }));
                const section = document.getElementById('order');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Request Installation Quote
            </CTAButton>
          </Inner>
        </Banner>
      </RevealOnScroll>
    </Container>
  </Section>
);

export default InstallationBanner;
