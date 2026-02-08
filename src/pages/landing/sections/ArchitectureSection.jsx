import { useState } from 'react';
import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle, SectionDesc } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const SectionHeader = styled.div`
  margin-bottom: 48px;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 32px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: start;

  ${({ theme }) => theme.media.md} {
    gap: 24px;
    /* Prevent <pre> intrinsic width from blowing out the grid */
    overflow: hidden;
  }
`;

/* Terminal */
const Terminal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  max-width: 100%;
  min-width: 0;
`;

const TermBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.w08};

  ${({ theme }) => theme.media.sm} {
    padding: 10px 14px;
    gap: 6px;
  }
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};

  ${({ theme }) => theme.media.sm} {
    width: 10px;
    height: 10px;
  }
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
  min-width: 0;

  .n { color: ${({ theme }) => theme.colors.white}; font-weight: 600; }
  .a { color: ${({ theme }) => theme.colors.blue}; }
  .g { color: ${({ theme }) => theme.colors.green}; }
  .d { color: ${({ theme }) => theme.colors.w30}; }
  .y { color: ${({ theme }) => theme.colors.amber}; }

  ${({ theme }) => theme.media.md} {
    display: none;
  }
`;

/* ---- Mobile Pipeline Accordion ---- */

const PIPELINE_STAGES = [
  { icon: '\u{1F4E1}', name: 'Sensor Probes', details: ['pH, TDS, Turbidity, ORP, Temp', 'DS18B20, BNC, JST-XH connectors'] },
  { icon: '\u{1F527}', name: 'Pi Zero 2W', details: ['ADS1115 16-bit ADC', 'SQLite WAL local buffer'] },
  { icon: '\u{1F4FB}', name: 'SX1262 LoRa Radio', details: ['Cayenne LPP encoding', 'AES-128 encryption, 15\u00a0km range'] },
  { icon: '\u2601\uFE0F', name: 'BlueSignal Cloud', details: ['Data ingestion & storage', 'API endpoints & alert engine'] },
  { icon: '\u{1F4CA}', name: 'Dashboard', details: ['Real-time sensor readings', 'Trend charts & data export'] },
];

const MobilePipelineWrap = styled.div`
  display: none;

  ${({ theme }) => theme.media.md} {
    display: block;
    padding: 12px;
  }

  ${({ theme }) => theme.media.sm} {
    padding: 10px;
  }
`;

const PipelineStage = styled.div`
  margin-left: ${({ $index }) => Math.min($index * 10, 40)}px;
`;

const StageHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  background: ${({ theme, $active }) => ($active ? theme.colors.surface2 : 'transparent')};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.w15 : theme.colors.w08)};
  border-radius: ${({ $active }) => ($active ? '10px 10px 0 0' : '10px')};
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, border-radius 0.15s;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;

const StageIcon = styled.span`
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
`;

const StageName = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: left;
`;

const StageChevron = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.w30};
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 0.25s ease;
`;

const StageBody = styled.div`
  max-height: ${({ $open }) => ($open ? '160px' : '0')};
  overflow: hidden;
  transition: max-height 0.25s ease, border-color 0.25s ease;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $open, theme }) => ($open ? theme.colors.w15 : 'transparent')};
  border-top: none;
  border-radius: 0 0 10px 10px;
`;

const StageBodyInner = styled.div`
  padding: 6px 14px 12px;
`;

const DetailLine = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.w50};
  line-height: 1.7;
`;

const StageConnector = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  margin-left: ${({ $index }) => Math.min($index * 10, 40) + 20}px;
  color: ${({ theme }) => theme.colors.blue};
  opacity: 0.5;
  font-size: 12px;
`;

const MobilePipeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const toggle = (i) => setActiveIndex((prev) => (prev === i ? -1 : i));

  return (
    <MobilePipelineWrap>
      {PIPELINE_STAGES.map((stage, i) => (
        <div key={stage.name}>
          <PipelineStage $index={i}>
            <StageHeader $active={activeIndex === i} onClick={() => toggle(i)} aria-expanded={activeIndex === i}>
              <StageIcon>{stage.icon}</StageIcon>
              <StageName>{stage.name}</StageName>
              <StageChevron $open={activeIndex === i}>{'\u25BE'}</StageChevron>
            </StageHeader>
            <StageBody $open={activeIndex === i}>
              <StageBodyInner>
                {stage.details.map((d) => (
                  <DetailLine key={d}>{d}</DetailLine>
                ))}
              </StageBodyInner>
            </StageBody>
          </PipelineStage>
          {i < PIPELINE_STAGES.length - 1 && (
            <StageConnector $index={i}>{'\u25BC'}</StageConnector>
          )}
        </div>
      ))}
    </MobilePipelineWrap>
  );
};

/* Feature cards */
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  min-width: 0;

  /* Unified corner radius on children (RevealOnScroll wrappers) */
  > :first-child { border-radius: 16px 0 0 16px; overflow: hidden; }
  > :last-child { border-radius: 0 16px 16px 0; overflow: hidden; }

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: repeat(2, 1fr);

    > :first-child { border-radius: 16px 0 0 0; overflow: hidden; }
    > :nth-child(2) { border-radius: 0 16px 0 0; overflow: hidden; }
    > :nth-child(3) { border-radius: 0 0 0 16px; overflow: hidden; }
    > :last-child { border-radius: 0 0 16px 0; overflow: hidden; }
  }

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: 1fr;

    > :first-child { border-radius: 16px 16px 0 0; overflow: hidden; }
    > :nth-child(2), > :nth-child(3) { border-radius: 0; overflow: hidden; }
    > :last-child { border-radius: 0 0 16px 16px; overflow: hidden; }
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 28px 32px;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }

  ${({ theme }) => theme.media.md} {
    padding: 20px;
  }

  ${({ theme }) => theme.media.sm} {
    padding: 16px;
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
{`    `}<span className="a">└──▶</span>{` `}<span className="n">Credit Registry</span></TermBody>
            <MobilePipeline />
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
