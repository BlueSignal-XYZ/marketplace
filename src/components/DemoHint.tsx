import React, { useState } from 'react';
import styled from 'styled-components';
import { isDemoMode, getDemoHintForScreen } from '../utils/demoMode';

const HintContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0;
`;

const HintButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #667eea;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  min-width: 24px;
  flex-shrink: 0;
  padding: 0;
  line-height: 1;
  aspect-ratio: 1;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }
`;

const HintPopup = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  color: #1a202c;
  max-width: 360px;
  white-space: normal;
  z-index: 10001;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  transition: opacity 0.2s;

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-bottom-color: white;
  }
`;

interface DemoHintProps {
  screenName: string;
  customHint?: string;
}

export function DemoHint({ screenName, customHint }: DemoHintProps) {
  const [visible, setVisible] = useState(false);

  if (!isDemoMode()) return null;

  const hint = customHint || getDemoHintForScreen(screenName);
  if (!hint) return null;

  return (
    <HintContainer>
      <HintButton
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        aria-label="Demo hint"
        aria-haspopup="true"
        aria-expanded={visible}
      >
        ?
      </HintButton>
      <HintPopup visible={visible}>
        {hint}
      </HintPopup>
    </HintContainer>
  );
}
