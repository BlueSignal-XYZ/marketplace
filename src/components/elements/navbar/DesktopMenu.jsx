import PropTypes from 'prop-types';

import styled from 'styled-components';
import { ProfileDropMenu } from './elements';
import { motion } from 'framer-motion';

const iconVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

/**
 * Desktop Menu Component
 *
 * @param {Object} APP - Application state and actions
 */
const DesktopMenu = ({ APP }) => {
  const { notificationBarOpen, settingsMenuOpen } = APP ? APP.STATES : {};

  const { handleNotificationsBar, handleSettingsMenu, handleLogOut } = APP ? APP.ACTIONS : {};

  return (
    <DesktopMenuContainer>
      {/* Notification Icon */}
      {/* <IconContainer whileHover='hover' whileTap="tap">
        <FontAwesomeIcon
          icon={notificationBarOpen ? faBellSlash : faBell}
          onClick={handleNotificationsBar}
        />
      </IconContainer> */}

      {/* Profile DropMenu */}
      <ProfileDropMenu APP={APP} />
    </DesktopMenuContainer>
  );
};

DesktopMenu.propTypes = {
  APP: PropTypes.object.isRequired,
};

const DesktopMenuContainer = styled.div`
  // width: 100%;
  // display: flex;
  // height: 25px;
  // align-items: center;
  // justify-content: flex-end;
  // gap: 10px;

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding-right: 20px;

  // @media (max-width: 767px) {
  //   display: none;
  // }
`;

const IconContainer = styled(motion.div)`
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const LogOutButton = styled(motion.button)`
  color: black;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #007bff;
    background-color: #f8f9fa;
  }
`;

export default DesktopMenu;
