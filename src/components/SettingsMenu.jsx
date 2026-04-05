import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faClose, faUser, faUserGear } from '@fortawesome/free-solid-svg-icons';
import ProfileSettingsTab from './elements/setting-tabs/ProfileSettings';
import { AccountSettingsTab, DataSettingsTab, PrivacySettingsTab } from './elements/setting-tabs';
import { useAppContext } from '../context/AppContext';

/**
 * SettingsMenu Component to render setting tabs
 */
const SettingsMenu = () => {
  const { STATES, ACTIONS } = useAppContext();
  const { user, settingsTab, settingsMenuOpen } = STATES || {};
  const { handleSettingsTab, handleSettingsMenu } = ACTIONS || {};

  if (!user || !settingsMenuOpen) {
    return;
  }

  const tabData = [
    {
      name: 'Profile Settings',
      icon: faUser,
      component: <ProfileSettingsTab />,
    },
    {
      name: 'Account Settings',
      icon: faUserGear,
      component: (
        <>
          <PrivacySettingsTab />
          <DataSettingsTab />
          <AccountSettingsTab />
        </>
      ),
    },
  ];

  const activeComponent = tabData.find((tab) => tab.name === settingsTab)?.component;

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Responsive dropdown for mobile view */}
      <DropdownContainer>
        <TabDropdown value={settingsTab} onChange={(e) => handleSettingsTab(e.target.value)}>
          {tabData.map((tab, index) => (
            <option key={index} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </TabDropdown>
        <DropdownIcon icon={faChevronUp} />
      </DropdownContainer>

      <Menu role="dialog" aria-labelledby="settingsMenuTitle">
        <ExitIcon
          icon={faClose}
          color="#fff"
          onClick={handleSettingsMenu}
          aria-label="Close settings menu"
          tabIndex="0"
        />
        <TabList role="tablist">
          {tabData.map((tab, index) => (
            <Tab
              key={index}
              active={tab.name === settingsTab}
              onClick={() => handleSettingsTab(tab.name)}
              role="tab"
              tabIndex="0"
              aria-selected={tab.name === settingsTab}
            >
              {tab?.icon && <TabIcon icon={tab.icon} />}
              {tab.name}
            </Tab>
          ))}
        </TabList>
        <Content role="tabpanel">{activeComponent}</Content>
      </Menu>
    </Container>
  );
};

const Container = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const DropdownContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
`;

const TabDropdown = styled.select`
  padding: 12px 40px 12px 15px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  appearance: none;
  background-color: #f7f7f7;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;

  &:focus {
    outline: none;
    border-color: #63c3d1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: -1;
  }
`;

const DropdownIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const Menu = styled(motion.div)`
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  height: 90%;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  overflow: hidden;
  background: white;
  overflow-y: auto;
  @media (min-width: 769px) {
    max-width: 800px;
    max-height: 80vh;
  }
`;

const TabList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Tab = styled(motion.div)`
  // flex-grow: 1;
  text-align: center;
  cursor: pointer;
  padding: 15px;
  font-weight: 500;
  color: ${(props) => (props.active ? '#fff' : props.theme.colors.ui800)};
  background-color: ${(props) => (props.active ? props.theme.colors.primary500 : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
  }

  @media (max-width: 768px) {
    // flex: 1 0 auto;
  }
`;

const TabIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const Content = styled.div`
  padding: 40px 0px;
  overflow-y: auto;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ExitIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 16px;
  right: 24px;
  padding: 8px;
  font-size: 16px;
  color: ${(props) => props.theme.colors.ui600};
  // background-color: #222;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    scale: 1.1;
    color: #f00;
  }
`;

export default SettingsMenu;
