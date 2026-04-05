import PropTypes from "prop-types";
import styled from "styled-components";
import { motion } from "framer-motion";
import configs from "../../../configs";
import {useAppContext} from "../../context/AppContext";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: visibility 0.3s, opacity 0.3s;
  z-index: 10000;
`;

const PopupContainer = styled(motion.div)`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const Title = styled.h3`
  margin-bottom: 15px;
`;

const Message = styled.p`
  margin-bottom: 20px;
`;

const CTAButton = styled.a`
  display: inline-block;
  background: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  margin: 5px;
  &:hover {
    background: #555;
  }
`;

const CloseButton = styled.a`
  margin: 0;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #333;
  }
`;

const ResultPopup = () => {
  const { STATES, ACTIONS } = useAppContext();

  const isVisible = Boolean(STATES.result?.title);
  const title = STATES.result?.title;
  const message = STATES.result?.message;
  const txHash = STATES.result?.txHash;
  const onRetry = STATES.result?.handleRetry;
  const onClose = () => ACTIONS.setResult(null);

  return (
    <Overlay
      isVisible={isVisible}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      <PopupContainer
        initial={{ scale: 0.7 }}
        animate={{ scale: isVisible ? 1 : 0.7 }}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{title}</Title>
        <Message>{message}</Message>
        {txHash ? (
          <CTAButton
            href={`${
              configs.blockchain.NETWORKS[configs.blockchain.MODE + "net"]
                .explorer
            }/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify
          </CTAButton>
        ) : onRetry ? (
          <CTAButton onClick={onRetry}>Retry</CTAButton>
        ) : (
          <CTAButton onClick={onClose}>Close</CTAButton>
        )}
      </PopupContainer>
    </Overlay>
  );
};

ResultPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  txHash: PropTypes.string,
  onRetry: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default ResultPopup;
