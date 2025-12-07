import { createGlobalStyle } from "styled-components";
import SatoshiNormal from "../fonts/Satoshi-Regular.woff2";
import SatoshiMedium from "../fonts/Satoshi-Medium.woff2";
import SatoshiBold from "../fonts/Satoshi-Bold.woff2";
import { media, safeAreaInsets } from "./breakpoints";

export const GlobalStyle = createGlobalStyle`

    @font-face {
        font-family: "Satoshi";
        src: url(${SatoshiNormal}) format("woff2");
        font-weight: 400;
    }
    @font-face {
        font-family: "Satoshi";
        src: url(${SatoshiMedium}) format("woff2");
        font-weight: 500;
    }


    @font-face {
        font-family: "Satoshi";
        src: url(${SatoshiBold}) format("woff2");
        font-weight: 600;
    }

    /* CSS Custom Properties for mobile-friendly values */
    :root {
        /* Touch target minimum size */
        --touch-target-min: 44px;

        /* Safe area insets */
        --safe-area-top: ${safeAreaInsets.top};
        --safe-area-right: ${safeAreaInsets.right};
        --safe-area-bottom: ${safeAreaInsets.bottom};
        --safe-area-left: ${safeAreaInsets.left};

        /* Mobile-first spacing scale */
        --space-xs: 8px;
        --space-sm: 12px;
        --space-md: 16px;
        --space-lg: 24px;
        --space-xl: 32px;

        /* Mobile-first font sizes */
        --font-xs: 12px;
        --font-sm: 14px;
        --font-base: 16px;
        --font-lg: 18px;
        --font-xl: 20px;
        --font-2xl: 24px;
        --font-3xl: 30px;
    }

    * {
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        font-family: "Satoshi", sans-serif;
    }

    html {
        /* Prevent iOS text size adjust on orientation change */
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;

        /* Smooth scrolling */
        scroll-behavior: smooth;
    }

    body {
        padding: 0px;
        margin: 0px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        /* Prevent overscroll bounce on iOS */
        overscroll-behavior-y: none;

        /* Minimum font size for mobile readability */
        font-size: 16px;

        /* Safe area padding for notched devices */
        padding-left: ${safeAreaInsets.left};
        padding-right: ${safeAreaInsets.right};
    }

    /* Typography hierarchy - mobile-first responsive */
    h1, h2, h3, h4, h5, h6 {
        margin: 0;
        font-weight: 600;
        line-height: 1.3;
    }

    h1 {
        font-size: clamp(1.5rem, 5vw, 2.5rem);
        font-weight: 700;
    }

    h2 {
        font-size: clamp(1.25rem, 4vw, 2rem);
    }

    h3 {
        font-size: clamp(1.1rem, 3vw, 1.5rem);
    }

    p {
        margin: 0;
        line-height: 1.6;
    }

    /* Touch-friendly button base styles */
    button {
        font-family: "Satoshi", sans-serif;
        border: none;
        cursor: pointer;
        transition: all 0.15s ease-out;

        /* Prevent double-tap zoom on iOS */
        touch-action: manipulation;

        /* Remove tap highlight on mobile */
        -webkit-tap-highlight-color: transparent;

        /* Minimum touch target size */
        min-height: var(--touch-target-min);
    }

    button:disabled {
        cursor: not-allowed;
    }

    /* Touch-friendly active states */
    ${media.touch} {
        button:active:not(:disabled) {
            transform: scale(0.98);
            opacity: 0.9;
        }
    }

    /* Touch-friendly form inputs */
    input, select, textarea {
        /* Prevent iOS zoom on focus (requires 16px minimum) */
        font-size: 16px;

        /* Remove tap highlight */
        -webkit-tap-highlight-color: transparent;

        /* Prevent zoom on focus */
        touch-action: manipulation;
    }

    /* Touch-friendly links */
    a {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }

    /* Prevent text selection on UI elements (optional - can be overridden) */
    button, [role="button"] {
        user-select: none;
        -webkit-user-select: none;
    }

    /* Scrollable containers touch optimization */
    .scrollable {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
    }

    /* Hide scrollbar on mobile while keeping functionality */
    ${media.mobileOnly} {
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

    /* Image optimization */
    img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    /* Focus visible for keyboard navigation only */
    :focus:not(:focus-visible) {
        outline: none;
    }

    :focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
`;
