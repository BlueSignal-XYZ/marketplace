import { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

/**
 * Notification Component
 * This component displays notifications of various types on the screen.
 * @param {String} message - The message to be displayed in the notification.
 * @param {String} type - The type of the notification, can be 'notification', 'alert', or 'error'.
 * @param {Function} clearNotification - Function to clear the notification.
 */
const Notification = () => {
  const { STATES, ACTIONS } = useAppContext();

  const message=STATES.notification?.[Object.keys(STATES.notification)?.[0]];
  const type= Object.keys(STATES.notification)?.[0];
  const clearNotification= ACTIONS.clearNotification;

  // Close the notification
  const handleClose = () => {
    clearNotification();
  };

  // Auto close the notification after 4 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [type, clearNotification]);

  if (!message) return null;

  return (
    <AnimatePresence>
      {message && (
        <Container
          type={type}
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {message}
          <span style={{ marginLeft: "10px", cursor: "pointer" }} onClick={handleClose}>
            ✕
          </span>
        </Container>
      )}
    </AnimatePresence>
  );
};

// Theme-compatible notification colors using theme tokens
const getNotificationColor = (type, theme) => {
  switch (type) {
    case "success":
    case "notification":
      return theme?.colors?.primary500 || "#1D7072";
    case "alert":
    case "warning":
      return "#F59E0B"; // amber-500
    case "error":
      return theme?.colors?.red500 || "#ef4444";
    default:
      return theme?.colors?.ui700 || "#3f3f46";
  }
};

const Container = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 16px 20px;
  background-color: ${({ type, theme }) => getNotificationColor(type, theme)};
  color: white;
  border-radius: ${({ theme }) => theme?.borderRadius?.default || "12px"};
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-weight: 500;
  z-index: 9999;
  max-width: calc(100% - 40px);
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
    padding: 14px 16px;
  }
`;

export default Notification;

