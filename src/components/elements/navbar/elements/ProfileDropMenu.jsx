import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faUser, faVideo, faCog, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {useAppContext} from '../../../../context/AppContext';

/**
 * ProfileDropMenu Component
 */
const ProfileDropMenu = () => {
  const { STATES, ACTIONS } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = STATES || {};
  const { handleSettingsTab, handleLogOut } = ACTIONS || {};

  const handleSettings = (action) => {
    // action type handled
    setIsOpen(false);
    if (typeof action === 'string' && action.startsWith('/')) {
      navigate(action);
    } else if(typeof action === 'function') {
      action();
    } else {
      handleSettingsTab(action);
    }
  };

  const username = user?.username || user?.email || 'Guest';

  const variants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 }
  };

  const menuItems = [

    { label: 'Settings', icon: faCog, action: 'Profile Settings' },
    { label: 'Logout', icon: faSignOutAlt, action: () => handleLogOut()}
  ];

  return (
    <UserProfile>
      <ProfileDropMenuContainer onClick={() => setIsOpen(!isOpen)}>
        {
          user && (
        <ProfileWrap>
        <ProfileImage>
          {user.username?.charAt(0).toUpperCase()}
        </ProfileImage>
        <ProfileNameWrap>

        <ProfileName>{username}</ProfileName>
        {
          user?.type && (
            <ProfileType>
          {user.type.toLowerCase()}
        </ProfileType>
             
            )
          }
          </ProfileNameWrap>
          </ProfileWrap>
            
          )
        }
        <FontAwesomeIcon icon={faCaretDown} size="lg" />
      </ProfileDropMenuContainer>

      <AnimatePresence>
        {isOpen && (
          <ProfileDropMenuItems initial="closed" animate="open" exit="closed" variants={variants}>
            {menuItems.map(({ label, icon, action }) => (
              <ListItem key={label} onClick={() => handleSettings(action)}>
                <FontAwesomeIcon icon={icon} />
                {label}
              </ListItem>
            ))}
          </ProfileDropMenuItems>
        )}
      </AnimatePresence>
    </UserProfile>
  );
};

const UserProfile = styled.div`
  position: relative;
`;


const ProfileNameWrap = styled.div`
display: flex;
flex-direction: column;
text-align: left; 
gap:2px;
`

const ProfileWrap = styled.div`
display: flex;
align-items: center;
gap:8px
`

const ProfileImage = styled.div`
height: 40px; 
width: 40px;
border-radius: 50%;
background: ${({theme}) => theme.colors.ui200};
display: inline-flex;
align-items: center;
justify-content: center;
`

const ProfileName = styled.div`
text-transform: capitalize;
`
const ProfileType = styled.div`
color: ${({theme}) => theme.colors.ui800};
font-weight: 500;
text-transform: capitalize;
font-size: 12px;
`
const ProfileDropMenuContainer = styled.button`
  background: none;
  position: relative;
  border: none;
  color: ${props => props.theme.colors.primary500};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  padding: 8px 0px;
  font-weight: 600;
  font-size: 14px;
  svg { 
    color: ${({theme}) => theme.colors.ui500}
  }
  :hover {
     background: none;
     border: none;
  }
`;

const ProfileDropMenuItems = styled(motion.div)`
  position: absolute;
  width: 250px;
  bottom: 102%;
  left: 0;
  z-index: 9999;
  background-color: white;
  border-radius: 4px;
  box-shadow: ${({theme}) => theme.boxShadow.light};
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap:16px; 
  font-weight: 500;
  color: ${props => props.theme.colors.primary700};
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.colors.ui100}
  }
`;

export default ProfileDropMenu;
