import styled from 'styled-components';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import RevealOnScroll from '../components/RevealOnScroll';

const GITHUB_REPO = 'https://github.com/NeptuneChain-Inc/NPC-Frontend';
const RELEASE_TAG = 'v1.0.0';
const RELEASE_URL = `${GITHUB_REPO}/releases/tag/firmware-${RELEASE_TAG}`;
const IMAGE_FILENAME = `bluesignal-wqm1-${RELEASE_TAG}.img.gz`;
const SOURCE_FILENAME = `bluesignal-wqm1-firmware-${RELEASE_TAG}.tar.gz`;
const IMAGE_SIZE = '~1.2 GB';
const SOURCE_SIZE = '~45 KB';
const IMAGE_SHA256 = 'Published alongside release assets';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  max-width: 860px;
  margin: 0 auto;
  padding: 140px 24px 80px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 110px 16px 48px;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 48px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.w15};
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardIcon = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const CardTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const CardBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.green};
  background: ${({ theme }) => theme.colors.greenDim};
  padding: 3px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardDesc = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 20px;
`;

const FileMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.w30};
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 12px 24px;
  border-radius: 100px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.12);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.w50};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.w15};
  padding: 11px 24px;
  border-radius: 100px;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.w30};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.w08};
  margin: 48px 0;

  @media (max-width: 768px) {
    margin: 36px 0;
  }
`;

const SectionHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 24px;
`;

const Steps = styled.ol`
  list-style: none;
  counter-reset: steps;
  padding: 0;
  margin: 0;
`;

const Step = styled.li`
  counter-increment: steps;
  display: flex;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.w04};

  &::before {
    content: counter(steps);
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.blue};
    background: ${({ theme }) => theme.colors.blueGlow};
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    gap: 12px;
    padding: 12px 0;
  }
`;

const StepContent = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.w70};
  flex: 1;
  min-width: 0;

  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 13px;
    color: ${({ theme }) => theme.colors.w50};
    background: ${({ theme }) => theme.colors.w04};
    padding: 2px 6px;
    border-radius: 4px;
    word-break: break-all;
  }
`;

const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DocLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.w70};
  text-decoration: none;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 8px;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.w15};
    color: ${({ theme }) => theme.colors.white};
  }

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.w30};
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
  }
`;

const ReleaseHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Release = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.w04};
`;

const ReleaseTag = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  margin-right: 8px;
`;

const ReleaseDate = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.w30};
`;

const ReleaseDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.w50};
  margin-top: 8px;
`;

const ReqGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ReqItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.w70};
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w04};
  border-radius: 8px;
`;

const ReqDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.blue};
  flex-shrink: 0;
`;

const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 18 18" fill="none">
    <path d="M10.5 1.5H4.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V6l-4.5-4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 1.5V6H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9.75H6M12 12.75H6M7.5 6.75H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadPage = () => (
  <Wrapper>
    <Nav />
    <Main>
      <RevealOnScroll>
        <PageTitle>WQM-1 Firmware Downloads</PageTitle>
        <Subtitle>Current Release: {RELEASE_TAG} &middot; February 2026</Subtitle>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <Card>
          <CardHeader>
            <CardIcon aria-hidden="true">&#x1F4E6;</CardIcon>
            <CardTitle>Flashable Image</CardTitle>
            <CardBadge>Recommended</CardBadge>
          </CardHeader>
          <CardDesc>
            Pre-built Raspberry Pi OS image with firmware pre-installed.
            Flash to a microSD card and boot — no manual setup required.
          </CardDesc>
          <FileMeta>
            <span>{IMAGE_FILENAME}&ensp;({IMAGE_SIZE})</span>
            <span>SHA256: {IMAGE_SHA256}</span>
          </FileMeta>
          <ButtonRow>
            <PrimaryBtn
              href={`${RELEASE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadIcon />
              Download Image
            </PrimaryBtn>
            <SecondaryBtn
              href={`${RELEASE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify Checksum
            </SecondaryBtn>
          </ButtonRow>
        </Card>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15}>
        <Card>
          <CardHeader>
            <CardIcon aria-hidden="true">&#x1F4C1;</CardIcon>
            <CardTitle>Firmware Source</CardTitle>
            <CardBadge>Advanced</CardBadge>
          </CardHeader>
          <CardDesc>
            Python source code for manual installation on an existing
            Raspberry Pi OS. Includes all sensor drivers, LoRaWAN stack,
            and systemd services.
          </CardDesc>
          <FileMeta>
            <span>{SOURCE_FILENAME}&ensp;({SOURCE_SIZE})</span>
          </FileMeta>
          <ButtonRow>
            <PrimaryBtn
              href={`${RELEASE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadIcon />
              Download Source
            </PrimaryBtn>
            <SecondaryBtn
              href={`${GITHUB_REPO}/tree/master/firmware`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </SecondaryBtn>
          </ButtonRow>
        </Card>
      </RevealOnScroll>

      <RevealOnScroll delay={0.2}>
        <Card>
          <CardHeader>
            <CardIcon aria-hidden="true">&#x1F4CB;</CardIcon>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <DocList>
            <DocLink href={`${GITHUB_REPO}/blob/master/firmware/README.md`} target="_blank" rel="noopener noreferrer">
              <DocIcon />
              Quick Start Guide
            </DocLink>
            <DocLink href={`${GITHUB_REPO}/blob/master/firmware/README.md#calibration`} target="_blank" rel="noopener noreferrer">
              <DocIcon />
              Calibration Guide
            </DocLink>
            <DocLink href={`${GITHUB_REPO}/blob/master/firmware/README.md#troubleshooting`} target="_blank" rel="noopener noreferrer">
              <DocIcon />
              Troubleshooting FAQ
            </DocLink>
            <DocLink href={`${GITHUB_REPO}/blob/master/firmware/CHANGELOG.md`} target="_blank" rel="noopener noreferrer">
              <DocIcon />
              Changelog
            </DocLink>
          </DocList>
        </Card>
      </RevealOnScroll>

      <Divider />

      <RevealOnScroll>
        <SectionHeading>Installation</SectionHeading>
        <Steps>
          <Step>
            <StepContent>Download the flashable image above</StepContent>
          </Step>
          <Step>
            <StepContent>
              Flash to a 16 GB+ microSD card using Raspberry Pi Imager, or:<br />
              <code>gunzip -c {IMAGE_FILENAME} | sudo dd of=/dev/sdX bs=4M status=progress</code>
            </StepContent>
          </Step>
          <Step>
            <StepContent>Insert microSD into Raspberry Pi Zero 2W</StepContent>
          </Step>
          <Step>
            <StepContent>Connect WQM-1 HAT to the 40-pin GPIO header</StepContent>
          </Step>
          <Step>
            <StepContent>Connect 9&ndash;24 V DC power supply (2 A recommended)</StepContent>
          </Step>
          <Step>
            <StepContent>SSH in: <code>ssh pi@wqm-XXXX.local</code></StepContent>
          </Step>
          <Step>
            <StepContent>Edit config: <code>sudo nano /etc/bluesignal/config.yaml</code></StepContent>
          </Step>
          <Step>
            <StepContent>Set your LoRaWAN keys from the TTN console (<code>dev_eui</code>, <code>app_eui</code>, <code>app_key</code>)</StepContent>
          </Step>
          <Step>
            <StepContent>Reboot: <code>sudo reboot</code></StepContent>
          </Step>
        </Steps>
      </RevealOnScroll>

      <Divider />

      <RevealOnScroll>
        <SectionHeading>Release History</SectionHeading>
        <ReleaseHistory>
          <Release>
            <ReleaseTag>v1.0.0</ReleaseTag>
            <ReleaseDate>February 2026</ReleaseDate>
            <ReleaseDesc>
              Initial release &mdash; 6 sensor channels (pH, TDS, turbidity, ORP, temperature, GPS),
              LoRaWAN uplink via SX1262, SQLite WAL buffer with store-and-forward,
              relay control with threshold automation, GPS geo-tagging.
            </ReleaseDesc>
          </Release>
        </ReleaseHistory>
      </RevealOnScroll>

      <Divider />

      <RevealOnScroll>
        <SectionHeading>System Requirements</SectionHeading>
        <ReqGrid>
          <ReqItem><ReqDot />Raspberry Pi Zero 2W</ReqItem>
          <ReqItem><ReqDot />BlueSignal WQM-1 HAT</ReqItem>
          <ReqItem><ReqDot />16 GB+ microSD (Class 10 / A1)</ReqItem>
          <ReqItem><ReqDot />9&ndash;24 V DC power (2 A)</ReqItem>
          <ReqItem><ReqDot />LoRa antenna (915 MHz SMA)</ReqItem>
          <ReqItem><ReqDot />The Things Network account</ReqItem>
        </ReqGrid>
      </RevealOnScroll>
    </Main>
    <Footer />
  </Wrapper>
);

export default DownloadPage;
