import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Broadcast } from '@livepeer/react';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const BroadcastContainer = styled(motion.div)`
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  width: 80%;
  max-width: 500px;
  z-index: 1001;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1002;
`;

export const StreamBroadcast = ({ streamKey, webBroadcast }) => {
  const closeOverlay = () => {
    webBroadcast.setIsWebBroadcast(false);
  };

  return (
    <AnimatePresence>
      {webBroadcast && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CloseButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeOverlay}
          >
            X
          </CloseButton>
          <BroadcastContainer
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '-100vh' }}
          >
            <Broadcast
              streamKey={streamKey}
              controls={{ autohide: 3000 }}
              theme={{
                borderStyles: { containerBorderStyle: 'hidden' },
                radii: { containerBorderRadius: '10px' },
              }}
            />
          </BroadcastContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};
