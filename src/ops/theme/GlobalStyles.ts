import { createGlobalStyle } from 'styled-components';

export const OpsGlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
    line-height: 1.5;
    height: 100%;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  /* Prevent iOS Safari from auto-zooming on input focus (anything < 16px
     triggers zoom). Covers iPhone (all sizes) and iPad portrait. */
  @media (max-width: 1024px) {
    input, select, textarea {
      font-size: 16px;
    }
  }

  #root {
    height: 100%;
    display: flex;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }

  button, select, input, textarea {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
  }
`;
