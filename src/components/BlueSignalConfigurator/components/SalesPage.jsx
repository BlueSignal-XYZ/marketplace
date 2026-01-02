// SalesPage - Unified single-page layout for the sales portal
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { salesTheme } from "../styles/theme";
import { PRODUCTS, BUNDLES, calculateBundlePrice } from "../data";
import useFormSubmit from "../hooks/useFormSubmit";

// Components
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";
import HeroSection from "./HeroSection";
import ProductTiers from "./ProductTiers";
import ProductCatalogSection from "./ProductCatalogSection";
import ROICalculatorSection from "./ROICalculatorSection";
// Dividers removed for cleaner look

// Detail components from original configurator
import {
  OverviewTab,
  SpecsTab,
  WiringTab,
  LayoutTab,
  PowerTab,
  EnclosureTab,
  EnhancedInstallationTab,
  OperationsTab,
  EnhancedBomTab,
  BenchmarkView,
  ProductComparisonView,
  QuoteBuilder,
  QuoteFloatingButton,
  CustomerNameModal,
} from "./index";

import { generateQuotePDF, generateSpecsPDF } from "../utils";
import SEOHead from "../../seo/SEOHead";
import { BLUESIGNAL_ORGANIZATION_SCHEMA, SALES_WEBSITE_SCHEMA, createProductSchema } from "../../seo/schemas";

const GlobalStyles = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${salesTheme.typography.fontFamily};
    background: ${salesTheme.colors.bgPrimary};
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${salesTheme.colors.bgPrimary};
`;

const MainContent = styled.main`
  /* Account for fixed header */
  scroll-padding-top: 80px;
`;

// Product Detail Modal/Slide-up Panel
const ProductDetailOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: ${salesTheme.zIndex.modal};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (min-width: ${salesTheme.breakpoints.laptop}) {
    align-items: center;
    padding: 32px;
  }
`;

const ProductDetailPanel = styled.div`
  background: ${salesTheme.colors.bgCard};
  border-radius: 28px 28px 0 0;
  width: 100%;
  max-height: 95vh;
  max-height: 95dvh; /* Dynamic viewport height for mobile browsers */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.3);

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (min-width: ${salesTheme.breakpoints.laptop}) {
    border-radius: 28px;
    max-width: 1200px;
    max-height: 88vh;
    animation: scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid ${salesTheme.colors.border};
  background: linear-gradient(to bottom, ${salesTheme.colors.bgCard} 0%, #fafbfc 100%);
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const DetailProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex: 1;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DetailProductName = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: ${salesTheme.colors.textDark};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const DetailProductPrice = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: ${salesTheme.colors.accentPrimary};
  font-family: ${salesTheme.typography.fontMono};
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  color: ${salesTheme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #e5e7eb;
    color: ${salesTheme.colors.textDark};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
`;

const DetailTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${salesTheme.colors.border};
  background: #f9fafb;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 12px;
  min-height: 48px;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    min-height: 44px;
    padding: 0 8px;
  }
`;

const DetailTab = styled.button`
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: ${props => props.$active ? salesTheme.colors.accentSecondary : salesTheme.colors.textMuted};
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? salesTheme.colors.accentSecondary : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.$active ? salesTheme.colors.accentSecondary : salesTheme.colors.textDark};
    background: ${props => props.$active ? 'transparent' : 'rgba(0, 0, 0, 0.02)'};
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 10px 16px;
    font-size: 13px;
    min-height: 40px;
  }
`;

const DetailContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 32px;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  min-height: 0; /* Fix for flex child overflow scrolling */

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 24px 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px 16px;
    /* Ensure content is scrollable on mobile */
    max-height: none;
    overflow-y: auto;
  }
`;

const DetailActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 28px;
  border-top: 1px solid ${salesTheme.colors.border};
  background: linear-gradient(to top, ${salesTheme.colors.bgCard} 0%, #fafbfc 100%);

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 16px 20px;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;

  svg {
    width: 18px;
    height: 18px;
  }

  ${props => props.$primary ? `
    background: ${salesTheme.gradients.greenCta};
    border: none;
    color: #0f172a;
    flex: 1.5;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    }

    &:active {
      transform: translateY(0);
    }
  ` : `
    background: ${salesTheme.colors.bgCard};
    border: 2px solid ${salesTheme.colors.border};
    color: ${salesTheme.colors.textMuted};

    &:hover {
      background: #f3f4f6;
      color: ${salesTheme.colors.textDark};
      border-color: #d1d5db;
    }
  `}

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 14px 16px;
    font-size: 13px;
    min-width: unset;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// Benchmark Section Wrapper
const BenchmarkSection = styled.section`
  background: ${salesTheme.colors.bgSecondary};
  padding: 80px 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px;
  }
`;

const BenchmarkContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const BenchmarkHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 24px;
  }
`;

// ============================================
// ABOUT SECTION STYLES
// ============================================
const AboutSection = styled.section`
  padding: 80px 24px;
  background: ${salesTheme.colors.bgSurface};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const AboutTagline = styled.p`
  font-size: 20px;
  color: ${salesTheme.colors.textMuted};
  max-width: 700px;
  margin: 16px auto 0;
  line-height: 1.6;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const AboutCard = styled.div`
  background: ${salesTheme.colors.bgCard};
  border-radius: 16px;
  padding: 40px;
  border: 1px solid ${salesTheme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${salesTheme.shadows.lg};
    border-color: rgba(16, 185, 129, 0.2);
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 32px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 24px;
  }
`;

const AboutCardTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 16px;
  letter-spacing: -0.01em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`;

const AboutCardText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${salesTheme.colors.textMuted};
  margin: 0;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 15px;
  }
`;

// ============================================
// FAQ SECTION STYLES
// ============================================
const FAQSection = styled.section`
  padding: 80px 24px;
  background: ${salesTheme.colors.bgPrimary};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const FAQSubtitle = styled.p`
  font-size: 18px;
  color: ${salesTheme.colors.textSecondary};
  margin: 16px 0 0;
  line-height: 1.6;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:first-child {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const AccordionButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 16px;

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentPrimary};
    outline-offset: 2px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 20px 0;
  }
`;

const QuestionText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  line-height: 1.4;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const ExpandIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${salesTheme.colors.textSecondary};
  transition: transform 0.25s ease;
  transform: ${props => props.$expanded ? 'rotate(45deg)' : 'rotate(0)'};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AccordionContent = styled.div`
  max-height: ${props => props.$expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.25s ease;
  opacity: ${props => props.$expanded ? 1 : 0};
`;

const AnswerText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${salesTheme.colors.textSecondary};
  margin: 0;
  padding-bottom: 24px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 15px;
    padding-bottom: 20px;
  }
`;

const FAQContactCTA = styled.div`
  margin-top: 64px;
  text-align: center;
  padding: 48px;
  background: ${salesTheme.colors.bgSecondary};
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    margin-top: 48px;
    padding: 32px 24px;
  }
`;

const FAQCTATitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 8px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const FAQCTAEmail = styled.a`
  font-size: 24px;
  font-weight: 600;
  color: ${salesTheme.colors.accentPrimary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #34d399;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const FAQCTAPhone = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textSecondary};
  margin: 16px 0 0;
`;

// ============================================
// CONTACT SECTION STYLES
// ============================================
const ContactSection = styled.section`
  padding: 80px 24px;
  background: ${salesTheme.colors.bgSurface};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const ContactContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const ContactSubtitle = styled.p`
  font-size: 18px;
  color: ${salesTheme.colors.textMuted};
  margin: 16px 0 0;
  line-height: 1.6;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const MapSection = styled.div``;

const ContactSectionTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 24px;
  letter-spacing: -0.01em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${salesTheme.colors.border};
  background: #e5e7eb;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    height: 300px;
  }
`;

const FormSection = styled.div``;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${salesTheme.colors.textMuted};
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 10px;
  font-size: 16px;
  color: ${salesTheme.colors.textDark};
  background: ${salesTheme.colors.bgCard};
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 10px;
  font-size: 16px;
  color: ${salesTheme.colors.textDark};
  background: ${salesTheme.colors.bgCard};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: 10px;
  font-size: 16px;
  color: ${salesTheme.colors.textDark};
  background: ${salesTheme.colors.bgCard};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 16px 32px;
  background: ${salesTheme.colors.textDark};
  color: ${salesTheme.colors.textPrimary};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0f172a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentSecondary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactInfo = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  margin: 8px 0 0;

  strong {
    color: ${salesTheme.colors.textDark};
  }
`;

const SuccessMessage = styled.div`
  padding: 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
  color: ${salesTheme.colors.accentPrimary};
  font-weight: 500;
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #ef4444;
  font-weight: 500;
  text-align: center;
`;

const ServicesSection = styled.section`
  padding: 80px 24px;
  background: ${salesTheme.colors.bgPrimary};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const ServicesContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const ServicesSectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 16px;
  text-align: center;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 26px;
  }
`;

const ServicesSubtitle = styled.p`
  font-size: 18px;
  color: ${salesTheme.colors.textSecondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ServiceCard = styled.div`
  background: ${salesTheme.colors.bgSecondary};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 24px;
  }
`;

const ServiceIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  color: ${salesTheme.colors.accentPrimary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 12px;
`;

const ServiceDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${salesTheme.colors.textSecondary};
  margin: 0 0 16px;
`;

const ServicePrice = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: ${salesTheme.colors.accentPrimary};
  background: rgba(16, 185, 129, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
`;

// ============================================
// DATA CONSTANTS
// ============================================
const aboutContent = [
  {
    id: "our-story",
    title: "Our Story",
    content: "We deploy and support smart water quality buoys, soil nutrient sensors, and submersible ultrasonic emitters that control and prevent algal blooms. Every system is configured for your site, installed by trained technicians, and backed by ongoing service options. Whether it's a single pond or an entire lake, we help it run clean and stay that way."
  },
  {
    id: "craftsmanship",
    title: "Craftsmanship",
    content: "We start with a conversation\u2014what you manage, what's not working, and what you want to improve. From there, we scope a solution, handle the install, and keep it running with optional maintenance and a free dashboard for remote monitoring. You'll always know what's in your pond, in your field, and where it's headed."
  },
  {
    id: "why-we-started",
    title: "Why We Started",
    content: "BlueSignal was founded by people who've worked alongside farmers, facility managers, utility staff, and property owners. Water quality solutions are often expensive, fragile, and poorly supported. We built BlueSignal to change that."
  },
  {
    id: "mission",
    title: "Mission and Values",
    content: "We believe in keeping things simple, building for long term American growth, standing behind our service, and delivering practical tools for managing water and land."
  }
];

const faqItems = [
  {
    question: "How do I place an order?",
    answer: "You can build a custom quote directly on our website using the product configurator. Add items to your quote, then click \"Get a Quote\" to review. From there, you can export a PDF, share the link with your team, or contact us to finalize the purchase. For larger deployments, reach out to our sales team for volume pricing."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, ACH bank transfers, and wire transfers for larger orders. For enterprise and municipal customers, we can accommodate purchase orders and NET 30 terms with approved credit. Contact our sales team to set up an account."
  },
  {
    question: "How long does installation take?",
    answer: "Most installations are completed in 60 minutes or less for shore-based units. Smart Buoy deployments typically take 2-3 hours including anchoring and calibration. We offer professional installation services in the Austin metro area and can provide remote guidance for DIY installations elsewhere."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day satisfaction guarantee on all hardware. If you're not completely satisfied, return the equipment in its original condition for a full refund. Custom-configured systems may be subject to a 15% restocking fee. Warranty claims are handled separately\u2014see our warranty page for details."
  },
  {
    question: "How do I get technical support for my product?",
    answer: "All BlueSignal products include complimentary technical support via email and phone. You can reach our support team at hi@bluesignal.xyz or call +1.512.730.0843 during business hours (9am-6pm CT). Premium support packages with 24/7 availability are available for enterprise customers."
  },
  {
    question: "Is my payment information safe on your website?",
    answer: "Yes, absolutely. We use industry-standard SSL encryption for all transactions. Payment processing is handled by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your full credit card details on our servers."
  },
  {
    question: "Do you offer installation services in my area?",
    answer: "We provide full installation services throughout the Austin metro area and Central Texas. For locations outside this region, we offer comprehensive remote installation support including video calls, detailed guides, and pre-configured equipment. We're also building a network of certified installers nationwide."
  },
  {
    question: "What kind of warranty do you offer?",
    answer: "All BlueSignal monitoring equipment comes with a standard 2-year limited warranty covering manufacturing defects and component failures. Extended warranty options up to 4 years are available at purchase. Ultrasonic transducers and sensors carry a 1-year warranty due to their exposure to harsh environments."
  }
];

const productOptions = [
  { value: "", label: "Select a product (optional)" },
  { value: "smart-buoy", label: "Smart Buoy - $2,499" },
  { value: "smart-buoy-xl", label: "Smart Buoy XL - $19,999" },
  { value: "shore-monitor-ac", label: "Shore Monitor AC - $599" },
  { value: "shore-monitor-solar", label: "Shore Monitor Solar - $1,499" },
  { value: "shore-monitor-lite", label: "Shore Monitor Lite - $849" },
  { value: "pressure-wash", label: "Pressure Washing Services" },
  { value: "other", label: "Other / General Inquiry" },
];

const localServices = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
    title: "Dock & Pier Pressure Washing",
    description: "Professional cleaning for boat docks, piers, and waterfront structures. We remove algae, mildew, mineral deposits, and years of grime buildup.",
    price: "Starting at $249/dock"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Solar Panel Cleaning",
    description: "Maximize your solar efficiency with professional cleaning. Dirty panels lose 15-25% efficiency. We use deionized water and soft brushes.",
    price: "$15/panel (min 10 panels)"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Pond & Pool Deck Cleaning",
    description: "Restore your pool deck, pond edges, or patio to like-new condition. We handle concrete, pavers, flagstone, and composite decking.",
    price: "Starting at $0.35/sq ft"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Commercial & Municipal",
    description: "HOA common areas, municipal facilities, marinas, and large-scale projects. Volume discounts available. We carry full liability insurance.",
    price: "Contact for quote"
  }
];

// Tab configuration
const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "install", label: "Install" },
  { id: "pricing", label: "Pricing" },
];

export default function SalesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Section refs for scroll navigation
  const sectionRefs = {
    hero: useRef(null),
    tiers: useRef(null),
    products: useRef(null),
    about: useRef(null),
    faq: useRef(null),
    contact: useRef(null),
    calculator: useRef(null),
    benchmark: useRef(null),
  };

  // Active section tracking
  const [activeSection, setActiveSection] = useState('hero');

  // Product state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Compare state
  const [compareMode, setCompareMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Quote state
  const [quoteItems, setQuoteItems] = useState([]);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showBundles, setShowBundles] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Quote mode - only show "Add to Quote" buttons when explicitly enabled via URL
  const isQuoteMode = searchParams.get('quote') === 'true' ||
                      searchParams.get('quote') === '1' ||
                      showQuoteBuilder;

  // FAQ accordion state
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
    product: ""
  });
  const { formState: contactFormState, submitForm: submitContactForm, reset: resetContactForm } = useFormSubmit('contact_submissions');

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const success = await submitContactForm(contactFormData);
    if (success) {
      setContactFormData({ name: "", email: "", message: "", product: "" });
    }
  };

  // Parse URL params and hash on load
  useEffect(() => {
    const productParam = searchParams.get('product');
    const tabParam = searchParams.get('tab');
    const quoteParam = searchParams.get('quote');
    const sectionParam = searchParams.get('section');

    if (productParam && PRODUCTS[productParam]) {
      setSelectedProduct(productParam);
      if (tabParam && DETAIL_TABS.find(t => t.id === tabParam)) {
        setActiveTab(tabParam);
      }
    }

    if (quoteParam) {
      try {
        const items = quoteParam.split(',').map(item => {
          const [productId, qty] = item.split(':');
          if (PRODUCTS[productId]) {
            return { productId, quantity: parseInt(qty, 10) || 1 };
          }
          return null;
        }).filter(Boolean);
        if (items.length > 0) {
          setQuoteItems(items);
        }
      } catch (e) {
        console.warn('Failed to parse quote from URL', e);
      }
    }

    if (sectionParam) {
      setTimeout(() => scrollToSection(sectionParam), 100);
    }

    // Handle ?quote=true param to open quote builder
    const quoteOpen = searchParams.get('quote');
    if (quoteOpen === 'true' || quoteOpen === '1') {
      setShowQuoteBuilder(true);
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedProduct) {
      params.set('product', selectedProduct);
      params.set('tab', activeTab);
    }

    if (quoteItems.length > 0) {
      const quoteString = quoteItems.map(item => `${item.productId}:${item.quantity}`).join(',');
      params.set('quote', quoteString);
    }

    const newSearch = params.toString();
    if (newSearch !== location.search.slice(1)) {
      navigate(`?${newSearch}`, { replace: true });
    }
  }, [selectedProduct, activeTab, quoteItems]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observers = [];
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          options
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Navigation handlers
  const scrollToSection = useCallback((sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      const headerHeight = 72;
      const top = ref.current.offsetTop - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleNavigate = (sectionId) => {
    if (sectionId === 'products') {
      scrollToSection('products');
    } else {
      scrollToSection(sectionId);
    }
  };

  // Product handlers
  const handleSelectProduct = (productId) => {
    setSelectedProduct(productId);
    setActiveTab("overview");
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  // Compare handlers
  const handleToggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setCompareProducts([]);
    }
  };

  const handleToggleCompareProduct = (productId) => {
    setCompareProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  };

  // Quote handlers
  const handleAddToQuote = (productId) => {
    setQuoteItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setQuoteItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromQuote = (productId) => {
    setQuoteItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  // Quote mode handlers
  const enableQuoteMode = () => {
    setSearchParams(prev => {
      prev.set('quote', 'true');
      return prev;
    });
  };

  const disableQuoteMode = () => {
    setSearchParams(prev => {
      prev.delete('quote');
      return prev;
    });
    setShowQuoteBuilder(false);
  };

  const handleAddBundle = (bundle) => {
    setQuoteItems(prev => {
      const newItems = [...prev];
      bundle.products.forEach(({ productId, quantity }) => {
        const existingIndex = newItems.findIndex(item => item.productId === productId);
        if (existingIndex >= 0) {
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
        } else {
          newItems.push({ productId, quantity });
        }
      });
      return newItems;
    });
    setShowQuoteBuilder(true);
  };

  // PDF handlers
  const openQuotePDFModal = () => {
    if (quoteItems.length > 0) {
      setPdfError(null);
      setShowCustomerModal(true);
    }
  };

  const handleGenerateQuotePDF = async (customerName) => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    try {
      await generateQuotePDF(quoteItems, PRODUCTS, { customerName });
      setShowCustomerModal(false);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateShareableLink = () => {
    const params = new URLSearchParams();
    if (selectedProduct) {
      params.set('product', selectedProduct);
      params.set('tab', activeTab);
    }
    if (quoteItems.length > 0) {
      const quoteString = quoteItems.map(item => `${item.productId}:${item.quantity}`).join(',');
      params.set('quote', quoteString);
    }
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?${params.toString()}`;
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(generateShareableLink());
  };

  // Export handlers
  const exportBomAsCsv = () => {
    if (!selectedProduct) return;
    const product = PRODUCTS[selectedProduct];
    const headers = ["Category", "Item", "Quantity", "Cost"];
    const rows = product.bom.map(item => [
      item.category,
      item.item,
      item.qty,
      item.cost
    ]);
    const total = product.bom.reduce((sum, item) => sum + item.cost, 0);
    rows.push(["", "TOTAL", "", total]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.name}-BOM.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSpecsPDF = () => {
    if (!selectedProduct) return;
    generateSpecsPDF(PRODUCTS[selectedProduct]);
  };

  const quoteItemCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
  const product = selectedProduct ? PRODUCTS[selectedProduct] : null;

  const renderTabContent = () => {
    if (!product) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewTab product={product} />;
      case "technical":
        return (
          <>
            <SpecsTab product={product} />
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <WiringTab product={product} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <LayoutTab product={product} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <PowerTab product={product} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <EnclosureTab product={product} />
            </div>
          </>
        );
      case "install":
        return (
          <>
            <EnhancedInstallationTab product={product} />
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <OperationsTab product={product} />
            </div>
          </>
        );
      case "pricing":
        return <EnhancedBomTab product={product} />;
      default:
        return <OverviewTab product={product} />;
    }
  };

  // Generate SEO schema
  const productSchema = product ? createProductSchema({
    name: product.name,
    description: product.tagline || `${product.name} water quality monitoring system`,
    image: `https://bluesignal.xyz/products/${selectedProduct}.png`,
    brand: 'BlueSignal',
    sku: selectedProduct.toUpperCase(),
    price: product.price,
    currency: 'USD',
    availability: 'InStock',
    url: `https://bluesignal.xyz?product=${selectedProduct}`,
  }) : null;

  return (
    <>
      <GlobalStyles />
      <SEOHead
        title="Water Quality Sensors & Smart Buoys | BlueSignal"
        description="Professional-grade water quality monitoring hardware. Smart buoys, sensors, and complete monitoring systems. Configure your system and get a quote."
        canonical="/"
        keywords="water quality sensors, smart buoys, lake monitoring, pond monitoring, water monitoring hardware"
        jsonLd={[BLUESIGNAL_ORGANIZATION_SCHEMA, SALES_WEBSITE_SCHEMA, ...(productSchema ? [productSchema] : [])]}
      />

      <PageWrapper>
        <SalesHeader
          quoteItemCount={quoteItemCount}
          onOpenQuote={() => setShowQuoteBuilder(true)}
          isQuoteMode={isQuoteMode}
          onEnableQuoteMode={enableQuoteMode}
        />

        <MainContent>
          {/* Hero Section */}
          <div ref={sectionRefs.hero}>
            <HeroSection
              onNavigateToProducts={() => scrollToSection('products')}
              onNavigateToBenchmark={() => scrollToSection('benchmark')}
            />
          </div>

          {/* Product Tiers Section */}
          <div ref={sectionRefs.tiers}>
            <ProductTiers onNavigate={handleNavigate} />
          </div>

          {/* Product Catalog Section */}
          <div ref={sectionRefs.products}>
            <ProductCatalogSection
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
              compareMode={compareMode}
              onToggleCompareMode={handleToggleCompareMode}
              compareProducts={compareProducts}
              onToggleCompareProduct={handleToggleCompareProduct}
              quoteItems={quoteItems}
              onAddToQuote={handleAddToQuote}
              showBundles={showBundles}
              onToggleBundles={() => setShowBundles(!showBundles)}
              onAddBundle={handleAddBundle}
              isQuoteMode={isQuoteMode}
              onExitQuoteMode={disableQuoteMode}
            />
          </div>

          {/* ROI Calculator Section */}
          <div ref={sectionRefs.calculator}>
            <ROICalculatorSection
              onGetQuote={() => scrollToSection('products')}
            />
          </div>

          {/* Benchmark Section */}
          <div ref={sectionRefs.benchmark}>
            <BenchmarkSection id="benchmark">
              <BenchmarkContainer>
                <BenchmarkHeader>
                  <SectionLabel>Market Comparison</SectionLabel>
                  <SectionTitle>How We Compare</SectionTitle>
                </BenchmarkHeader>
                <BenchmarkView />
              </BenchmarkContainer>
            </BenchmarkSection>
          </div>

          {/* About Section */}
          <div ref={sectionRefs.about}>
            <AboutSection id="about">
              <AboutContainer>
                <AboutHeader>
                  <SectionLabel>About BlueSignal</SectionLabel>
                  <SectionTitle style={{ color: salesTheme.colors.textDark }}>
                    Practical tools for managing water and land
                  </SectionTitle>
                  <AboutTagline>
                    Built for those who care about their water, their land, and the future.
                  </AboutTagline>
                </AboutHeader>
                <AboutGrid>
                  {aboutContent.map((item) => (
                    <AboutCard key={item.id}>
                      <AboutCardTitle>{item.title}</AboutCardTitle>
                      <AboutCardText>{item.content}</AboutCardText>
                    </AboutCard>
                  ))}
                </AboutGrid>
              </AboutContainer>
            </AboutSection>
          </div>

          {/* Contact Section */}
          <div ref={sectionRefs.contact}>
            <ContactSection id="contact">
              <ContactContainer>
                <ContactHeader>
                  <SectionLabel>Contact</SectionLabel>
                  <SectionTitle style={{ color: salesTheme.colors.textDark }}>
                    Get in Touch
                  </SectionTitle>
                  <ContactSubtitle>
                    Have questions about our products or need help with your water quality project? We're here to help.
                  </ContactSubtitle>
                </ContactHeader>
                <ContactGrid>
                  <MapSection>
                    <ContactSectionTitle>Operating in Austin</ContactSectionTitle>
                    <MapContainer>
                      <iframe
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-98.0731%2C30.1007%2C-97.5631%2C30.5407&amp;layer=mapnik&amp;marker=30.2672%2C-97.7431"
                        title="BlueSignal Location - Austin, TX"
                        loading="lazy"
                      />
                    </MapContainer>
                  </MapSection>

                  <FormSection>
                    <ContactSectionTitle>Drop us a line...</ContactSectionTitle>
                    {contactFormState.status === 'success' ? (
                      <SuccessMessage>
                        Thank you for your message! We'll get back to you within 24 hours.
                      </SuccessMessage>
                    ) : (
                      <ContactForm onSubmit={handleContactSubmit}>
                        {contactFormState.status === 'error' && (
                          <ErrorMessage>{contactFormState.error}</ErrorMessage>
                        )}
                        <FormGroup>
                          <Label htmlFor="contact-name">Name</Label>
                          <Input
                            type="text"
                            id="contact-name"
                            name="name"
                            placeholder="Jane Smith"
                            value={contactFormData.name}
                            onChange={handleContactChange}
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="contact-email">Email</Label>
                          <Input
                            type="email"
                            id="contact-email"
                            name="email"
                            placeholder="jane@gmail.com"
                            value={contactFormData.email}
                            onChange={handleContactChange}
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="contact-message">Message</Label>
                          <TextArea
                            id="contact-message"
                            name="message"
                            placeholder="Hi team..."
                            value={contactFormData.message}
                            onChange={handleContactChange}
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="contact-product">Products for purchase</Label>
                          <Select
                            id="contact-product"
                            name="product"
                            value={contactFormData.product}
                            onChange={handleContactChange}
                          >
                            {productOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Select>
                        </FormGroup>

                        <SubmitButton type="submit" disabled={contactFormState.status === 'submitting'}>
                          {contactFormState.status === 'submitting' ? "Sending..." : "Submit"}
                        </SubmitButton>

                        <ContactInfo>
                          <strong>Text or call</strong> +1.512.730.0843
                        </ContactInfo>
                      </ContactForm>
                    )}
                  </FormSection>
                </ContactGrid>
              </ContactContainer>
            </ContactSection>

            {/* Local Services Section */}
            <ServicesSection>
              <ServicesContainer>
                <ServicesSectionTitle>Local Services in Austin</ServicesSectionTitle>
                <ServicesSubtitle>
                  Beyond monitoring equipment, we offer hands-on pressure washing services for the Austin metro area.
                </ServicesSubtitle>
                <ServicesGrid>
                  {localServices.map((service, index) => (
                    <ServiceCard key={index}>
                      <ServiceIcon>{service.icon}</ServiceIcon>
                      <ServiceTitle>{service.title}</ServiceTitle>
                      <ServiceDescription>{service.description}</ServiceDescription>
                      <ServicePrice>{service.price}</ServicePrice>
                    </ServiceCard>
                  ))}
                </ServicesGrid>
              </ServicesContainer>
            </ServicesSection>
          </div>

          {/* FAQ Section - Immediately above footer */}
          <div ref={sectionRefs.faq}>
            <FAQSection id="faq">
              <FAQContainer>
                <FAQHeader>
                  <SectionLabel>FAQ</SectionLabel>
                  <SectionTitle>Frequently Asked Questions</SectionTitle>
                  <FAQSubtitle>
                    Everything you need to know about our products, ordering, and support.
                  </FAQSubtitle>
                </FAQHeader>
                <AccordionList>
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index}>
                      <AccordionButton
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={expandedFAQ === index}
                      >
                        <QuestionText>{item.question}</QuestionText>
                        <ExpandIcon $expanded={expandedFAQ === index}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </ExpandIcon>
                      </AccordionButton>
                      <AccordionContent $expanded={expandedFAQ === index}>
                        <AnswerText>{item.answer}</AnswerText>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </AccordionList>
                <FAQContactCTA>
                  <FAQCTATitle>For all other questions email us at</FAQCTATitle>
                  <FAQCTAEmail href="mailto:hi@bluesignal.xyz">hi@bluesignal.xyz</FAQCTAEmail>
                  <FAQCTAPhone>Text or call +1.512.730.0843</FAQCTAPhone>
                </FAQContactCTA>
              </FAQContainer>
            </FAQSection>
          </div>
        </MainContent>

        <SalesFooter onNavigate={handleNavigate} />

        {/* Product Detail Panel */}
        {selectedProduct && (
          <ProductDetailOverlay onClick={handleCloseDetail}>
            <ProductDetailPanel onClick={(e) => e.stopPropagation()}>
              <DetailHeader>
                <DetailProductInfo>
                  <DetailProductName>{product.name}</DetailProductName>
                  <DetailProductPrice>${product.price.toLocaleString()}</DetailProductPrice>
                </DetailProductInfo>
                <CloseButton onClick={handleCloseDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </CloseButton>
              </DetailHeader>

              <DetailTabs>
                {DETAIL_TABS.map((tab) => (
                  <DetailTab
                    key={tab.id}
                    $active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </DetailTab>
                ))}
              </DetailTabs>

              <DetailContent>
                {renderTabContent()}
              </DetailContent>

              <DetailActions>
                <ActionButton onClick={exportSpecsPDF}>
                  Export PDF
                </ActionButton>
                <ActionButton onClick={exportBomAsCsv}>
                  Export BOM
                </ActionButton>
                <ActionButton $primary onClick={() => handleAddToQuote(selectedProduct)}>
                  Add to Quote
                </ActionButton>
              </DetailActions>
            </ProductDetailPanel>
          </ProductDetailOverlay>
        )}

        {/* Compare Panel */}
        {compareMode && compareProducts.length >= 2 && (
          <ProductComparisonView
            products={compareProducts.map(id => PRODUCTS[id])}
            onClose={() => setShowComparison(false)}
          />
        )}

        {/* Quote Builder */}
        <QuoteBuilder
          isOpen={showQuoteBuilder}
          onClose={() => setShowQuoteBuilder(false)}
          quoteItems={quoteItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromQuote}
          onClearQuote={handleClearQuote}
          onExportPDF={openQuotePDFModal}
          onShareQuote={copyShareableLink}
          onLoadQuote={(items) => setQuoteItems(items)}
          products={PRODUCTS}
        />

        {/* Customer Name Modal */}
        <CustomerNameModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onGenerate={handleGenerateQuotePDF}
          isGenerating={isGeneratingPDF}
          error={pdfError}
        />

        {/* Floating Quote Button */}
        {!showQuoteBuilder && (
          <QuoteFloatingButton
            itemCount={quoteItemCount}
            onClick={() => setShowQuoteBuilder(true)}
          />
        )}
      </PageWrapper>
    </>
  );
}
