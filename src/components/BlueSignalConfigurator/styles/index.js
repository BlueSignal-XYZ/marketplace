// BlueSignal Configurator Styled Components
import styled, { css, keyframes } from "styled-components";
import { media, safeAreaInsets } from "../../../styles/breakpoints";

// ============================================================================
// ANIMATIONS
// ============================================================================

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export const ConfiguratorWrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #ffffff;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
  padding: 12px;
  padding-bottom: calc(12px + ${safeAreaInsets.bottom});
  box-sizing: border-box;
  color: #1f2937;
  overflow-x: hidden;

  *, *::before, *::after {
    box-sizing: border-box;
  }

  ${media.lg} {
    padding: 24px;
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

export const Logo = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 8px;
  letter-spacing: -0.02em;

  span {
    color: #3b82f6;
  }
`;

export const Tagline = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

// ============================================================================
// NAVIGATION
// ============================================================================

export const NavTabs = styled.nav`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  ${media.lg} {
    gap: 8px;
    margin-bottom: 32px;
  }
`;

export const NavTab = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${({ active }) => (active ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  background: ${({ active }) => (active ? "#3b82f6" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#6b7280")};

  ${media.lg} {
    padding: 12px 32px;
  }

  &:hover {
    background: ${({ active }) => (active ? "#2563eb" : "#f9fafb")};
    border-color: ${({ active }) => (active ? "#2563eb" : "#d1d5db")};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ============================================================================
// PRODUCT CARDS
// ============================================================================

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
`;

export const ProductCard = styled.div`
  background: ${({ selected }) =>
    selected ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" : "#ffffff"};
  border: 2px solid ${({ selected }) => (selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ selected }) => (selected ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)")};
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${media.lg} {
    border-radius: 16px;
    padding: 20px;
  }

  /* Touch-friendly active state */
  &:active {
    transform: scale(0.98);
  }

  /* Hover only on non-touch devices */
  ${media.mouse} {
    &:hover {
      border-color: ${({ selected }) => (selected ? "#3b82f6" : "#d1d5db")};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }
`;

export const ProductCardWrapper = styled.div`
  position: relative;
`;

export const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #1f2937;

  ${media.lg} {
    font-size: 20px;
  }
`;

export const ProductSubtitle = styled.p`
  font-size: 11px;
  color: #6b7280;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${media.lg} {
    font-size: 12px;
    margin: 0 0 12px;
  }
`;

export const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 6px;

  ${media.lg} {
    font-size: 28px;
    margin-bottom: 8px;
  }
`;

export const ProductTagline = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 12px;
  line-height: 1.4;
`;

export const ProductBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  ${media.lg} {
    gap: 6px;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background: ${({ variant }) =>
    variant === "ultrasonic"
      ? "#fef3c7"
      : variant === "solar"
      ? "#dcfce7"
      : variant === "sensors"
      ? "#dbeafe"
      : "#f3f4f6"};
  color: ${({ variant }) =>
    variant === "ultrasonic"
      ? "#d97706"
      : variant === "solar"
      ? "#16a34a"
      : variant === "sensors"
      ? "#2563eb"
      : "#6b7280"};
`;

// ============================================================================
// DETAIL PANEL
// ============================================================================

export const DetailPanel = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  ${media.lg} {
    border-radius: 16px;
  }
`;

export const DetailTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  gap: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Fade indicators for scroll */
  ${media.mobileOnly} {
    mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
  }

  ${media.lg} {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

export const DetailTab = styled.button`
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: ${({ active }) => (active ? "#ffffff" : "transparent")};
  color: ${({ active }) => (active ? "#3b82f6" : "#6b7280")};
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? "#3b82f6" : "transparent")};
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${media.lg} {
    padding: 14px 20px;
    font-size: 13px;
  }

  &:hover {
    color: ${({ active }) => (active ? "#3b82f6" : "#1f2937")};
    background: ${({ active }) => (active ? "#ffffff" : "#f3f4f6")};
  }

  &:active {
    opacity: 0.8;
  }
`;

export const DetailContent = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 0 0 12px 12px;

  ${media.lg} {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }
`;

// ============================================================================
// SECTIONS & CONTENT
// ============================================================================

export const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #1f2937;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;

  &::before {
    content: "✓";
    color: #16a34a;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

export const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const SpecCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

export const SpecLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

export const SpecValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

export const SvgContainer = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  overflow: auto;

  svg {
    max-width: 100%;
    height: auto;
  }
`;

// ============================================================================
// TABLES
// ============================================================================

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    text-align: right;
  }
`;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;

  &:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

export const TotalRow = styled.tr`
  background: #eff6ff;

  td {
    font-weight: 700;
    color: #2563eb;
    border-bottom: none;
  }
`;

// ============================================================================
// GPIO SECTIONS
// ============================================================================

export const GpioSection = styled.div`
  margin-bottom: 20px;
`;

export const GpioTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  margin: 0 0 8px;
`;

export const GpioList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 13px;
    color: #4b5563;
    padding: 6px 0;
    border-bottom: 1px solid #f3f4f6;
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;

    &:last-child {
      border-bottom: none;
    }
  }
`;

// ============================================================================
// BENCHMARK COMPONENTS
// ============================================================================

export const BenchmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`;

export const BenchmarkCard = styled.div`
  background: ${({ highlight }) =>
    highlight ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" : "#ffffff"};
  border: 2px solid ${({ highlight }) => (highlight ? "#10b981" : "#e5e7eb")};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const BenchmarkName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
`;

export const BenchmarkPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ highlight }) => (highlight ? "#059669" : "#d97706")};
  margin-bottom: 16px;
`;

export const BenchmarkSection = styled.div`
  margin-bottom: 12px;

  h5 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    margin: 0 0 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 13px;
      color: #4b5563;
      padding: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: "${({ type }) => (type === "pro" ? "✓" : "✗")}";
        color: ${({ type }) => (type === "pro" ? "#16a34a" : "#dc2626")};
      }
    }
  }
`;

export const SavingsCallout = styled.div`
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  text-align: center;

  h4 {
    font-size: 16px;
    color: #059669;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #4b5563;
    margin: 0;
  }

  strong {
    color: #059669;
  }
`;

export const MarginBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
  background: ${({ good }) => (good ? "#dcfce7" : "#fef3c7")};
  color: ${({ good }) => (good ? "#16a34a" : "#d97706")};
  margin-left: 8px;
`;

// ============================================================================
// FILTER BAR
// ============================================================================

export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  ${media.lg} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  ${media.lg} {
    width: auto;
  }
`;

export const FilterLabel = styled.label`
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FilterSelect = styled.select`
  padding: 12px 16px;
  font-size: 16px; /* Prevents iOS zoom */
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  width: 100%;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  ${media.lg} {
    width: auto;
    min-width: 140px;
    padding: 8px 12px;
    font-size: 13px;
    padding-right: 36px;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  option {
    background: #ffffff;
    color: #374151;
  }
`;

export const SearchInput = styled.input`
  padding: 12px 16px;
  font-size: 16px; /* Prevents iOS zoom */
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  width: 100%;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${media.lg} {
    width: auto;
    min-width: 200px;
    padding: 8px 12px;
    font-size: 13px;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

// ============================================================================
// COMPARISON COMPONENTS
// ============================================================================

export const CompareButton = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ active }) => (active ? "#3b82f6" : "#ffffff")};
  border: 1px solid #3b82f6;
  border-radius: 8px;
  color: ${({ active }) => (active ? "#ffffff" : "#3b82f6")};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${media.lg} {
    width: auto;
    padding: 8px 16px;
    font-size: 13px;
  }

  &:hover {
    background: ${({ active }) => (active ? "#2563eb" : "#eff6ff")};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CompareCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #3b82f6;
  touch-action: manipulation;

  ${({ show }) => !show && css`
    display: none;
  `}
`;

export const ComparisonPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
  border-top: 1px solid #e5e7eb;
  padding: 12px;
  padding-bottom: calc(12px + ${safeAreaInsets.bottom});
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 -4px 12px rgba(0,0,0,0.1);

  ${media.lg} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    padding-bottom: calc(16px + ${safeAreaInsets.bottom});
  }
`;

export const ComparisonSelectedProducts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  ${media.lg} {
    gap: 12px;
    flex-wrap: nowrap;
  }
`;

export const ComparisonChip = styled.div`
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 13px;
  color: #2563eb;
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    font-size: 18px;
    line-height: 1;
    min-width: 28px;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;

    &:hover {
      color: #dc2626;
    }
  }
`;

export const CompareNowButton = styled.button`
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  min-height: 48px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${media.lg} {
    width: auto;
    padding: 10px 24px;
    min-height: 44px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ComparisonModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  animation: ${fadeIn} 0.3s ease;

  ${media.lg} {
    align-items: center;
    padding: 24px;
  }
`;

export const ComparisonContent = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 95vh;
  max-height: 95dvh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 -20px 60px rgba(0,0,0,0.2);

  ${media.lg} {
    border-radius: 16px;
    max-width: 1200px;
    max-height: 90vh;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
`;

export const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 10;

  ${media.lg} {
    padding: 20px 24px;
  }
`;

export const ComparisonTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 16px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #1f2937;
  }
`;

export const ComparisonTable = styled.div`
  padding: 24px;
  overflow-x: auto;
`;

export const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 180px repeat(${({ cols }) => cols}, 1fr);
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const ComparisonLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const ComparisonValue = styled.div`
  font-size: 14px;
  color: ${({ highlight }) => (highlight ? "#059669" : "#374151")};
  font-weight: ${({ highlight }) => (highlight ? "600" : "400")};
`;

export const ComparisonProductHeader = styled.div`
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
`;

// ============================================================================
// ACTION BUTTONS & UI
// ============================================================================

export const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ActionButton = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1 1 auto;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${media.lg} {
    flex: 0 0 auto;
    padding: 8px 16px;
    font-size: 12px;
    min-height: 36px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    border-color: rgba(255, 255, 255, 0.25);
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

export const KeyboardHint = styled.div`
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  margin-top: 16px;
  display: none; /* Hide on mobile since keyboard shortcuts don't apply */

  ${media.lg} {
    display: block;
  }

  kbd {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 2px 6px;
    font-family: monospace;
    margin: 0 2px;
    color: #4b5563;
  }
`;

export const StickyProductInfo = styled.div`
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  padding: 12px;
  margin: -16px -16px 16px -16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;

  ${media.lg} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin: -24px -24px 24px -24px;
    gap: 0;
  }
`;

export const CurrentProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;

  ${media.lg} {
    font-size: 16px;
  }

  span {
    color: #94a3b8;
    font-weight: 400;
    margin-left: 8px;
    display: block;

    ${media.lg} {
      display: inline;
    }
  }
`;

export const TabNavigation = styled.div`
  display: flex;
  gap: 8px;
`;

export const MiniNavButton = styled.button`
  background: none;
  border: none;
  color: ${({ disabled }) => (disabled ? "#d1d5db" : "#3b82f6")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  font-size: 18px;
  padding: 4px 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: #2563eb;
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;

  h4 {
    font-size: 18px;
    color: #1f2937;
    margin: 0 0 8px;
  }

  p {
    margin: 0;
  }
`;
