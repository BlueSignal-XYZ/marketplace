import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;

  /* Unified corner radius on grid children (RevealOnScroll wrappers) */
  > :nth-child(1) { border-radius: 16px 0 0 16px; overflow: hidden; }
  > :nth-child(4) { border-radius: 0 16px 16px 0; overflow: hidden; }

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: repeat(2, 1fr);

    > :nth-child(1) { border-radius: 16px 0 0 0; }
    > :nth-child(2) { border-radius: 0 16px 0 0; overflow: hidden; }
    > :nth-child(3) { border-radius: 0 0 0 16px; overflow: hidden; }
    > :nth-child(4) { border-radius: 0 0 16px 0; }
  }

  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr;

    > :nth-child(1) { border-radius: 16px 16px 0 0; }
    > :nth-child(2), > :nth-child(3) { border-radius: 0; overflow: hidden; }
    > :nth-child(4) { border-radius: 0 0 16px 16px; }
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 40px 28px;
  text-align: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;

const Emoji = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  line-height: 1;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
`;

const CardDesc = styled.p`
  font-size: 13px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.w50};
  max-width: 240px;
  margin: 0 auto;
`;

const useCases = [
  {
    emoji: '\ud83d\udc1f',
    title: 'Aquaculture',
    desc: 'Monitor dissolved oxygen, pH, and temperature in fish ponds and shrimp\u00a0farms.',
  },
  {
    emoji: '\ud83c\udf3f',
    title: 'Algae Control',
    desc: 'Detect blooms early with turbidity and ORP trending. Trigger ultrasonic transducers\u00a0automatically.',
  },
  {
    emoji: '\ud83c\udfd7\ufe0f',
    title: 'Stormwater',
    desc: 'Track retention basin quality for MS4 compliance. Log GPS-tagged readings for\u00a0reporting.',
  },
  {
    emoji: '\ud83c\udfe0',
    title: 'Residential',
    desc: 'Well water and rainwater harvesting. Get alerts when pH drifts or TDS spikes above\u00a0threshold.',
  },
];

const UseCasesSection = () => (
  <Section>
    <Container>
      <Header>
        <RevealOnScroll>
          <SectionLabel>Applications</SectionLabel>
          <SectionTitle>Built for the&nbsp;field.</SectionTitle>
        </RevealOnScroll>
      </Header>

      <Grid>
        {useCases.map((uc, i) => (
          <RevealOnScroll key={uc.title} delay={i * 0.08}>
            <Card>
              <Emoji>{uc.emoji}</Emoji>
              <CardTitle>{uc.title}</CardTitle>
              <CardDesc>{uc.desc}</CardDesc>
            </Card>
          </RevealOnScroll>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default UseCasesSection;
