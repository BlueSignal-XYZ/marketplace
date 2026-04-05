import styled from 'styled-components';
import { Container, Section, SectionLabel, SectionTitle, SectionDesc } from '../styles/typography';
import RevealOnScroll from '../components/RevealOnScroll';
import SystemDiagram from '../components/SystemDiagram';

const DiagramWrapper = styled.div`
  width: 100%;
  max-width: 660px;
  margin: 0 auto;
`;

const SystemOverview = () => (
  <Section id="system-overview">
    <Container>
      <RevealOnScroll>
        <SectionLabel>System Overview</SectionLabel>
        <SectionTitle>How it all connects.</SectionTitle>
        <SectionDesc>
          Sensors, radio, relay output, and expansion — see how each
          subsystem wires into the WQM-1&nbsp;board.
        </SectionDesc>
      </RevealOnScroll>
      <RevealOnScroll>
        <DiagramWrapper>
          <SystemDiagram />
        </DiagramWrapper>
      </RevealOnScroll>
    </Container>
  </Section>
);

export default SystemOverview;
