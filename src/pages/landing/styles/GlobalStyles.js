import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    background: ${({ theme }) => theme.colors.bg};
  }

  body {
    font-family: ${({ theme }) => theme.fonts.display};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    line-height: 1.6;
  }

  h1, h2, h3 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Focus states for keyboard accessibility */
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid #2d8cf0;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Keyframe Animations */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes waterFlow {
    from { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes dataFlow {
    from { stroke-dashoffset: 16; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes sonarPulse {
    0% {
      r: 12;
      opacity: 0.4;
    }
    100% {
      r: 40;
      opacity: 0;
    }
  }

  @keyframes sensorGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes waveMove {
    from { transform: translateX(0); }
    to { transform: translateX(-40px); }
  }
`;
