// ContactPage - Contact form with Austin location map
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";
import SalesHeader from "./SalesHeader";
import SalesFooter from "./SalesFooter";
import { useNavigate } from "react-router-dom";
import useFormSubmit from "../hooks/useFormSubmit";

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
  max-width: 1100px;
  margin: 0 auto;
`;

const Grid = styled.div`
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

const SectionTitle = styled.h2`
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

const Form = styled.form`
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
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
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
    description: "Professional cleaning for boat docks, piers, and waterfront structures. We remove algae, mildew, mineral deposits, and years of grime buildup. Includes deck surface, railings, and dock boxes.",
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
    description: "Maximize your solar efficiency with professional cleaning. Dirty panels lose 15-25% efficiency. We use deionized water and soft brushes\u2014no scratches, no residue, no voided warranties.",
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
    description: "Restore your pool deck, pond edges, or patio to like-new condition. We handle concrete, pavers, flagstone, and composite decking. Great for algae-prone areas.",
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
    description: "HOA common areas, municipal facilities, marinas, and large-scale projects. Volume discounts available. We carry full liability insurance and can provide COIs.",
    price: "Contact for quote"
  }
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    product: ""
  });
  const { formState, submitForm, reset } = useFormSubmit('contact_submissions');

  const handleNavigate = (sectionId) => {
    navigate(`/?section=${sectionId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await submitForm({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      product: formData.product,
      type: 'contact'
    });

    if (success) {
      setFormData({ name: "", email: "", message: "", product: "" });
    }
  };

  // Auto-reset form state after showing success for 10 seconds
  useEffect(() => {
    if (formState.status === 'success') {
      const timer = setTimeout(reset, 10000);
      return () => clearTimeout(timer);
    }
  }, [formState.status, reset]);

  return (
    <PageWrapper>
      <SalesHeader
        activeSection="contact"
        onNavigate={handleNavigate}
        quoteItemCount={0}
        onOpenQuote={() => navigate("/?quote=true")}
      />

      <MainContent>
        <HeroSection>
          <HeroContainer>
            <PageTitle>Get in Touch</PageTitle>
            <PageSubtitle>
              Have questions about our products or need help with your water quality project? We're here to help.
            </PageSubtitle>
          </HeroContainer>
        </HeroSection>

        <ContentSection>
          <ContentContainer>
            <Grid>
              <MapSection>
                <SectionTitle>Operating in Austin</SectionTitle>
                <MapContainer>
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-98.0731%2C30.1007%2C-97.5631%2C30.5407&amp;layer=mapnik&amp;marker=30.2672%2C-97.7431"
                    title="BlueSignal Location - Austin, TX"
                    loading="lazy"
                  />
                </MapContainer>
              </MapSection>

              <FormSection>
                <SectionTitle>Drop us a line...</SectionTitle>
                {formState.status === 'success' ? (
                  <SuccessMessage>
                    Thank you for your message! We'll get back to you within 24 hours.
                  </SuccessMessage>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Jane Smith"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={formState.status === 'submitting'}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jane@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={formState.status === 'submitting'}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="message">Message</Label>
                      <TextArea
                        id="message"
                        name="message"
                        placeholder="Hi team..."
                        value={formData.message}
                        onChange={handleChange}
                        disabled={formState.status === 'submitting'}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="product">Products for purchase</Label>
                      <Select
                        id="product"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        disabled={formState.status === 'submitting'}
                      >
                        {productOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <SubmitButton type="submit" disabled={formState.status === 'submitting'}>
                      {formState.status === 'submitting' ? "Sending..." : "Submit"}
                    </SubmitButton>

                    {formState.status === 'error' && (
                      <ErrorMessage>{formState.error}</ErrorMessage>
                    )}

                    <ContactInfo>
                      <strong>Text or call</strong> +1.512.730.0843
                    </ContactInfo>
                  </Form>
                )}
              </FormSection>
            </Grid>
          </ContentContainer>
        </ContentSection>

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
      </MainContent>

      <SalesFooter onNavigate={handleNavigate} />
    </PageWrapper>
  );
}
