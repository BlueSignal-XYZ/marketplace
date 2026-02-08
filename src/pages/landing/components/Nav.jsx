import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { trackCTA } from '../utils/analytics';

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
  -webkit-backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(40px)' : 'none'};
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

  ${({ theme }) => theme.media.sm} {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  ${({ theme }) => theme.media.md} {
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

  ${({ theme }) => theme.media.md} {
    display: none;
  }
`;

/* ---- Mobile Menu ---- */

const HamburgerBtn = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1002;

  ${({ theme }) => theme.media.md} {
    display: flex;
  }
`;

const HamburgerIcon = styled.div`
  width: 22px;
  height: 14px;
  position: relative;

  span {
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 1px;
    transition: transform 0.3s ${({ theme }) => theme.ease},
                opacity 0.3s ${({ theme }) => theme.ease};

    &:nth-child(1) {
      top: 0;
      ${({ $open }) => $open && 'transform: translateY(6px) rotate(45deg);'}
    }
    &:nth-child(2) {
      top: 6px;
      ${({ $open }) => $open && 'opacity: 0;'}
    }
    &:nth-child(3) {
      top: 12px;
      ${({ $open }) => $open && 'transform: translateY(-6px) rotate(-45deg);'}
    }
  }
`;

const MobileOverlay = styled.div`
  display: none;

  ${({ theme }) => theme.media.md} {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(8, 9, 10, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition: opacity 0.3s ${({ theme }) => theme.ease},
                visibility 0.3s ${({ theme }) => theme.ease};
  }
`;

const MobileMenu = styled.div`
  display: none;

  ${({ theme }) => theme.media.md} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 1001;
    padding: 100px 24px 60px;
    gap: 8px;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-12px)')};
    transition: opacity 0.35s ${({ theme }) => theme.ease},
                visibility 0.35s ${({ theme }) => theme.ease},
                transform 0.35s ${({ theme }) => theme.ease};
  }
`;

const MobileLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.w70};
  padding: 14px 0;
  text-decoration: none;
  transition: color 0.2s, opacity 0.3s, transform 0.3s;
  transition-delay: ${({ $index }) => ($index || 0) * 0.05}s;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-8px)')};

  &:hover, &:active {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const MobileCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 14px 32px;
  border-radius: 100px;
  text-decoration: none;
  margin-top: 24px;
  width: 100%;
  max-width: 280px;
  transition: opacity 0.3s, transform 0.3s;
  transition-delay: ${({ $index }) => ($index || 0) * 0.05}s;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-8px)')};
`;

const mobileLinks = [
  { href: '#sensors', label: 'Sensors' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#installation', label: 'Installation' },
  { href: '#specs', label: 'Specs' },
  { href: 'https://cloud.bluesignal.xyz', label: 'Cloud', external: true },
  { href: 'https://waterquality.trading', label: 'WQT', external: true },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLinkClick = (eventLabel) => {
    closeMenu();
    if (eventLabel) trackCTA(eventLabel, 'Nav');
  };

  return (
    <>
      <NavBar $scrolled={scrolled || menuOpen} aria-label="Main navigation">
        <NavInner>
          <Brand href="/">
            <LogoSvg />
            <BrandName>BlueSignal</BrandName>
            <ModelBadge>WQM-1</ModelBadge>
          </Brand>

          <NavLinks>
            <NavLink href="#sensors">Sensors</NavLink>
            <NavLink href="#architecture">Architecture</NavLink>
            <NavLink href="#installation">Installation</NavLink>
            <NavLink href="#specs">Specs</NavLink>
            <NavLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('external_cloud', 'Nav')}>Cloud</NavLink>
            <NavLink href="https://waterquality.trading" target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('external_wqt', 'Nav')}>WQT</NavLink>
          </NavLinks>

          <CTAButton href="#order" onClick={() => trackCTA('order_devkit_hero', 'Nav CTA')}>Order Dev Kit</CTAButton>

          <HamburgerBtn
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <HamburgerIcon $open={menuOpen}>
              <span />
              <span />
              <span />
            </HamburgerIcon>
          </HamburgerBtn>
        </NavInner>
      </NavBar>

      <MobileOverlay $open={menuOpen} onClick={closeMenu} />
      <MobileMenu
        $open={menuOpen}
        role="dialog"
        aria-modal={menuOpen ? 'true' : undefined}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
      >
        {mobileLinks.map((link, i) => (
          <MobileLink
            key={link.href}
            href={link.href}
            $index={i}
            $open={menuOpen}
            onClick={() => handleLinkClick(link.external ? `external_${link.label.toLowerCase()}` : undefined)}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link.label}
          </MobileLink>
        ))}
        <MobileCTA
          href="#order"
          $index={mobileLinks.length}
          $open={menuOpen}
          onClick={() => handleLinkClick('order_devkit_hero')}
        >
          Order Dev Kit
        </MobileCTA>
      </MobileMenu>
    </>
  );
};

export default Nav;
