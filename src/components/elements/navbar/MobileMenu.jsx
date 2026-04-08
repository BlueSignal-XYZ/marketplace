import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBell,
  faBellSlash,
  faClose,
  faGear,
  faGears,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import ProfileDropMenu from './elements/ProfileDropMenu';
import { BUTTON } from '../../lib/styled';

/**
 * MobileMenu Component
 * @param {Object} APP - Application states and actions
 */
const MobileMenu = ({ APP }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notificationBarOpen, sidebarOpen, settingsMenuOpen } = APP ? APP.STATES : {};
  const { handleNotificationsBar, handleSettingsMenu, handleLogOut } = APP ? APP.ACTIONS : {};

  const handleAction = useCallback((action) => {
    setIsOpen(false);
    setTimeout(() => {
      action();
    }, 300); // Delay for smooth transition
  }, []);

  // Framer Motion Variants
  const sideMenuVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const linkVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.3 } },
  };

  return (
    <MobileMenuContainer>
      <MenuIcon
        icon={isOpen ? faClose : faBars}
        onClick={() => setIsOpen(!isOpen)}
        sidebarOpen={sidebarOpen}
      />
      <AnimatePresence>
        {isOpen && (
          <SideMenu initial="closed" animate="open" exit="closed" variants={sideMenuVariants}>
            <MenuSection>
              <ProfileDropMenu APP={APP} />
            </MenuSection>

            <MenuSection>
              <MenuItem onClick={() => handleAction(handleNotificationsBar)}>
                <MenuItemIcon icon={notificationBarOpen ? faBellSlash : faBell} />
              </MenuItem>
              <MenuItem onClick={() => handleAction(handleSettingsMenu)}>
                <MenuItemIcon icon={settingsMenuOpen ? faGear : faGears} />
              </MenuItem>
            </MenuSection>

            <MenuSection>
              <BUTTON whileHover={{ scale: 1.05 }} onClick={() => handleAction(handleLogOut)}>
                Logout
              </BUTTON>
            </MenuSection>

            <FooterLinks variants={linkVariants}>
              <Link href="#home">Home</Link>
              <Link href="#features">Features</Link>
              <Link href="#contact">Contact</Link>
            </FooterLinks>
          </SideMenu>
        )}
      </AnimatePresence>
    </MobileMenuContainer>
  );
};

MobileMenu.propTypes = {
  APP: PropTypes.shape({
    STATES: PropTypes.object,
    ACTIONS: PropTypes.object,
  }).isRequired,
};

const MobileMenuContainer = styled.div`
  display: none;
  opacity: 0;
  transition: all 0.3s ease;

  @media (max-width: 767px) {
    display: flex;
    opacity: 1;
  }
`;

const MenuIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
  transition: color 0.3s ease;
  ${({ sidebarOpen }) =>
    sidebarOpen &&
    `
  right: 10px;
  `}
  z-index: 9999;

  &:hover {
    scale: 1.01;
  }
`;

const SideMenu = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  // max-width: 400px;
  height: 100vh;
  align-items: flex-start;
  background-color: #fff;
  box-shadow: -5px 0px 15px rgba(0, 0, 0, 0.2);
  z-index: 20;
  box-sizing: border-box;
  overflow: visible;
  padding: 2rem;
  padding-top: 3rem;
  font-family: 'Arial', sans-serif;
  box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.4);
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
`;

const MenuItemIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: #333;
`;

const FooterLinks = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Link = styled.a`
  text-decoration: none;
  color: #333;
  padding: 10px 0;
  font-size: 1.1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
`;

export default MobileMenu;
