import PropTypes from 'prop-types';

import styled from 'styled-components';
import ProfileDropMenu from './elements/ProfileDropMenu';

/**
 * Desktop Menu Component
 *
 * @param {Object} APP - Application state and actions
 */
const DesktopMenu = ({ APP }) => {
  return (
    <DesktopMenuContainer>
      <ProfileDropMenu APP={APP} />
    </DesktopMenuContainer>
  );
};

DesktopMenu.propTypes = {
  APP: PropTypes.object.isRequired,
};

const DesktopMenuContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding-right: 20px;
`;

export default DesktopMenu;
