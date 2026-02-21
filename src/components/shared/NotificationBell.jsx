import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NotificationsAPI } from '../../scripts/back_door';
import { db } from '../../apis/firebase';
import { ref, get, update } from 'firebase/database';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ── Container ─────────────────────────────────────────── */

const BellContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.15s ease-out;
  color: ${({ $light }) => $light ? 'rgba(255,255,255,0.7)' : '#6B7280'};
  font-size: 20px;
  min-height: 44px;
  min-width: 44px;

  &:hover {
    background: ${({ $light }) => $light ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'};
    color: ${({ $light }) => $light ? '#FFFFFF' : '#1A1A1A'};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #EF4444;
  color: #FFFFFF;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  border: 2px solid white;
`;

/* ── Dropdown ──────────────────────────────────────────── */

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 480px) {
    position: fixed;
    top: 72px;
    left: 12px;
    right: 12px;
    width: auto;
    max-height: calc(100vh - 96px);
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
`;

const DropdownTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0;
  letter-spacing: -0.01em;
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.primary || '#0066FF'};
  cursor: pointer;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  min-height: 28px;

  &:hover {
    background: ${({ theme }) => theme.colors?.primaryLight || 'rgba(0,102,255,0.06)'};
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;

  /* Smooth scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 2px;
  }
`;

const NotificationItem = styled.div`
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.1s ease-out;
  background: ${({ $unread }) => $unread ? '#F8FAFF' : '#FFFFFF'};
  border-bottom: 1px solid #F9FAFB;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &:hover {
    background: #F3F4F6;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TypeDot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'alert': return '#EF4444';
      case 'credit-generated': return '#0066FF';
      case 'trading-program-available': return '#10B981';
      case 'enrollment-update': return '#F59E0B';
      default: return '#9CA3AF';
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: ${({ $unread }) => $unread ? '600' : '400'};
  color: #1A1A1A;
  margin-bottom: 2px;
  line-height: 1.4;
`;

const NotificationBody = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  color: #6B7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NotificationTime = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 4px;
`;

const EmptyNotifications = styled.div`
  padding: 48px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const EmptyIcon = styled.div`
  color: #D1D5DB;
  margin-bottom: 4px;
`;

const EmptyTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  font-weight: 600;
  color: #6B7280;
`;

const EmptyText = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  color: #9CA3AF;
`;

const MiniSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #E5E7EB;
  border-top-color: ${({ theme }) => theme.colors?.primary || '#0066FF'};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 24px auto;
`;

/* ── Component ─────────────────────────────────────────── */

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
      if (db) {
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
      }
    } catch (error) {
      // Silently handle notification load failures
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await NotificationsAPI.markRead(notificationId);
    } catch {
      try {
        if (db) {
          const notifRef = ref(db, `notifications/${notificationId}`);
          await update(notifRef, { read: true });
        }
      } catch {
        // Silently handle
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
          if (db) {
            const notifRef = ref(db, `notifications/${n.id}`);
            await update(notifRef, { read: true });
          }
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
                <EmptyIcon>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </EmptyIcon>
                <EmptyTitle>No new notifications</EmptyTitle>
                <EmptyText>You're all caught up</EmptyText>
              </EmptyNotifications>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  $unread={!notification.read}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <TypeDot $type={notification.type} />
                  <NotificationContent>
                    <NotificationTitle $unread={!notification.read}>
                      {notification.title}
                    </NotificationTitle>
                    {notification.body && (
                      <NotificationBody>{notification.body}</NotificationBody>
                    )}
                    <NotificationTime>{formatTime(notification.createdAt)}</NotificationTime>
                  </NotificationContent>
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
