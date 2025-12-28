// /src/styles/layout.js
// Global layout utility components for consistent spacing and structure

import styled, { css } from "styled-components";
import { media } from "./breakpoints";

// Container - Responsive max-width container with auto margins
export const Container = styled.div`
  width: 100%;
  max-width: ${({ $size }) => {
    if ($size === "sm") return "640px";
    if ($size === "md") return "768px";
    if ($size === "lg") return "1024px";
    if ($size === "xl") return "1280px";
    if ($size === "full") return "100%";
    return "1200px"; // default
  }};
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;

  ${media.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }

  ${media.xl} {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

// Section - Consistent vertical spacing for page sections
export const Section = styled.section`
  padding-top: ${({ $spacing }) => {
    if ($spacing === "none") return "0";
    if ($spacing === "sm") return "24px";
    if ($spacing === "lg") return "64px";
    if ($spacing === "xl") return "96px";
    return "48px"; // default (md)
  }};
  padding-bottom: ${({ $spacing }) => {
    if ($spacing === "none") return "0";
    if ($spacing === "sm") return "24px";
    if ($spacing === "lg") return "64px";
    if ($spacing === "xl") return "96px";
    return "48px"; // default (md)
  }};

  ${({ $background, theme }) =>
    $background &&
    css`
      background: ${$background === "muted"
        ? theme.colors?.ui50 || "#FAFAFA"
        : $background === "primary"
        ? theme.colors?.primary50 || "#E6F7F8"
        : $background};
    `}
`;

// PageHeader - Consistent page title styling
export const PageHeader = styled.header`
  margin-bottom: 32px;

  ${media.lg} {
    margin-bottom: 40px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  margin: 0 0 8px;
  letter-spacing: -0.02em;

  ${media.lg} {
    font-size: 32px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
  margin: 0;
  max-width: 600px;
  line-height: 1.6;

  ${media.lg} {
    font-size: 16px;
  }
`;

export const PageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;

  ${media.lg} {
    margin-top: 0;
  }
`;

// Flex utilities
export const Flex = styled.div`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || "row"};
  align-items: ${({ $align }) => $align || "stretch"};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
  gap: ${({ $gap }) => $gap || "0"};
  flex-wrap: ${({ $wrap }) => ($wrap ? "wrap" : "nowrap")};
`;

export const FlexBetween = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

export const FlexCenter = styled(Flex)`
  justify-content: center;
  align-items: center;
`;

// Stack - Vertical stacking with consistent gaps
export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => {
    if ($gap === "xs") return "4px";
    if ($gap === "sm") return "8px";
    if ($gap === "md") return "16px";
    if ($gap === "lg") return "24px";
    if ($gap === "xl") return "32px";
    return $gap || "16px";
  }};
`;

// Grid utilities
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${({ $cols }) => $cols || "auto-fill"},
    minmax(${({ $minWidth }) => $minWidth || "280px"}, 1fr)
  );
  gap: ${({ $gap }) => $gap || "16px"};

  ${({ $cols, $responsive }) =>
    $responsive &&
    css`
      ${media.mobileOnly} {
        grid-template-columns: 1fr;
      }
    `}
`;

// Divider
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  margin: ${({ $spacing }) => {
    if ($spacing === "sm") return "16px 0";
    if ($spacing === "lg") return "32px 0";
    return "24px 0";
  }};
`;

// Spacer - Flexible space
export const Spacer = styled.div`
  flex: 1;
`;

// VisuallyHidden - Accessible hidden content
export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Responsive visibility utilities
export const HideMobile = styled.div`
  ${media.mobileOnly} {
    display: none;
  }
`;

export const ShowMobile = styled.div`
  display: none;

  ${media.mobileOnly} {
    display: block;
  }
`;

export const HideDesktop = styled.div`
  ${media.desktopUp} {
    display: none;
  }
`;

export const ShowDesktop = styled.div`
  display: none;

  ${media.desktopUp} {
    display: block;
  }
`;
