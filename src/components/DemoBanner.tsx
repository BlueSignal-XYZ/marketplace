import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { isDemoMode } from '../utils/demoMode';

const BannerContainer = styled.div`
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    text-align: center;
  }
`;

const BannerText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const DemoIcon = styled.span`
  font-size: 16px;
`;

const SignInLink = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.15s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: all 0.15s ease-out;

  &:hover {
    color: #ffffff;
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin-top: 4px;
  }
`;

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoMode() || dismissed) return null;

  return (
    <BannerContainer>
      <BannerText>
        <DemoIcon>Demo Mode</DemoIcon>
        <span>You're viewing sample data.</span>
        <span style={{ opacity: 0.9 }}>Sign in to connect real devices.</span>
      </BannerText>
      <SignInLink to="/">Sign in</SignInLink>
      <CloseButton onClick={() => setDismissed(true)} aria-label="Dismiss demo banner">
        x
      </CloseButton>
    </BannerContainer>
  );
}
