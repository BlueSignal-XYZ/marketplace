// /src/components/navigation/MarketplaceMenu.jsx
import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28); /* translucent only on underlying screen */
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 0.25s ease-out;
  z-index: 9500;
`;

const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: ${({ $open }) => ($open ? "0" : "-280px")};
  height: 100vh;
  width: 260px;
  max-width: 80%;
  background: #ffffff; /* solid white, no translucence */
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.22);
  z-index: 9600;

  transition: right 0.25s ease-out;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};

  span {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.ui600};
  }
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  padding: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.ui700};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary500};
  }
`;

const List = styled.nav`
  padding: 12px 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionLabel = styled.div`
  padding: 10px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ui500};
`;

const ItemLink = styled(Link)`
  display: block;
  padding: 10px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;

  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary700 : theme.colors.ui800};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary50 : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.colors.ui100};
  }
`;

export function MarketplaceMenu({ open, onClose, user }) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (prefix) =>
    path === prefix || path.startsWith(prefix + "/");

  const handleClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />

      <Panel $open={open} onClick={(e) => e.stopPropagation()}>
        <Header>
          <span>Marketplace</span>
          <CloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </Header>

        <List>
          <SectionLabel>Trading</SectionLabel>

          <ItemLink
            to="/marketplace"
            $active={isActive("/marketplace") && !isActive("/marketplace/seller-dashboard")}
            onClick={handleClick}
          >
            Marketplace
          </ItemLink>

          {user?.uid && (
            <>
              <ItemLink
                to="/marketplace/seller-dashboard"
                $active={isActive("/marketplace/seller-dashboard")}
                onClick={handleClick}
              >
                Seller Dashboard
              </ItemLink>

              <ItemLink
                to="/dashboard/financial"
                $active={isActive("/dashboard/financial")}
                onClick={handleClick}
              >
                Financial Dashboard
              </ItemLink>
            </>
          )}

          <SectionLabel>Registry</SectionLabel>

          <ItemLink
            to="/registry"
            $active={isActive("/registry")}
            onClick={handleClick}
          >
            Registry
          </ItemLink>

          <ItemLink
            to="/recent-removals"
            $active={isActive("/recent-removals")}
            onClick={handleClick}
          >
            Recent Removals
          </ItemLink>

          <ItemLink
            to="/map"
            $active={isActive("/map")}
            onClick={handleClick}
          >
            Map
          </ItemLink>

          <ItemLink
            to="/presale"
            $active={isActive("/presale")}
            onClick={handleClick}
          >
            Presale
          </ItemLink>
        </List>
      </Panel>
    </>
  );
}