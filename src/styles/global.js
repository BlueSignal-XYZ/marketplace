import { createGlobalStyle } from "styled-components";
import SatoshiNormal from "../fonts/Satoshi-Regular.woff2";
import SatoshiMedium from "../fonts/Satoshi-Medium.woff2";
import SatoshiBold from "../fonts/Satoshi-Bold.woff2";

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


    * {
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        font-family: "Satoshi", sans-serif;
    }

    body {
        padding: 0px;
        margin: 0px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* Typography hierarchy */
    h1, h2, h3, h4, h5, h6 {
        margin: 0;
        font-weight: 600;
        line-height: 1.3;
    }

    h1 {
        font-size: 2rem;
        font-weight: 700;
    }

    h2 {
        font-size: 1.5rem;
    }

    h3 {
        font-size: 1.25rem;
    }

    p {
        margin: 0;
        line-height: 1.6;
    }

    button {
        font-family: "Satoshi", sans-serif;
        border: none;
        cursor: pointer;
        transition: all 0.15s ease-out;
    }

    button:disabled {
        cursor: not-allowed;
    }
`;
