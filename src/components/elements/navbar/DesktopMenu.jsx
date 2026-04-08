import PropTypes from 'prop-types';

import styled from 'styled-components';
import { ProfileDropMenu } from './elements';

/**
 * Desktop Menu Component
 *
 * @param {Object} APP - Application state and actions
 */
const DesktopMenu = ({ APP }) => {
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

export default DesktopMenu;
