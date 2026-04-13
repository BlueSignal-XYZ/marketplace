import { createGlobalStyle } from 'styled-components';
import SatoshiNormal from '../fonts/Satoshi-Regular.woff2';
import SatoshiMedium from '../fonts/Satoshi-Medium.woff2';
import SatoshiBold from '../fonts/Satoshi-Bold.woff2';
import { media, safeAreaInsets } from './breakpoints';

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
        --space-xs: 4px;
        --space-sm: 8px;
        --space-md: 16px;
        --space-lg: 24px;
        --space-xl: 32px;
        --space-2xl: 48px;
        --space-3xl: 64px;

        /* Mobile-first font sizes */
        --font-xs: 12px;
        --font-sm: 14px;
        --font-base: 16px;
        --font-lg: 18px;
        --font-xl: 20px;
        --font-2xl: 24px;
        --font-3xl: 30px;

        /* Primary brand colors */
        --color-primary-50: #E6F7F8;
        --color-primary-100: #C0EAEB;
        --color-primary-200: #8FDADB;
        --color-primary-300: #5DC9CC;
        --color-primary-400: #38BDBE;
        --color-primary-500: #1D7072;
        --color-primary-600: #196061;
        --color-primary-700: #0F393A;

        /* UI colors */
        --color-ui-50: #FAFAFA;
        --color-ui-100: #F4F5F7;
        --color-ui-200: #E5E7EB;
        --color-ui-300: #D1D5DB;
        --color-ui-400: #9CA3AF;
        --color-ui-500: #6B7280;
        --color-ui-600: #4B5563;
        --color-ui-700: #374151;
        --color-ui-800: #1F2937;
        --color-ui-900: #111827;

        /* Semantic colors */
        --color-success: #10B981;
        --color-warning: #F59E0B;
        --color-error: #EF4444;

        /* Border radius */
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-xl: 24px;
        --radius-full: 9999px;

        /* Shadows */
        --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        --shadow-glow: 0 0 20px rgba(29, 112, 114, 0.15);

        /* Transitions */
        --transition-fast: 0.15s ease-out;
        --transition-base: 0.2s ease-out;
        --transition-spring: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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

        /* Prevent page-level horizontal scroll from any stray wide child */
        max-width: 100vw;
        overflow-x: hidden;
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

        /* Viewport safety net — matches landing page behavior */
        max-width: 100vw;
        overflow-x: hidden;

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
        outline: 2px solid var(--color-primary-400);
        outline-offset: 2px;
    }

    /* Selection styling */
    ::selection {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
    }

    /* Custom scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: var(--color-ui-100);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--color-ui-300);
        border-radius: 4px;
        transition: background 0.2s;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--color-ui-400);
    }

    /* Firefox scrollbar */
    * {
        scrollbar-width: thin;
        scrollbar-color: var(--color-ui-300) var(--color-ui-100);
    }

    /* Smooth page transitions */
    .page-enter {
        opacity: 0;
        transform: translateY(8px);
    }

    .page-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
    }

    .page-exit {
        opacity: 1;
    }

    .page-exit-active {
        opacity: 0;
        transition: opacity 0.15s ease-out;
    }

    /* Skeleton loading animation */
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    .skeleton {
        background: linear-gradient(
            90deg,
            var(--color-ui-100) 25%,
            var(--color-ui-200) 50%,
            var(--color-ui-100) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-sm);
    }

    /* Fade in animation utility */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }

    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
