// /src/components/navigation/CloudMenu.jsx
import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

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
  width: 280px;
  max-width: 80%;
  background: ${({ theme }) => theme.colors?.bg || "#ffffff"};
  box-shadow: -12px 0 40px rgba(15, 23, 42, 0.16);
  z-index: 1000;

  display: flex;
  flex-direction: column;
  padding: 16px 16px 24px;
  box-sizing: border-box;

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
  background: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};

  &:hover {
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
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

  padding: 8px 10px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;

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
`;

const SmallText = styled.div`
  margin-top: auto;
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  line-height: 1.5;
`;

export function CloudMenu({ open, onClose, user }) {
  const location = useLocation();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
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

        <SectionLabel>Dashboards</SectionLabel>
        <NavList>
          <NavItem
            to="/dashboard/main"
            $active={isActive("/dashboard/main")}
            onClick={onClose}
          >
            Main Dashboard
          </NavItem>
          {user?.role === "buyer" && (
            <NavItem
              to="/dashboard/buyer"
              $active={isActive("/dashboard/buyer")}
              onClick={onClose}
            >
              Buyer Dashboard
            </NavItem>
          )}
          {user?.role === "seller" && (
            <NavItem
              to="/dashboard/seller"
              $active={isActive("/dashboard/seller")}
              onClick={onClose}
            >
              Seller Dashboard
            </NavItem>
          )}
          {user?.role === "installer" && (
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
            <SectionLabel>Tools</SectionLabel>
            <NavList>
              <NavItem
                to="/features/nutrient-calculator"
                $active={isActive("/features/nutrient-calculator")}
                onClick={onClose}
              >
                Nutrient Calculator
              </NavItem>
              <NavItem
                to="/features/verification"
                $active={isActive("/features/verification")}
                onClick={onClose}
              >
                Verification
              </NavItem>
              <NavItem
                to="/features/stream"
                $active={isActive("/features/stream")}
                onClick={onClose}
              >
                Live Stream
              </NavItem>
              <NavItem
                to="/features/upload-media"
                $active={isActive("/features/upload-media")}
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
      </Panel>
    </>
  );
}

export default CloudMenu;
