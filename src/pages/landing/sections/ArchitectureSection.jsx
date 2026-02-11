import styled, { keyframes } from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle, SectionDesc } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

/* ── Section layout ─────────────────────────────────────── */

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
  overflow: hidden;

  ${({ theme }) => theme.media.md} {
    gap: 24px;
  }
`;

/* ── IDE Terminal chrome ────────────────────────────────── */

const Terminal = styled.div`
  background: #0D1117;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45),
              0 0 0 1px rgba(255,255,255,0.03);
  max-width: 100%;
  min-width: 0;
`;

const TermBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #161B22;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  ${({ theme }) => theme.media.sm} {
    padding: 10px 14px;
  }
`;

const DotsGroup = styled.div`
  display: flex;
  gap: 7px;
  flex-shrink: 0;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $c }) => $c};

  ${({ theme }) => theme.media.sm} {
    width: 10px;
    height: 10px;
  }
`;

const TabLabel = styled.span`
  margin-left: 14px;
  padding: 4px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;

  ${({ theme }) => theme.media.sm} {
    font-size: 11px;
    margin-left: 10px;
    padding: 3px 8px;
  }
`;

/* ── Code area with line-number gutter ──────────────────── */

const CodeScroll = styled.div`
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.12) transparent;

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.12);
    border-radius: 3px;
  }
`;

const CodeTable = styled.div`
  display: table;
  min-width: 540px;
  width: 100%;
  padding: 16px 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(12px, 1.05vw, 14px);
  line-height: 1.75;
`;

const Row = styled.div`
  display: table-row;
`;

const Gutter = styled.span`
  display: table-cell;
  width: 48px;
  padding: 0 14px 0 20px;
  text-align: right;
  user-select: none;
  color: rgba(139,148,158,0.35);
  font-size: 0.85em;
  vertical-align: top;
  border-right: 1px solid rgba(255,255,255,0.06);

  ${({ theme }) => theme.media.sm} {
    padding: 0 10px 0 12px;
  }
`;

const Code = styled.span`
  display: table-cell;
  padding-left: 16px;
  padding-right: 24px;
  white-space: pre;
  color: rgba(255,255,255,0.5);

  ${({ theme }) => theme.media.sm} {
    padding-left: 12px;
    padding-right: 14px;
  }
`;

/* ── Syntax-highlight tokens ────────────────────────────── */

const Cm = styled.span`color: #6A9955;`;                        /* comments  */
const Ky = styled.span`color: #9CDCFE;`;                        /* keys      */
const St = styled.span`color: #CE9178;`;                        /* strings   */
const Ar = styled.span`color: #4EC9B0;`;                        /* arrows →  */
const Ds = styled.span`color: rgba(255,255,255,0.7);`;          /* dashes -  */

/* ── Blinking cursor ────────────────────────────────────── */

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 1.15em;
  background: rgba(255,255,255,0.45);
  vertical-align: text-bottom;
  margin-left: 2px;
  animation: ${blink} 1.1s step-end infinite;
`;

/* ── Line helper ────────────────────────────────────────── */

const L = ({ n, children }) => (
  <Row>
    <Gutter>{String(n).padStart(2, '0')}</Gutter>
    <Code>{children ?? '\u00A0'}</Code>
  </Row>
);

/* ── Pipeline terminal content ──────────────────────────── */

const PipelineTerminal = () => (
  <Terminal>
    <TermBar>
      <DotsGroup>
        <Dot $c="#ff5f57" />
        <Dot $c="#febc2e" />
        <Dot $c="#28c840" />
      </DotsGroup>
      <TabLabel>bluesignal-wqm {'\u2014'} pipeline</TabLabel>
    </TermBar>

    <CodeScroll>
      <CodeTable>
        <L n={1}><Cm># WQM-1 Data Pipeline</Cm></L>
        <L n={2} />
        <L n={3}><Ky>sensors</Ky>:</L>
        <L n={4}>{'  '}<Ds>-</Ds>{' '}<St>pH</St>{'          '}<Cm># BNC analog → ADS1115</Cm></L>
        <L n={5}>{'  '}<Ds>-</Ds>{' '}<St>TDS</St>{'         '}<Cm># JST-XH analog → ADS1115</Cm></L>
        <L n={6}>{'  '}<Ds>-</Ds>{' '}<St>turbidity</St>{'   '}<Cm># JST-XH analog → ADS1115</Cm></L>
        <L n={7}>{'  '}<Ds>-</Ds>{' '}<St>ORP</St>{'         '}<Cm># JST-XH analog → ADS1115</Cm></L>
        <L n={8}>{'  '}<Ds>-</Ds>{' '}<St>temperature</St>{' '}<Cm># DS18B20 OneWire</Cm></L>
        <L n={9}>{'  '}<Ds>-</Ds>{' '}<St>GPS</St>{'         '}<Cm># UART serial</Cm></L>
        <L n={10} />
        <L n={11}><Ky>processor</Ky>:</L>
        <L n={12}>{'  '}<Ky>board</Ky>:{' '}<St>Pi Zero 2W</St></L>
        <L n={13}>{'  '}<Ky>adc</Ky>:{' '}<St>ADS1115 16-bit</St></L>
        <L n={14}>{'  '}<Ky>storage</Ky>:{' '}<St>SQLite WAL buffer</St></L>
        <L n={15} />
        <L n={16}><Ky>radio</Ky>:</L>
        <L n={17}>{'  '}<Ky>module</Ky>:{' '}<St>SX1262 LoRa</St></L>
        <L n={18}>{'  '}<Ky>encoding</Ky>:{' '}<St>Cayenne LPP</St></L>
        <L n={19}>{'  '}<Ky>encryption</Ky>:{' '}<St>AES-128</St></L>
        <L n={20}>{'  '}<Ky>range</Ky>:{' '}<St>15 km line-of-sight</St></L>
        <L n={21} />
        <L n={22}><Ky>upstream</Ky>:</L>
        <L n={23}>{'  '}<St>ingest</St>{' '}<Ar>→</Ar>{' '}<St>store</St>{' '}<Ar>→</Ar>{' '}<St>alert</St>{' '}<Ar>→</Ar>{' '}<St>dashboard</St></L>
        <L n={24}>{'  '}<Ky>dashboard</Ky>:{'  '}<St>cloud.bluesignal.xyz</St></L>
        <L n={25}>{'  '}<Ky>registry</Ky>:{'   '}<St>waterquality.trading</St><Cursor /></L>
      </CodeTable>
    </CodeScroll>
  </Terminal>
);

/* ── Feature cards ──────────────────────────────────────── */

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  min-width: 0;

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
    desc: 'Exposed I\u00b2C header for additional sensors \u2014 barometric pressure, dissolved oxygen, or custom\u00a0probes.',
  },
];

/* ── Main section ───────────────────────────────────────── */

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
          <PipelineTerminal />
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
