// FAQPage - Frequently asked questions with accordion
import React, { useState } from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${salesTheme.colors.bgSurface};
`;

const MainContent = styled.main`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  background: ${salesTheme.colors.bgPrimary};
  padding: 60px 24px 80px;
  text-align: center;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px 64px;
  }
`;

const HeroContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 42px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 16px;
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 32px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 28px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  color: ${salesTheme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const ContentSection = styled.section`
  padding: 60px 24px 80px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px 64px;
  }
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid ${salesTheme.colors.border};

  &:first-child {
    border-top: 1px solid ${salesTheme.colors.border};
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
  color: ${salesTheme.colors.textDark};
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
  color: ${salesTheme.colors.textMuted};
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
  color: ${salesTheme.colors.textMuted};
  margin: 0;
  padding-bottom: 24px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 15px;
    padding-bottom: 20px;
  }
`;

const ContactCTA = styled.div`
  margin-top: 64px;
  text-align: center;
  padding: 48px;
  background: ${salesTheme.colors.bgCard};
  border-radius: 16px;
  border: 1px solid ${salesTheme.colors.border};

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    margin-top: 48px;
    padding: 32px 24px;
  }
`;

const CTATitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 8px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const CTAEmail = styled.a`
  font-size: 24px;
  font-weight: 600;
  color: ${salesTheme.colors.accentSecondary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${salesTheme.colors.accentSecondaryHover};
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const CTAPhone = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  margin: 16px 0 0;
`;

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

export default function FAQPage() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleNavigate = (sectionId) => {
    navigate(`/?section=${sectionId}`);
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageWrapper>
      <SalesHeader
        activeSection="faq"
        onNavigate={handleNavigate}
        quoteItemCount={0}
        onOpenQuote={() => navigate("/?quote=true")}
      />

      <MainContent>
        <HeroSection>
          <HeroContainer>
            <PageTitle>Frequently Asked Questions</PageTitle>
            <PageSubtitle>
              Everything you need to know about our products, ordering, and support.
            </PageSubtitle>
          </HeroContainer>
        </HeroSection>

        <ContentSection>
          <ContentContainer>
            <AccordionList>
              {faqItems.map((item, index) => (
                <AccordionItem key={index}>
                  <AccordionButton
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={expandedIndex === index}
                  >
                    <QuestionText>{item.question}</QuestionText>
                    <ExpandIcon $expanded={expandedIndex === index}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </ExpandIcon>
                  </AccordionButton>
                  <AccordionContent $expanded={expandedIndex === index}>
                    <AnswerText>{item.answer}</AnswerText>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionList>

            <ContactCTA>
              <CTATitle>For all other questions email us at</CTATitle>
              <CTAEmail href="mailto:hi@bluesignal.xyz">hi@bluesignal.xyz</CTAEmail>
              <CTAPhone>Text or call +1.512.730.0843</CTAPhone>
            </ContactCTA>
          </ContentContainer>
        </ContentSection>
      </MainContent>

      <SalesFooter onNavigate={handleNavigate} />
    </PageWrapper>
  );
}
