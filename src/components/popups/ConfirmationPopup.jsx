import PropTypes from "prop-types";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

/**
 * Confirmation Dialog
 *
 * @param {Object} props
 * @param {string} props.message - Confirmation message to display
 * @param {Function} props.onConfirm - Function to execute on confirmation
 * @param {Function} props.onCancel - Function to execute on cancellation
 */
const Confirmation = () => {
  const { STATES, ACTIONS } = useAppContext();

  const message = STATES.confirmation?.msg;
  const onConfirm = STATES.confirmation?.action;
  const onCancel = ACTIONS.cancelConfirmation;

  if (!message) return null; // Exit early if no message is provided

  // Function to execute when the user confirms the action
  const handleConfirm = () => {
    onConfirm && onConfirm();
    onCancel(true);
  };

  return (
    <AnimatePresence>
      {message && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          {/* Main Dialog */}
          <Dialog
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p>{message}</p>
            {onConfirm && (
              <Button primary onClick={handleConfirm}>
                Confirm
              </Button>
            )}
            <Button onClick={() => onCancel(false)}>Cancel</Button>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

Confirmation.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

// Overlay Styles
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 9999;
`;

// Dialog Styles
const Dialog = styled(motion.div)`
  background-color: white;
  padding: 20px;

  display: flex;
  flex-direction: column;

  border-radius: 10px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.5);

  max-width: 50%;
  box-sizing: border-box;
  z-index: 1000;

  p {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.ui800};
    font-weight: 500;
  }

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 15px;
  }
`;

// Button Styles
const Button = styled.button`
  padding: 10px 20px;
  margin: 8px 4px;
  cursor: pointer;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
  background-color: ${(props) =>
    props.primary ? props.theme.colors.primary500 : props.theme.colors.red500};
  display: flex;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  min-height: 44px;
  transition: all 0.15s ease-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
    outline-offset: 2px;
  }
`;

export default Confirmation;
