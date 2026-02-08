import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle, SectionDesc } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  ${({ theme }) => theme.media.md} {
    gap: 32px;
  }
`;

const Left = styled.div``;

const CTAButton = styled.a`
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
  margin-top: 32px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 0 24px rgba(255,255,255,0.15);
  }
`;

const Tables = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TableGroup = styled.div``;

const TableTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.w30};
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.w08};
  margin-bottom: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.w04};
  gap: 16px;

  ${({ theme }) => theme.media.sm} {
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const RowKey = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.w70};
  white-space: nowrap;
`;

const RowVal = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.w50};
  text-align: right;
  white-space: nowrap;

  ${({ theme }) => theme.media.sm} {
    white-space: normal;
    text-align: left;
    flex: 1;
    min-width: 0;
  }
`;

const specTables = [
  {
    title: 'Compute',
    rows: [
      ['Processor', 'BCM2710A1 Quad Cortex\u2011A53'],
      ['RAM', '512\u00a0MB LPDDR2'],
      ['Storage', 'microSD + SQLite WAL'],
      ['OS', 'Raspberry Pi OS Lite'],
      ['Form Factor', 'HAT (65 \u00d7 56.5\u00a0mm)'],
    ],
  },
  {
    title: 'Radio',
    rows: [
      ['Transceiver', 'Semtech SX1262'],
      ['Frequency', '915\u00a0MHz (US) / 868\u00a0MHz (EU)'],
      ['Range', '15\u00a0km line-of-sight'],
      ['Protocol', 'LoRaWAN 1.0.3 Class\u00a0A'],
      ['Payload', 'Cayenne LPP'],
      ['Antenna', 'SMA 50\u00a0\u2126 / \u00bc\u2011wave whip'],
    ],
  },
  {
    title: 'Sensing',
    rows: [
      ['ADC', 'ADS1115 16-bit \u00b7 4\u2011ch'],
      ['pH', '0 – 14 \u00b7 \u00b1\u00a00.02'],
      ['TDS', '0 – 1000\u00a0ppm \u00b7 \u00b1\u00a02%'],
      ['Turbidity', '0 – 3000\u00a0NTU \u00b7 IR scatter'],
      ['ORP', '\u00b1\u00a02000\u00a0mV \u00b7 \u00b1\u00a05\u00a0mV'],
      ['Temperature', '\u22125 – 85\u00a0\u00b0C \u00b7 \u00b1\u00a00.5\u00a0\u00b0C'],
      ['GPS', 'GNSS \u00b7 2.5\u00a0m CEP'],
    ],
  },
  {
    title: 'Power & I/O',
    rows: [
      ['Input Voltage', '9 – 24\u00a0V DC'],
      ['Connector', 'JST\u2011XH 2-pin'],
      ['Relay', '10\u00a0A @ 250\u00a0VAC / 30\u00a0VDC'],
      ['Expansion', 'I\u00b2C \u00b7 3.3\u00a0V \u00b7 4-pin header'],
      ['Enclosure', 'IP65 rated (optional)'],
    ],
  },
];

const SpecsSection = () => (
  <Section id="specs">
    <Container>
      <Grid>
        <Left>
          <RevealOnScroll>
            <SectionLabel>Specifications</SectionLabel>
            <SectionTitle>Every detail, documented.</SectionTitle>
            <SectionDesc>
              The WQM-1 is designed for developers and integrators who need
              full visibility into hardware capabilities before committing.
              No marketing abstractions — just the&nbsp;datasheet.
            </SectionDesc>
            <CTAButton href="#order">
              Order Dev Kit — $349
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </CTAButton>
          </RevealOnScroll>
        </Left>

        <Tables>
          {specTables.map((table, ti) => (
            <RevealOnScroll key={table.title} delay={ti * 0.1}>
              <TableGroup>
                <TableTitle>{table.title}</TableTitle>
                {table.rows.map(([key, val]) => (
                  <Row key={key}>
                    <RowKey>{key}</RowKey>
                    <RowVal>{val}</RowVal>
                  </Row>
                ))}
              </TableGroup>
            </RevealOnScroll>
          ))}
        </Tables>
      </Grid>
    </Container>
  </Section>
);

export default SpecsSection;
