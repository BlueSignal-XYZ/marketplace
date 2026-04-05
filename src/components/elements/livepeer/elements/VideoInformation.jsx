import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
`;

const Title = styled(motion.h2)`
  font-size: 1.5em;
  margin-bottom: 20px;
`;

const InfoBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const InfoTitle = styled(motion.h3)`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const InfoItem = styled(motion.p)`
  margin: 5px 0;
`;

// Video Information Component
const VideoInformation = ({ videoData }) => {
  if(!videoData?.name){
    return;
  }
  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Video Information</Title>
      <InfoBlock>
        <InfoTitle>General</InfoTitle>
        <InfoItem>Name: {videoData.name}</InfoItem>
        <InfoItem>Size: {videoData.size} bytes</InfoItem>
        <InfoItem>Created At: {new Date(videoData.createdAt).toLocaleString()}</InfoItem>
      </InfoBlock>

      <InfoBlock>
        <InfoTitle>Video Specification</InfoTitle>
        <InfoItem>Format: {videoData.videoSpec?.format}</InfoItem>
        <InfoItem>Bitrate: {videoData.videoSpec?.bitrate}</InfoItem>
        <InfoItem>Duration: {videoData.videoSpec?.duration} seconds</InfoItem>
      </InfoBlock>

      <InfoBlock>
        <InfoTitle>Storage</InfoTitle>
        <InfoItem>IPFS URL: {videoData.storage?.ipfs?.url}</InfoItem>
        <InfoItem>NFT Metadata: {videoData.storage?.ipfs?.spec?.nftMetadata?.name}</InfoItem>
      </InfoBlock>

      <InfoBlock>
        <InfoTitle>Playback</InfoTitle>
        <InfoItem>Playback ID: {videoData.playbackId}</InfoItem>
        <InfoItem>Download URL: {videoData.downloadUrl}</InfoItem>
        <InfoItem>Playback URL: {videoData.playbackUrl}</InfoItem>
      </InfoBlock>
    </Container>
  );
};

export default VideoInformation;
