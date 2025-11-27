// /src/components/navigation/MarketplaceMenu.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  z-index: 60;

  display: flex;
  justify-content: flex-end;
`;

const Panel = styled.aside`
  width: 280px;
  max-width: 80%;
  height: 100%;
  background: #ffffff;
  box-shadow: -16px 0 40px rgba(15, 23, 42, 0.32);
  padding: 20px 18px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};

  &:hover {
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }
`;

const SectionLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin-top: 8px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled.li``;

const NavButton = styled.button`
  width: 100%;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors?.primary50 || "#e0f2ff" : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors?.primary700 || "#0369a1" : theme.colors?.ui800 || "#111827"};
  text-align: left;
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors?.primary100 || "#dbeafe" : "#f3f4f6"};
  }
`;

export function MarketplaceMenu({ open, onClose, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ⛔️ IMPORTANT: don't render anything unless menu is actually open
  if (!open) return null;

  const go = (path) => {
    navigate(path);
    onClose && onClose();
  };

  const isActive = (match) => location.pathname.startsWith(match);

  const isAuthed = !!user?.uid;

  return (
    <Backdrop onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>WaterQuality.Trading</Title>
          <CloseBtn onClick={onClose} aria-label="Close menu">
            ×
          </CloseBtn>
        </Header>

        {/* Environment / tools live on the cloud app now, 
            but we keep the section for future linking if needed */}
        <SectionLabel>Environment</SectionLabel>
        <NavList>
          <NavItem>
            <NavButton
              type="button"
              onClick={() => go("/marketplace")}
              $active={isActive("/marketplace")}
            >
              Marketplace
            </NavButton>
          </NavItem>

          {isAuthed && (
            <>
              <NavItem>
                <NavButton
                  type="button"
                  onClick={() => go("/dashboard/financial")}
                  $active={isActive("/dashboard/financial")}
                >
                  Financial Dashboard
                </NavButton>
              </NavItem>
              <NavItem>
                <NavButton
                  type="button"
                  onClick={() => go("/marketplace/seller-dashboard")}
                  $active={isActive("/marketplace/seller-dashboard")}
                >
                  Seller Dashboard
                </NavButton>
              </NavItem>
            </>
          )}
        </NavList>
      </Panel>
    </Backdrop>
  );
}

export default MarketplaceMenu;