// /src/styles/breakpoints.js

// Raw breakpoint values (for JS logic if you ever need it)
export const mobile = "480px";   // small phones
export const tablet = "768px";   // tablets / large phones
export const laptop = "1024px";  // small laptops / desktops;

// Handy media-query helpers for styled-components
export const media = {
  mobile: `@media (max-width: ${mobile})`,
  tabletDown: `@media (max-width: ${tablet})`,
  tabletUp: `@media (min-width: ${parseInt(tablet, 10) + 1}px)`,
  laptopUp: `@media (min-width: ${laptop})`,
};