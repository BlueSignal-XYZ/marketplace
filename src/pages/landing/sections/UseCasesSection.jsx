import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 32px;
  }
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
  padding: 32px;
  text-align: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }

  ${({ theme }) => theme.media.md} {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    text-align: left;
    padding: 24px;
  }

  ${({ theme }) => theme.media.sm} {
    padding: 20px;
  }
`;

const Emoji = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  line-height: 1;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 0;
    font-size: 28px;
    flex-shrink: 0;
  }
`;

const CardContent = styled.div`
  min-width: 0;
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

  ${({ theme }) => theme.media.md} {
    max-width: none;
    margin: 0;
  }
`;

const useCases = [
  {
    emoji: '\ud83c\udfe0',
    title: 'Homeowner Rebates',
    desc: 'Opt into your municipality\u2019s water quality program. BlueSignal monitors your AWG or well water and generates the credits that qualify you for\u00a0rebates.',
  },
  {
    emoji: '\ud83c\udfe2',
    title: 'Commercial Properties',
    desc: 'Businesses with on-site water systems earn nutrient credits automatically. Verified data flows to waterquality.trading and rebates hit your\u00a0account.',
  },
  {
    emoji: '\ud83c\udfdb\ufe0f',
    title: 'Municipal Programs',
    desc: 'Cities deploy BlueSignal as the monitoring backbone for water quality rebate programs. One platform for enrollment, verification, and credit\u00a0settlement.',
  },
  {
    emoji: '\ud83c\udf3f',
    title: 'Stormwater & Compliance',
    desc: 'Track retention basin quality for MS4 compliance. Sensor data becomes verified credits — turning regulatory costs into\u00a0revenue.',
  },
];

const UseCasesSection = () => (
  <Section>
    <Container>
      <Header>
        <RevealOnScroll>
          <SectionLabel>Who It&rsquo;s For</SectionLabel>
          <SectionTitle>From homeowners to&nbsp;municipalities.</SectionTitle>
        </RevealOnScroll>
      </Header>

      <Grid>
        {useCases.map((uc, i) => (
          <RevealOnScroll key={uc.title} delay={i * 0.08}>
            <Card>
              <Emoji>{uc.emoji}</Emoji>
              <CardContent>
                <CardTitle>{uc.title}</CardTitle>
                <CardDesc>{uc.desc}</CardDesc>
              </CardContent>
            </Card>
          </RevealOnScroll>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default UseCasesSection;
