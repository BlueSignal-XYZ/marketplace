import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

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
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#63c3d1');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <PersonalizationContainer>
      <OptionGroup>
        <OptionLabel>Dark Mode:</OptionLabel>
        <ThemeToggle onClick={() => setDarkMode(!darkMode)}>
          <FontAwesomeIcon
            icon={darkMode ? faToggleOn : faToggleOff}
            size="2x"
            color={darkMode ? '#63c3d1' : '#aaa'}
          />
        </ThemeToggle>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Primary Color:</OptionLabel>
        <ColorPicker value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Animations:</OptionLabel>
        <ToggleButton onClick={() => setAnimationsEnabled(!animationsEnabled)}>
          <FontAwesomeIcon
            icon={animationsEnabled ? faToggleOn : faToggleOff}
            size="2x"
            color={animationsEnabled ? '#63c3d1' : '#aaa'}
          />
        </ToggleButton>
      </OptionGroup>
    </PersonalizationContainer>
  );
};

export default PersonalizationTab;
