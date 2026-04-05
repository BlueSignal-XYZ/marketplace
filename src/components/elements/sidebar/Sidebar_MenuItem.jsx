import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Sidebar_MenuItem Component
 *
 * Renders a sidebar menu item with optional route navigation.
 *
 * @param {Object} props
 * @param {any} props.icon - The FontAwesome icon to display
 * @param {string} props.itemName - The label for the menu item
 * @param {string} props.route - The route to navigate to when clicked
 */
const Sidebar_MenuItem = ({ icon, itemName, route, handleSidebar, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRoute, setIsRoute] = useState(false);

  const normalizedRoute = route?.startsWith('/') ? route : `/dashboard/${route}`;

  // Effect to check if the current route matches the given route
  useEffect(() => {
    if (route) {
      setIsRoute(normalizedRoute === location.pathname);
    }
  }, [route, location]);

  /**
   * Handles the click event for navigation.
   */
  const handleClick = () => {
    if (route && typeof route === 'string' && !isRoute) {
      navigate(normalizedRoute);
    } else if (onClick) {
      onClick();
    }
    if (handleSidebar) {
      handleSidebar();
    }
  };

  return (
    <MenuItem
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
      isRoute={isRoute}
    >
      <AnimatePresence>
        {isRoute && <ActiveIndicator initial={{ scale: 0 }} animate={{ scale: 1 }} />}
      </AnimatePresence>
      <StyledIconWrap>
        <Icon icon={icon} color="#000" />
      </StyledIconWrap>
      <RouteName>{itemName}</RouteName>
    </MenuItem>
  );
};

const StyledIconWrap = styled.div`
  height: 40px;
  width: 40px;
  background: ${({ theme }) => theme.colors.ui100};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;
/**
 * ActiveIndicator Styled Component
 * Displays a visual indicator for the active menu item.
 */
const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 100%;
  background-color: #fff;
  border-radius: 50%;
  transform: translateY(-50%);
`;

/**
 * MenuItem Styled Component
 * Styles the menu item container and includes responsive design.
 */
const MenuItem = styled(motion.li)`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0px;
  cursor: pointer;
  width: 100%;
  margin: 0px;
  button {
    margin: 0px;
  }
`;

/**
 * Icon Styled Component
 * Styles the FontAwesome icon displayed in the menu item.
 */
const Icon = styled(FontAwesomeIcon)`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.ui100};
  color: ${({ theme }) => theme.colors.primary500};
`;

/**
 * RouteName Styled Component
 * Styles the label for the menu item.
 */
const RouteName = styled.span`
  height: auto;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  margin-left: 0.5rem;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export default Sidebar_MenuItem;
