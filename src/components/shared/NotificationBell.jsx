import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NotificationsAPI } from '../../scripts/back_door';
import { db } from '../../apis/firebase';
import { ref, get, update } from 'firebase/database';
import { notificationTypeColor } from '../../styles/uiPrimitives';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const BellContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: ${({ theme }) => theme.transitions.default};
  color: ${({ theme, $light }) => $light ? theme.colors.ui200 : theme.colors.ui600};
  font-size: 20px;

  &:hover {
    background: ${({ theme, $light }) => $light ? 'rgba(255,255,255,0.1)' : theme.colors.ui100};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${({ theme }) => theme.colors.red500};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 480px;
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    right: -16px;
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui100};
`;

const DropdownTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary500};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 380px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 14px ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui50};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  background: ${({ theme, $unread }) => $unread ? theme.colors.ui50 : '#fff'};

  &:hover {
    background: ${({ theme }) => theme.colors.ui100};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  font-weight: ${({ $unread }) => $unread ? '600' : '400'};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const NotificationBody = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

const NotificationTime = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ui400};
  margin-top: 4px;
`;

const EmptyNotifications = styled.div`
  padding: 40px ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.ui400};
  font-size: 14px;
`;

const TypeIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $type }) => notificationTypeColor($type, theme)};
`;

const MiniSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.ui200};
  border-top-color: ${({ theme }) => theme.colors.primary500};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 20px auto;
`;

/**
 * NotificationBell — cross-platform notification component.
 * Reads from RTDB /notifications/ for the current user.
 * Used in both CloudHeader and MarketplaceHeader.
 */
const NotificationBell = ({ light = false }) => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load notifications
  useEffect(() => {
    if (!user?.uid) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  const loadNotifications = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      // Try backend API
      try {
        const response = await NotificationsAPI.list(user.uid);
        if (response?.notifications) {
          setNotifications(response.notifications);
          setUnreadCount(response.notifications.filter(n => !n.read).length);
          return;
        }
      } catch {
        // Fall through to RTDB
      }

      // Direct RTDB read
      const notificationsRef = ref(db, 'notifications');
      const snapshot = await get(notificationsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const userNotifications = Object.entries(data)
          .map(([id, n]) => ({ id, ...n }))
          .filter(n => n.userId === user.uid && !n.dismissed)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          .slice(0, 20);

        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await NotificationsAPI.markRead(notificationId);
    } catch {
      try {
        const notifRef = ref(db, `notifications/${notificationId}`);
        await update(notifRef, { read: true });
      } catch (e) {
        console.error('Failed to mark notification as read:', e);
      }
    }
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationsAPI.markAllRead(user.uid);
    } catch {
      for (const n of notifications.filter(n => !n.read)) {
        try {
          const notifRef = ref(db, `notifications/${n.id}`);
          await update(notifRef, { read: true });
        } catch { /* skip */ }
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    handleMarkRead(notification.id);
    setOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (!user?.uid) return null;

  return (
    <BellContainer ref={dropdownRef}>
      <BellButton $light={light} onClick={() => setOpen(!open)} aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>}
      </BellButton>

      {open && (
        <Dropdown>
          <DropdownHeader>
            <DropdownTitle>Notifications</DropdownTitle>
            {unreadCount > 0 && (
              <MarkAllButton onClick={handleMarkAllRead}>
                Mark all read
              </MarkAllButton>
            )}
          </DropdownHeader>

          <NotificationList>
            {loading && notifications.length === 0 ? (
              <MiniSpinner />
            ) : notifications.length === 0 ? (
              <EmptyNotifications>
                No notifications yet
              </EmptyNotifications>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  $unread={!notification.read}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationTitle $unread={!notification.read}>
                    <TypeIndicator $type={notification.type} />
                    {notification.title}
                  </NotificationTitle>
                  {notification.body && (
                    <NotificationBody>{notification.body}</NotificationBody>
                  )}
                  <NotificationTime>{formatTime(notification.createdAt)}</NotificationTime>
                </NotificationItem>
              ))
            )}
          </NotificationList>
        </Dropdown>
      )}
    </BellContainer>
  );
};

export default NotificationBell;
