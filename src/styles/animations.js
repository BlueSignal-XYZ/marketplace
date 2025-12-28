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

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
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

// ===== ANIMATION MIXINS =====

// Duration presets
const durations = {
  fast: "0.15s",
  normal: "0.25s",
  slow: "0.4s",
};

// Easing presets
const easings = {
  ease: "ease-out",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
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

export const hoverScale = css`
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
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

// ===== LOADING STATES =====

export const skeleton = css`
  background: linear-gradient(
    90deg,
    var(--color-ui-100) 25%,
    var(--color-ui-200) 50%,
    var(--color-ui-100) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
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

// ===== REDUCED MOTION =====

export const respectReducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;
