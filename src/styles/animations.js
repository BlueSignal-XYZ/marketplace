// /src/styles/animations.js
// Reusable animation utilities and keyframes

import { css, keyframes } from "styled-components";

// ===== KEYFRAMES =====

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Subtle pop-in for cards and modals
export const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(8px);
  }
  70% {
    transform: scale(1.02) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Elegant slide for sidebars/drawers
export const slideInSmooth = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Subtle pulse for notification badges
export const softPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.85;
  }
`;

// Gentle floating effect for featured elements
export const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

// Subtle bounce for buttons on success
export const successBounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1.02);
  }
`;

export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Rainbow border animation for premium/featured items
export const borderGlow = keyframes`
  0%, 100% {
    border-color: rgba(56, 189, 190, 0.5);
    box-shadow: 0 0 12px rgba(56, 189, 190, 0.2);
  }
  50% {
    border-color: rgba(56, 189, 190, 0.8);
    box-shadow: 0 0 20px rgba(56, 189, 190, 0.4);
  }
`;

// Checkmark draw animation
export const drawCheck = keyframes`
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

// ===== ANIMATION MIXINS =====

// Duration presets
const durations = {
  instant: "0.1s",
  fast: "0.15s",
  normal: "0.25s",
  slow: "0.4s",
  glacial: "0.6s",
};

// Easing presets
const easings = {
  ease: "ease-out",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  snappy: "cubic-bezier(0.2, 0.8, 0.2, 1)",
};

// Apply animation with defaults
export const animate = (
  animation,
  duration = "normal",
  easing = "ease",
  delay = "0s",
  fillMode = "forwards"
) => css`
  animation: ${animation} ${durations[duration] || duration}
    ${easings[easing] || easing} ${delay} ${fillMode};
`;

// Stagger delay helper for list items
export const staggerDelay = (index, baseDelay = 0.05) => css`
  animation-delay: ${index * baseDelay}s;
`;

// ===== TRANSITION MIXINS =====

export const transition = {
  fast: css`
    transition: all 0.15s ease-out;
  `,
  normal: css`
    transition: all 0.2s ease-out;
  `,
  slow: css`
    transition: all 0.3s ease-out;
  `,
  spring: css`
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `,
  snappy: css`
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  `,
  // Specific property transitions
  color: css`
    transition: color 0.15s ease-out, background-color 0.15s ease-out,
      border-color 0.15s ease-out;
  `,
  transform: css`
    transition: transform 0.2s ease-out;
  `,
  opacity: css`
    transition: opacity 0.2s ease-out;
  `,
  shadow: css`
    transition: box-shadow 0.2s ease-out;
  `,
};

// ===== HOVER EFFECTS =====

export const hoverLift = css`
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Enhanced lift with subtle glow
export const hoverLiftGlow = css`
  transition: transform 0.2s ease-out, box-shadow 0.25s ease-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 12px 28px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(56, 189, 190, 0.1);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const hoverScale = css`
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Subtle scale for icons/buttons
export const hoverScaleSubtle = css`
  transition: transform 0.15s ease-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const hoverGlow = (color = "rgba(56, 189, 190, 0.4)") => css`
  transition: box-shadow 0.2s ease-out;

  &:hover {
    box-shadow: 0 0 20px ${color};
  }
`;

export const hoverBrighten = css`
  transition: filter 0.2s ease-out;

  &:hover {
    filter: brightness(1.05);
  }
`;

// Border highlight effect
export const hoverBorderHighlight = css`
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;

  &:hover {
    border-color: var(--color-primary-300, #5DC9CC);
    box-shadow: 0 0 0 3px rgba(56, 189, 190, 0.1);
  }
`;

// ===== FOCUS STATES =====

export const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--color-primary-400, #38BDBE);
    outline-offset: 2px;
  }
`;

export const focusRingInset = css`
  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--color-primary-400, #38BDBE);
  }
`;

// ===== LOADING STATES =====

export const skeleton = css`
  background: linear-gradient(
    90deg,
    var(--color-ui-100, #f4f5f7) 25%,
    var(--color-ui-200, #e5e7eb) 50%,
    var(--color-ui-100, #f4f5f7) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

// Enhanced skeleton with subtle color
export const skeletonPrimary = css`
  background: linear-gradient(
    90deg,
    rgba(56, 189, 190, 0.05) 25%,
    rgba(56, 189, 190, 0.1) 50%,
    rgba(56, 189, 190, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

export const loadingSpinner = css`
  animation: ${spin} 1s linear infinite;
`;

export const loadingPulse = css`
  animation: ${pulse} 2s ease-in-out infinite;
`;

// ===== ENTRANCE ANIMATIONS FOR LISTS =====

export const listItemEntrance = (index) => css`
  opacity: 0;
  animation: ${fadeInUp} 0.3s ease-out forwards;
  animation-delay: ${index * 0.05}s;
`;

// Card entrance with pop effect
export const cardEntrance = (index = 0) => css`
  opacity: 0;
  animation: ${popIn} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${index * 0.08}s;
`;

// ===== INTERACTIVE FEEDBACK =====

// Press effect for buttons
export const pressEffect = css`
  transition: transform 0.1s ease-out;

  &:active {
    transform: scale(0.97);
  }
`;

// Ripple effect placeholder (requires JS to position)
export const rippleBase = css`
  position: relative;
  overflow: hidden;

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
  }

  &:active::after {
    width: 200%;
    height: 200%;
    opacity: 1;
    transition: 0s;
  }
`;

// ===== SECTION ANIMATIONS =====

// Staggered section entrance
export const sectionEntrance = css`
  opacity: 0;
  animation: ${fadeInUp} 0.4s ease-out forwards;
`;

// ===== REDUCED MOTION =====

export const respectReducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;
