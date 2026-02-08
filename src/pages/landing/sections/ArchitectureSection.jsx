import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle, SectionDesc } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const SectionHeader = styled.div`
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: 1fr;
  }
`;

/* Terminal */
const Terminal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
`;

const TermBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.w08};
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const TermTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.w30};
  margin-left: 8px;
`;

const TermBody = styled.pre`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  line-height: 1.8;
  padding: 24px;
  overflow-x: auto;
  color: ${({ theme }) => theme.colors.w50};

  .n { color: ${({ theme }) => theme.colors.white}; font-weight: 600; }
  .a { color: ${({ theme }) => theme.colors.blue}; }
  .g { color: ${({ theme }) => theme.colors.green}; }
  .d { color: ${({ theme }) => theme.colors.w30}; }
  .y { color: ${({ theme }) => theme.colors.amber}; }

  ${({ theme }) => theme.media.md} {
    font-size: 12px;
    padding: 16px;
    line-height: 1.7;
  }
`;

/* Feature cards */
const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  /* Unified corner radius on children (RevealOnScroll wrappers) */
  > :first-child { border-radius: 16px 16px 0 0; overflow: hidden; }
  > :last-child { border-radius: 0 0 16px 16px; overflow: hidden; }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 28px 32px;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }

  ${({ theme }) => theme.media.md} {
    padding: 24px;
  }
`;

const FeatureTag = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.blueB};
  margin-bottom: 8px;
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 6px;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.w50};
`;

const features = [
  {
    tag: 'Storage',
    title: 'Offline-First SQLite Buffer',
    desc: 'WAL-mode database stores readings locally during connectivity loss. Automatic sync when LoRa link\u00a0restores.',
  },
  {
    tag: 'Radio',
    title: 'LoRaWAN Class A',
    desc: 'SX1262 transceiver with 15\u00a0km line-of-sight range. Cayenne LPP payload encoding with AES-128\u00a0encryption.',
  },
  {
    tag: 'Control',
    title: 'Relay Output',
    desc: '10\u00a0A relay for pumps, valves, and dosing systems. Triggered by threshold rules or cloud\u00a0commands.',
  },
  {
    tag: 'Expansion',
    title: 'I\u00b2C Expansion Bus',
    desc: 'Exposed I\u00b2C header for additional sensors — barometric pressure, dissolved oxygen, or custom\u00a0probes.',
  },
];

const ArchitectureSection = () => (
  <Section id="architecture">
    <Container>
      <SectionHeader>
        <RevealOnScroll>
          <SectionLabel>Architecture</SectionLabel>
          <SectionTitle>From probe to&nbsp;dashboard.</SectionTitle>
          <SectionDesc>
            The WQM-1 captures sensor data, buffers it locally, and transmits over LoRaWAN to
            BlueSignal Cloud. Threshold alerts and relay control close the&nbsp;loop.
          </SectionDesc>
        </RevealOnScroll>
      </SectionHeader>

      <Grid>
        <RevealOnScroll>
          <Terminal>
            <TermBar>
              <Dot color="#ff5f57" />
              <Dot color="#febc2e" />
              <Dot color="#28c840" />
              <TermTitle>bluesignal-wqm — pipeline</TermTitle>
            </TermBar>
            <TermBody>{`  `}<span className="n">SENSORS</span>
{`    `}<span className="d">pH · TDS · Turbidity · ORP · Temp · GPS</span>
{`    `}<span className="a">│</span>
{`    `}<span className="a">▼</span>
{`  `}<span className="n">Pi Zero 2W</span>
{`    `}<span className="d">ADS1115 16-bit ADC · SQLite WAL buffer</span>
{`    `}<span className="a">│</span>
{`    `}<span className="a">▼</span>
{`  `}<span className="n">SX1262 LoRa Radio</span>
{`    `}<span className="y">Cayenne LPP</span><span className="d"> · AES-128 · 15 km range</span>
{`    `}<span className="a">│</span>
{`    `}<span className="a">▼</span>
{`  `}<span className="g">BlueSignal Cloud</span>
{`    `}<span className="d">Ingest · Store · Alert · Dashboard</span>
{`    `}<span className="a">├──▶</span>{` `}<span className="n">Dashboard</span>{` `}<span className="d">cloud.bluesignal.xyz</span>
{`    `}<span className="a">└──▶</span>{` `}<span className="n">WQT Registry</span>{` `}<span className="d">waterquality.trading</span></TermBody>
          </Terminal>
        </RevealOnScroll>

        <Cards>
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 0.08}>
              <FeatureCard>
                <FeatureTag>{f.tag}</FeatureTag>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            </RevealOnScroll>
          ))}
        </Cards>
      </Grid>
    </Container>
  </Section>
);

export default ArchitectureSection;
