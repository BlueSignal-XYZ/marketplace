import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle, SectionDesc } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  ${SectionDesc} {
    margin-left: auto;
    margin-right: auto;
  }

  ${({ theme }) => theme.media.md} {
    margin-bottom: 32px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;

  /* Unified corner radius on grid children (RevealOnScroll wrappers) */
  > :nth-child(1) { border-radius: 16px 0 0 0; overflow: hidden; }
  > :nth-child(3) { border-radius: 0 16px 0 0; overflow: hidden; }
  > :nth-child(4) { border-radius: 0 0 0 16px; overflow: hidden; }
  > :nth-child(6) { border-radius: 0 0 16px 0; overflow: hidden; }

  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr;

    > :nth-child(1) { border-radius: 16px 16px 0 0; }
    > :nth-child(3), > :nth-child(4) { border-radius: 0; overflow: hidden; }
    > :nth-child(6) { border-radius: 0 0 16px 16px; }
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 32px;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }

  ${({ theme }) => theme.media.md} {
    padding: 24px;
  }
`;

const ChannelBadge = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blueB};
  background: ${({ theme }) => theme.colors.blueGlow};
  padding: 3px 10px;
  border-radius: 100px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
`;

const CardDesc = styled.p`
  font-size: 14px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 20px;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.w50};
  background: ${({ theme }) => theme.colors.w04};
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

const sensors = [
  {
    channel: 'A0 \u00b7 BNC',
    title: 'pH',
    desc: 'Industrial BNC electrode input with temperature-compensated calibration. Measures hydrogen ion activity across the full 0\u201314\u00a0range.',
    tags: ['0 – 14 range', '\u00b1\u00a00.02 accuracy', 'ATC'],
  },
  {
    channel: 'A1 \u00b7 BNC',
    title: 'TDS / Conductivity',
    desc: 'Total dissolved solids via conductivity probe. Dual-mode measurement for freshwater and brackish environments.',
    tags: ['0 – 1000 ppm', '\u00b1\u00a02% FS', 'Auto-ranging'],
  },
  {
    channel: 'A2 \u00b7 Analog',
    title: 'Turbidity',
    desc: 'Nephelometric turbidity via infrared scatter. Detects suspended solids and particulate contamination in\u00a0real\u00a0time.',
    tags: ['0 – 3000 NTU', 'IR 850 nm', 'Scatter'],
  },
  {
    channel: 'A3 \u00b7 BNC',
    title: 'ORP',
    desc: 'Oxidation-reduction potential for disinfection monitoring. Validates chlorine effectiveness and detects\u00a0redox\u00a0shifts.',
    tags: ['\u00b1\u00a02000 mV', '\u00b1\u00a05 mV', 'Platinum tip'],
  },
  {
    channel: 'GPIO \u00b7 1-Wire',
    title: 'Temperature',
    desc: 'Waterproof DS18B20 probe with stainless steel housing. Provides reference temperature for pH and TDS\u00a0compensation.',
    tags: ['\u22125 – 85\u00a0\u00b0C', '\u00b1\u00a00.5\u00a0\u00b0C', 'DS18\u2011B20'],
  },
  {
    channel: 'UART \u00b7 NMEA',
    title: 'GPS',
    desc: 'GNSS module for geo-tagged readings and mobile deployments. Logs coordinates with every\u00a0sample\u00a0batch.',
    tags: ['GPS + GLONASS', '2.5 m CEP', 'PPS sync'],
  },
];

const SensorGrid = () => (
  <Section id="sensors">
    <Container>
      <Header>
        <RevealOnScroll>
          <SectionLabel>Sensor Channels</SectionLabel>
          <SectionTitle>Six parameters. One&nbsp;board.</SectionTitle>
          <SectionDesc>
            Each channel reads through a 16-bit ADS1115 ADC with programmable gain.
            Factory-calibrated with NIST-traceable references. Field-recalibrate with standard&nbsp;buffers.
          </SectionDesc>
        </RevealOnScroll>
      </Header>

      <Grid>
        {sensors.map((s, i) => (
          <RevealOnScroll key={s.title} delay={i * 0.08}>
            <Card>
              <ChannelBadge>{s.channel}</ChannelBadge>
              <CardTitle>{s.title}</CardTitle>
              <CardDesc>{s.desc}</CardDesc>
              <TagRow>
                {s.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </TagRow>
            </Card>
          </RevealOnScroll>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default SensorGrid;
