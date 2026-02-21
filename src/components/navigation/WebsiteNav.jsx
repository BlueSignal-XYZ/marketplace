/**
 * WebsiteNav — clean, minimal navigation for WQT marketing/content pages.
 * Dark/transparent background that blends with the dark hero sections.
 * Used on: /contact, /for-utilities, /for-homeowners, /for-aggregators, /terms, /privacy
 */

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const NavOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: rgba(11, 17, 32, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  animation: ${fadeIn} 0.3s ease-out;
`;

const NavInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (min-width: 768px) {
    height: 72px;
  }

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const NavLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 4px;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const NavLink = styled.a`
  padding: 8px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || "inherit"};
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const CTALink = styled.a`
  display: none;
  align-items: center;
  padding: 8px 20px;
  font-family: ${({ theme }) => theme.fonts?.sans || "inherit"};
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  background: rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 8px;
  text-decoration: none;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    background: rgba(14, 165, 233, 0.25);
    border-color: rgba(14, 165, 233, 0.5);
  }

  @media (min-width: 1024px) {
    display: inline-flex;
  }
`;

const MobileMenuBtn = styled.button`
  height: 44px;
  width: 44px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  transition: all 0.2s;

  &:hover {
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: ${({ $open }) => ($open ? "flex" : "none")};
  flex-direction: column;
  gap: 4px;
  padding: 12px 24px 20px;
  background: rgba(11, 17, 32, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileNavLink = styled.a`
  display: block;
  padding: 12px 16px;
  font-family: ${({ theme }) => theme.fonts?.sans || "inherit"};
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;

  &:hover {
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.06);
  }
`;

const MobileCTA = styled.a`
  display: block;
  padding: 14px 16px;
  margin-top: 8px;
  font-family: ${({ theme }) => theme.fonts?.sans || "inherit"};
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  background: rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  transition: all 150ms;

  &:hover {
    background: rgba(14, 165, 233, 0.25);
  }
`;

// Light logo for dark nav background
const WQTLogoLight = () => (
  <svg
    width="200"
    height="32"
    viewBox="0 0 320 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M24 4C24 4 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 4 24 4Z"
        fill="#3B82F6"
      />
      <path
        d="M16 30L20 26L24 32L28 24L32 28"
        stroke="#0EA5E9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 34L23 37L29 31"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
    <text
      x="50"
      y="32"
      fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="22"
      fill="#F1F5F9"
    >
      <tspan fontWeight="700">WaterQuality</tspan>
      <tspan fontWeight="400" fill="#0EA5E9">
        .Trading
      </tspan>
    </text>
  </svg>
);

const NAV_LINKS = [
  { label: "How It Works", href: "/#credit-definitions" },
  { label: "For Utilities", href: "/for-utilities" },
  { label: "For Homeowners", href: "/for-homeowners" },
  { label: "For Aggregators", href: "/for-aggregators" },
  { label: "Registry", href: "/registry" },
];

export function WebsiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <NavOuter>
        <NavInner>
          <LogoLink href="/" aria-label="WaterQuality.Trading">
            <WQTLogoLight />
          </LogoLink>

          <NavLinks>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </NavLinks>

          <CTALink href="/contact">Contact Us</CTALink>

          <MobileMenuBtn
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
          </MobileMenuBtn>
        </NavInner>
      </NavOuter>

      <MobileMenu $open={mobileOpen}>
        {NAV_LINKS.map((link) => (
          <MobileNavLink
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </MobileNavLink>
        ))}
        <MobileCTA href="/contact" onClick={() => setMobileOpen(false)}>
          Contact Us
        </MobileCTA>
      </MobileMenu>
    </>
  );
}
