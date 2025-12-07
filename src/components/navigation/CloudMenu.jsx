// /src/components/navigation/CloudMenu.jsx
import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { safeAreaInsets } from "../../styles/breakpoints";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(2px);
  z-index: 900;

  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};

  transition: opacity 0.2s ease-out;
`;

const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  height: 100dvh;
  width: 280px;
  max-width: 85%;
  background: ${({ theme }) => theme.colors?.bg || "#ffffff"};
  box-shadow: -12px 0 40px rgba(15, 23, 42, 0.16);
  z-index: 1000;

  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-top: calc(16px + ${safeAreaInsets.top});
  padding-bottom: calc(24px + ${safeAreaInsets.bottom});
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  transform: translateX(${({ $open }) => ($open ? "0%" : "100%")});
  transition: transform 0.25s ease-out;

  @media (min-width: 1024px) {
    width: 320px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PanelTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const CloseButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
  padding: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    background: ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  margin: 8px 0 12px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin: 10px 0 6px;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 14px;
  min-height: 44px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s ease-out;

  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui800 || "#111827"};
  background: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary50 || "#e0f2ff"
      : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

const SmallText = styled.div`
  margin-top: auto;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  line-height: 1.5;
  padding: 8px 0;
`;

const LogoutButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  padding: 12px 14px;
  min-height: 44px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  color: #ef4444;
  transition: all 0.15s ease-out;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: #fef2f2;
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

export function CloudMenu({ open, onClose, user }) {
  const location = useLocation();
  const { ACTIONS } = useAppContext();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    ACTIONS.logout();
    onClose();
  };

  // Treat nav as active for exact path or nested routes under it
  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <>
      <Backdrop $open={open} onClick={handleBackdropClick} />
      <Panel $open={open}>
        <PanelHeader>
          <PanelTitle>Cloud Monitoring</PanelTitle>
          <CloseButton
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            ×
          </CloseButton>
        </PanelHeader>

        <Divider />

        <SectionLabel>Overview</SectionLabel>
        <NavList>
          <NavItem
            to="/dashboard/main"
            $active={isActive("/dashboard/main")}
            onClick={onClose}
          >
            Overview
          </NavItem>
          {user?.role === "installer" && (
            <NavItem
              to="/dashboard/installer"
              $active={isActive("/dashboard/installer")}
              onClick={onClose}
            >
              My Dashboard
            </NavItem>
          )}
        </NavList>

        {user?.uid && (
          <>
            <SectionLabel>Operations</SectionLabel>
            <NavList>
              <NavItem
                to="/cloud/sites"
                $active={isActive("/cloud/sites")}
                onClick={onClose}
              >
                Sites
              </NavItem>
              <NavItem
                to="/cloud/devices"
                $active={isActive("/cloud/devices")}
                onClick={onClose}
              >
                Devices
              </NavItem>
              <NavItem
                to="/cloud/commissioning"
                $active={isActive("/cloud/commissioning")}
                onClick={onClose}
              >
                Commissioning
              </NavItem>
              <NavItem
                to="/cloud/alerts"
                $active={isActive("/cloud/alerts")}
                onClick={onClose}
              >
                Alerts
              </NavItem>
            </NavList>

            <SectionLabel>Tools</SectionLabel>
            <NavList>
              <NavItem
                to="/cloud/tools/nutrient-calculator"
                $active={isActive("/cloud/tools/nutrient-calculator")}
                onClick={onClose}
              >
                Nutrient Calculator
              </NavItem>
              <NavItem
                to="/cloud/tools/verification"
                $active={isActive("/cloud/tools/verification")}
                onClick={onClose}
              >
                Verification
              </NavItem>
              <NavItem
                to="/cloud/tools/live"
                $active={isActive("/cloud/tools/live")}
                onClick={onClose}
              >
                Live Stream
              </NavItem>
              <NavItem
                to="/cloud/tools/upload-media"
                $active={isActive("/cloud/tools/upload-media")}
                onClick={onClose}
              >
                Upload Media
              </NavItem>
            </NavList>
          </>
        )}

        <SmallText>
          Signed in as{" "}
          <strong>{user?.email || user?.username || "guest"}</strong>.
        </SmallText>

        {user?.uid && (
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        )}
      </Panel>
    </>
  );
}

export default CloudMenu;
