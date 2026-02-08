import { useState, useEffect } from 'react';
import styled from 'styled-components';

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  background: ${({ $scrolled }) => $scrolled ? 'rgba(8,9,10,0.8)' : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(40px)' : 'none'};
  border-bottom: 1px solid ${({ $scrolled, theme }) => $scrolled ? theme.colors.w08 : 'transparent'};
`;

const NavInner = styled.div`
  max-width: 1320px;
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;

const LogoSvg = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 8 C8 5, 16 5, 24 8" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 14 C8 11, 16 11, 24 14" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 20 C8 17, 16 17, 24 20" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

const BrandName = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.white};
`;

const ModelBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.w50};
  background: ${({ theme }) => theme.colors.w04};
  padding: 3px 8px;
  border-radius: 100px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.w50};
  transition: color 0.2s;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const CTAButton = styled.a`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 8px 20px;
  border-radius: 100px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 0 20px rgba(255,255,255,0.15);
  }
`;

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <NavBar $scrolled={scrolled}>
      <NavInner>
        <Brand href="#top">
          <LogoSvg />
          <BrandName>BlueSignal</BrandName>
          <ModelBadge>WQM-1</ModelBadge>
        </Brand>

        <NavLinks>
          <NavLink href="#sensors">Sensors</NavLink>
          <NavLink href="#architecture">Architecture</NavLink>
          <NavLink href="#installation">Installation</NavLink>
          <NavLink href="#specs">Specs</NavLink>
          <NavLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener noreferrer">Cloud</NavLink>
          <NavLink href="https://waterquality.trading" target="_blank" rel="noopener noreferrer">WQT</NavLink>
        </NavLinks>

        <CTAButton href="#order">Order Dev Kit</CTAButton>
      </NavInner>
    </NavBar>
  );
};

export default Nav;
