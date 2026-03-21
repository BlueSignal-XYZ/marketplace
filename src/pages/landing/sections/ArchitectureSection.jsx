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
  overflow: hidden;
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
      <TabLabel>bluesignal {'\u2014'} rebate pipeline</TabLabel>
    </TermBar>

    <CodeScroll>
      <CodeTable>
        <L n={1}><Cm># Water Quality → Credits → Rebates</Cm></L>
        <L n={2} />
        <L n={3}><Ky>source</Ky>:</L>
        <L n={4}>{'  '}<Ky>type</Ky>:{' '}<St>Atmospheric Water Generator</St></L>
        <L n={5}>{'  '}<Ky>output</Ky>:{' '}<St>12 gal/day</St>{'       '}<Cm># potable water</Cm></L>
        <L n={6} />
        <L n={7}><Ky>monitor</Ky>:</L>
        <L n={8}>{'  '}<Ky>device</Ky>:{' '}<St>BlueSignal WQM-1</St></L>
        <L n={9}>{'  '}<Ky>sensors</Ky>:</L>
        <L n={10}>{'    '}<Ds>-</Ds>{' '}<St>pH</St>{', '}<St>TDS</St>{', '}<St>turbidity</St>{', '}<St>ORP</St>{', '}<St>temp</St>{', '}<St>GPS</St></L>
        <L n={11}>{'  '}<Ky>uplink</Ky>:{' '}<St>LoRaWAN 15km</St>{'     '}<Cm># encrypted</Cm></L>
        <L n={12} />
        <L n={13}><Ky>verify</Ky>:</L>
        <L n={14}>{'  '}<Ky>chain</Ky>:{' '}<St>Polygon</St></L>
        <L n={15}>{'  '}<Ky>proof</Ky>:{' '}<St>immutable hash per reading</St></L>
        <L n={16} />
        <L n={17}><Ky>pipeline</Ky>:</L>
        <L n={18}>{'  '}<St>sensor</St>{' '}<Ar>→</Ar>{' '}<St>verify</St>{' '}<Ar>→</Ar>{' '}<St>credit</St>{' '}<Ar>→</Ar>{' '}<St>rebate</St></L>
        <L n={19}>{'  '}<Ky>dashboard</Ky>:{' '}<St>cloud.bluesignal.xyz</St></L>
        <L n={20}>{'  '}<Ky>marketplace</Ky>:{' '}<St>waterquality.trading</St></L>
        <L n={21} />
        <L n={22}><Ky>rebate</Ky>:</L>
        <L n={23}>{'  '}<Ky>program</Ky>:{' '}<St>Municipal Water Quality</St></L>
        <L n={24}>{'  '}<Ky>status</Ky>:{' '}<St>enrolled</St>{'           '}<Cm># auto-verified</Cm></L>
        <L n={25}>{'  '}<Ky>credits_earned</Ky>:{' '}<St>24 this month</St><Cursor /></L>
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
  padding: 32px;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }

  ${({ theme }) => theme.media.md} {
    padding: 24px;
  }

  ${({ theme }) => theme.media.sm} {
    padding: 20px;
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
    tag: 'Monitor',
    title: '6-Channel Sensor Array',
    desc: 'pH, TDS, turbidity, ORP, temperature, and GPS. Continuous readings from your AWG or water\u00a0system.',
  },
  {
    tag: 'Verify',
    title: 'Blockchain Verification',
    desc: 'Every reading is hashed and recorded on Polygon. Immutable proof that your water quality meets program\u00a0standards.',
  },
  {
    tag: 'Trade',
    title: 'Nutrient Credit Generation',
    desc: 'Verified data automatically becomes tradeable credits on waterquality.trading. No manual\u00a0reporting.',
  },
  {
    tag: 'Rebate',
    title: 'Automated Municipal Rebates',
    desc: 'Your municipality\u2019s rebate program processes credits automatically. Rebates flow back to your\u00a0account.',
  },
];

/* ── Main section ───────────────────────────────────────── */

const ArchitectureSection = () => (
  <Section id="how-it-works">
    <Container>
      <SectionHeader>
        <RevealOnScroll>
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>From sensor to&nbsp;rebate.</SectionTitle>
          <SectionDesc>
            The WQM-1 monitors water quality from your AWG or existing water system,
            verifies data on-chain, and generates nutrient credits on waterquality.trading.
            Your municipality processes the rebate&nbsp;automatically.
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
