// /src/components/navigation/CloudMenu.jsx
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function CloudMenu({ open, onClose, user }) {
  const navigate = useNavigate();

  if (!user?.uid) return null;

  const go = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />
      <Drawer $open={open} onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <span>BlueSignal Monitoring</span>
          <CloseBtn onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseBtn>
        </DrawerHeader>

        <NavList>
          <NavItem onClick={() => go("/dashboard/main")}>
            Dashboard
          </NavItem>

          <SectionTitle>Tools</SectionTitle>

          <NavItem onClick={() => go("/features/nutrient-calculator")}>
            Nutrient Calculator
          </NavItem>

          <NavItem onClick={() => go("/features/verification")}>
            Verification
          </NavItem>

          <NavItem onClick={() => go("/features/stream")}>
            Broadcast Live
          </NavItem>

          <NavItem onClick={() => go("/features/upload-media")}>
            Upload Media
          </NavItem>
        </NavList>
      </Drawer>
    </>
  );
}

/* ------------------- Styled Components ------------------- */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28); /* translucent overlay ONLY behind the menu */
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 0.25s ease-out;
  z-index: 9500;
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  left: ${({ $open }) => ($open ? "0" : "-280px")};
  height: 100vh;
  width: 260px;
  background: #ffffff; /* solid white */
  box-shadow: 3px 0px 18px rgba(15, 23, 42, 0.22);
  z-index: 9600;

  transition: left 0.25s ease-out;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #0f172a;
`;

const NavList = styled.div`
  padding: 12px 0;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.button`
  padding: 10px 20px;
  margin: 1px 0;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  border: none;
  background: transparent;
  color: #0f172a;

  &:hover {
    background: #f1f5f9;
  }
`;

const SectionTitle = styled.div`
  margin-top: 18px;
  margin-bottom: 4px;
  padding: 0 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
`;