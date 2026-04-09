import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '../../shared/button/Button';
import { useAppContext } from '../../../context/AppContext';
import { UserProfileAPI } from '../../../scripts/back_door';

const PersonalizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
`;

const OptionGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const OptionLabel = styled.label`
  font-weight: bold;
  color: #333;
  margin-right: 10px;
`;

const ThemeToggle = styled(motion.div)`
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ColorPicker = styled.input.attrs({
  type: 'color',
})`
  padding: 5px;
  cursor: pointer;
`;

const ToggleButton = styled(motion.div)`
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const PersonalizationTab = ({ APP: _APP }) => {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};
  const { logNotification } = ACTIONS || {};

  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#63c3d1');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load personalization settings from backend on mount
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    UserProfileAPI.get(user.uid)
      .then((data) => {
        const prefs = data?.personalization;
        if (prefs) {
          if (prefs.darkMode !== undefined) setDarkMode(prefs.darkMode);
          if (prefs.primaryColor) setPrimaryColor(prefs.primaryColor);
          if (prefs.animationsEnabled !== undefined) setAnimationsEnabled(prefs.animationsEnabled);
        }
      })
      .catch(() => {
        // Use defaults on error
      })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await UserProfileAPI.update(user.uid, {
        personalization: {
          darkMode,
          primaryColor,
          animationsEnabled,
        },
      });
      logNotification?.('success', 'Personalization settings saved!');
    } catch {
      logNotification?.('error', 'Failed to save personalization settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PersonalizationContainer>
      <OptionGroup>
        <OptionLabel>Dark Mode:</OptionLabel>
        <ThemeToggle onClick={() => !loading && setDarkMode(!darkMode)}>
          <FontAwesomeIcon
            icon={darkMode ? faToggleOn : faToggleOff}
            size="2x"
            color={darkMode ? '#63c3d1' : '#aaa'}
          />
        </ThemeToggle>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Primary Color:</OptionLabel>
        <ColorPicker
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          disabled={loading}
        />
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Animations:</OptionLabel>
        <ToggleButton onClick={() => !loading && setAnimationsEnabled(!animationsEnabled)}>
          <FontAwesomeIcon
            icon={animationsEnabled ? faToggleOn : faToggleOff}
            size="2x"
            color={animationsEnabled ? '#63c3d1' : '#aaa'}
          />
        </ToggleButton>
      </OptionGroup>

      <ButtonPrimary
        onClick={handleSave}
        disabled={saving || loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </ButtonPrimary>
    </PersonalizationContainer>
  );
};

export default PersonalizationTab;
