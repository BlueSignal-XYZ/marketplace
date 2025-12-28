// /src/styles/index.js
// Central export for all styling utilities

// Theme and colors
export { colors, logoColors, theme } from "./colors";

// Breakpoints and media queries
export {
  breakpoints,
  media,
  safeAreaInsets,
  withSafeArea,
  touchTargetSize,
  mobileSpacing,
  // Legacy exports
  mobile,
  tablet,
  laptop,
} from "./breakpoints";

// Layout utilities
export {
  Container,
  Section,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  Flex,
  FlexBetween,
  FlexCenter,
  Stack,
  Grid,
  Divider,
  Spacer,
  VisuallyHidden,
  HideMobile,
  ShowMobile,
  HideDesktop,
  ShowDesktop,
} from "./layout";

// Animation utilities
export {
  // Keyframes
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  pulse,
  bounce,
  shake,
  spin,
  shimmer,
  // Mixins
  animate,
  staggerDelay,
  transition,
  // Hover effects
  hoverLift,
  hoverScale,
  hoverGlow,
  hoverBrighten,
  // Loading states
  skeleton,
  loadingSpinner,
  loadingPulse,
  // List animations
  listItemEntrance,
  // Accessibility
  respectReducedMotion,
} from "./animations";

// Global styles (usually imported separately in main.jsx)
export { GlobalStyle } from "./global";
