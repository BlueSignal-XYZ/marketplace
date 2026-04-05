import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { pushLocalNotification } from "../scripts/notifications";
import {useAppContext} from "../context/AppContext";

/**
 * NotificationBar Component to render application notifications from storage
 *
 */
const NotificationBar = () => {
  const { STATES, ACTIONS } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const { user, notificationBarOpen } = STATES || {};
  const { handleNotificationsBar, logNotification } = ACTIONS || {};

  useEffect(() => {
    // Fetch stored notifications
    const _notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    if (_notifications) {
      setNotifications(_notifications);
    }
  }, [STATES]);

  const handleSmapleNotification = (type) => {
    const _notification = pushLocalNotification(
      type,
      `This is a sample ${type} notification`
    );
    logNotification(_notification.type, _notification.message);
  };

  if(!user){
    return;
  }

  // Framer Motion variants
  const notificationVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  };

  
  return (
    <>
      <AnimatePresence>
        {notificationBarOpen && (
          <>
            <NotificationIcon icon={faTimes} onClick={handleNotificationsBar} />
            <NotificationContainer
              as={motion.div}
              initial="closed"
              animate="open"
              exit="closed"
              variants={notificationVariants}
            >
              {/* Create Sample notifications */}
              <h5>**For Testing Only**</h5>
              <button onClick={() => handleSmapleNotification("")}>
                Send Sample Message Notification
              </button>
              <button onClick={() => handleSmapleNotification("alert")}>
                Send Sample Alert Notification
              </button>
              <button onClick={() => handleSmapleNotification("error")}>
                Send Sample Error Notification
              </button>
              <h5>********************</h5>

              {notifications?.map((notification, index) => (
                <NotificationItem key={index} type={notification.type}>
                  <p>{notification.message}</p>
                  <small>{notification.time}</small>
                </NotificationItem>
              ))}
            </NotificationContainer>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const NotificationContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-top: 20%;
  box-sizing: border-box;
  box-shadow: -5px 0px 15px rgba(0, 0, 0, 0.2);
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  z-index: 1000;
  background: #fff;
  overflow: auto;

  @media (min-width: 768px) {
    width: 30%;
  }

  button {
    background: #134b5f;
    color: white;
    margin: 5px;
    font-size: 0.8rem;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  font-size: 0.8rem;
  margin: 10px 0;
  border-bottom: 1px solid #ccc;
  //background-color: #fff;
  background-color: ${(props) =>
    props.type === "error"
      ? "#ffebee"
      : props.type === "alert"
      ? "#e8f5e9"
      : "#A5F8D3"};
`;

const NotificationIcon = styled(FontAwesomeIcon)`
  position: fixed;
  top: 10%;
  left: 45%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 9999;
`;

export default NotificationBar;
