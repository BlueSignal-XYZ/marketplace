// /src/components/shared/button/Button.jsx
import styled, { css } from "styled-components";

// Base button with enhanced styling
const Button = styled.button`
  height: ${({ theme }) => theme.formHeightMd};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0px 24px;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
  font-size: 14px;
  font-weight: 600;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  position: relative;
  overflow: hidden;

  /* Focus styles */
  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
    outline-offset: 2px;
  }

  /* Icon sizing */
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// Primary button with gradient and glow effect
export const ButtonPrimary = styled(Button)`
  background: ${({ theme }) =>
    theme.gradients?.primaryLight ||
    "linear-gradient(135deg, #38BDBE 0%, #1D7072 100%)"};
  color: white;
  box-shadow:
    0 2px 8px rgba(29, 112, 114, 0.25),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  /* Shine overlay */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    border-radius: inherit;
  }

  /* Ripple effect base */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease-out, height 0.4s ease-out, opacity 0.4s ease-out;
    opacity: 0;
    pointer-events: none;
  }

  &:active:not(:disabled)::after {
    width: 200%;
    height: 200%;
    opacity: 1;
    transition: 0s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 6px 20px rgba(29, 112, 114, 0.35),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
    box-shadow:
      0 1px 4px rgba(29, 112, 114, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    box-shadow: none;
    cursor: not-allowed;

    &::before, &::after {
      display: none;
    }
  }
`;

// Secondary button with refined border
export const ButtonSecondary = styled(Button)`
  background: white;
  color: ${({ theme }) => theme.colors?.primary600 || "#196061"};
  border: 1.5px solid ${({ theme }) => theme.colors?.primary300 || "#5DC9CC"};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.primary50 || "#E6F7F8"};
    border-color: ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(29, 112, 114, 0.15);
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors?.primary100 || "#C0EAEB"};
    transform: translateY(0);
  }

  &:disabled {
    color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
    border-color: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    background: ${({ theme }) => theme.colors?.ui50 || "#FAFAFA"};
  }
`;

// Ghost button - minimal styling
export const ButtonGhost = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  border: none;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
  }
`;

// Text link button
export const ButtonLink = styled(Button)`
  color: ${({ theme }) => theme.colors?.primary600 || "#196061"};
  padding: 0px;
  background: transparent;
  box-shadow: none;
  height: auto;
  font-weight: 500;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors?.primary700 || "#0F393A"};
    text-decoration: underline;
  }

  svg {
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    font-size: 12px;
  }
`;

// Icon button - square
export const ButtonIcon = styled(Button)`
  height: 44px;
  width: 44px;
  font-size: 18px;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
  background: ${({ theme }) => theme.colors?.ui50 || "#FAFAFA"};
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  padding: 0px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    border-color: ${({ theme }) => theme.colors?.ui300 || "#D1D5DB"};
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Danger button
export const ButtonDanger = styled(Button)`
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0) 50%
    );
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(220, 38, 38, 0.2);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    box-shadow: none;
  }
`;

// Success button
export const ButtonSuccess = styled(Button)`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0) 50%
    );
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    box-shadow: none;
  }
`;

// Outlined button
export const ButtonOutlined = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  border: 1.5px solid ${({ theme }) => theme.colors?.ui300 || "#D1D5DB"};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui50 || "#FAFAFA"};
    border-color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    transform: translateY(0);
  }

  &:disabled {
    color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
    border-color: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  }
`;

// Size variant mixins
export const ButtonSmall = css`
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  border-radius: 8px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ButtonLarge = css`
  height: 52px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 14px;

  svg {
    width: 20px;
    height: 20px;
  }
`;
