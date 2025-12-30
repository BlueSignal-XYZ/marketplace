// /src/components/navigation/CloudMenu.jsx
import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { safeAreaInsets } from "../../styles/breakpoints";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 900;

  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};

  transition: opacity 0.25s ease-out;
`;

const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  height: 100dvh;
  width: 300px;
  max-width: 85%;
  background: #ffffff;
  box-shadow: -16px 0 48px rgba(15, 23, 42, 0.12),
    -4px 0 12px rgba(15, 23, 42, 0.06);
  z-index: 1000;

  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: calc(20px + ${safeAreaInsets.top});
  padding-bottom: calc(32px + ${safeAreaInsets.bottom});
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  transform: translateX(${({ $open }) => ($open ? "0%" : "100%")});
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @media (min-width: 1024px) {
    width: 340px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PanelTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
    background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  }

  &:active {
    transform: scale(0.92);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"} 0%,
    transparent 100%
  );
  margin: 12px 0 16px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
  margin: 16px 0 8px;
  padding-left: 4px;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  padding: 12px 16px;
  min-height: 44px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease-out;

  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary700 || "#0F393A"
      : theme.colors?.ui700 || "#374151"};
  background: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary50 || "#E6F7F8"
      : "transparent"};

  ${({ $active, theme }) =>
    $active &&
    `
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: ${theme.colors?.primary500 || "#1D7072"};
      border-radius: 0 2px 2px 0;
    }
  `}

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? theme.colors?.primary100 || "#C0EAEB"
        : theme.colors?.ui100 || "#F4F5F7"};
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SmallText = styled.div`
  margin-top: auto;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
  line-height: 1.5;
  padding: 12px 4px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};

  strong {
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
    font-weight: 600;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  min-height: 44px;
  border-radius: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors?.red200 || "#FECACA"};
  background: ${({ theme }) => theme.colors?.red50 || "#FEF2F2"};
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.red600 || "#DC2626"};
  transition: all 0.2s ease-out;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors?.red100 || "#FEE2E2"};
    border-color: ${({ theme }) => theme.colors?.red300 || "#FCA5A5"};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ExternalLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  min-height: 44px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.ui600 || "#4B5563"};
  background: transparent;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    color: ${({ theme }) => theme.colors?.primary600 || "#0F393A"};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ExternalIcon = styled.span`
  font-size: 14px;
  opacity: 0.6;
`;

// Role-based menu configuration
const getMenuConfig = (user) => {
  const isInstaller = user?.role === "installer";
  const isAdmin = user?.role === "admin";

  return {
    showInstallerDash: isInstaller || isAdmin,
    showCommissioning: isInstaller || isAdmin,
    showAdvancedTools: user?.uid, // Only logged-in users
  };
};

export function CloudMenu({ open, onClose, user }) {
  const location = useLocation();
  const { ACTIONS } = useAppContext();
  const menuConfig = getMenuConfig(user);

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
          <PanelTitle>BlueSignal Cloud</PanelTitle>
          <CloseButton
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            ×
          </CloseButton>
        </PanelHeader>

        <Divider />

        {/* Primary Navigation - Always visible */}
        <SectionLabel>Dashboard</SectionLabel>
        <NavList>
          <NavItem
            to="/dashboard/main"
            $active={isActive("/dashboard/main")}
            onClick={onClose}
          >
            Overview
          </NavItem>
          {menuConfig.showInstallerDash && (
            <NavItem
              to="/dashboard/installer"
              $active={isActive("/dashboard/installer")}
              onClick={onClose}
            >
              Installer Dashboard
            </NavItem>
          )}
        </NavList>

        {user?.uid && (
          <>
            {/* Sites & Devices - Core functionality */}
            <SectionLabel>Manage</SectionLabel>
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
                to="/cloud/alerts"
                $active={isActive("/cloud/alerts")}
                onClick={onClose}
              >
                Alerts
              </NavItem>
            </NavList>

            {/* Quick Actions - Streamlined */}
            <SectionLabel>Quick Actions</SectionLabel>
            <NavList>
              <NavItem
                to="/cloud/sites/new"
                $active={isActive("/cloud/sites/new")}
                onClick={onClose}
              >
                + Add Site
              </NavItem>
              {menuConfig.showCommissioning && (
                <NavItem
                  to="/cloud/commissioning"
                  $active={isActive("/cloud/commissioning")}
                  onClick={onClose}
                >
                  Commission Device
                </NavItem>
              )}
            </NavList>

            {/* Tools - Consolidated */}
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
                Verification Portal
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
                Media Upload
              </NavItem>
            </NavList>

            {/* Account */}
            <SectionLabel>Account</SectionLabel>
            <NavList>
              <NavItem
                to="/cloud/profile"
                $active={isActive("/cloud/profile")}
                onClick={onClose}
              >
                Profile & Settings
              </NavItem>
            </NavList>
          </>
        )}

        {/* Cross-platform links */}
        <SectionLabel>BlueSignal Ecosystem</SectionLabel>
        <NavList>
          <ExternalLink
            href="https://waterquality.trading"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            Credit Marketplace
            <ExternalIcon>↗</ExternalIcon>
          </ExternalLink>
          <ExternalLink
            href="https://sales.bluesignal.xyz"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            Hardware & Quotes
            <ExternalIcon>↗</ExternalIcon>
          </ExternalLink>
        </NavList>

        <SmallText>
          {user?.uid ? (
            <>Signed in as <strong>{user?.email || user?.username}</strong></>
          ) : (
            <>Welcome to <strong>BlueSignal Cloud</strong></>
          )}
        </SmallText>

        {user?.uid && (
          <LogoutButton onClick={handleLogout}>
            Sign Out
          </LogoutButton>
        )}
      </Panel>
    </>
  );
}

export default CloudMenu;
