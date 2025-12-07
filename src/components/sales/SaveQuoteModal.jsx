// Save Quote Modal - Collects customer and site info to persist quote
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CustomerAPI, SiteAPI } from "../../scripts/back_door";
import orderService from "../../services/orderService";
import { useAppContext } from "../../context/AppContext";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid ${(props) => (props.active ? "#3b82f6" : "#d1d5db")};
  border-radius: 6px;
  background: ${(props) => (props.active ? "#eff6ff" : "#ffffff")};
  color: ${(props) => (props.active ? "#3b82f6" : "#6b7280")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const CustomerCard = styled.div`
  padding: 12px;
  border: 1px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  background: ${(props) => (props.selected ? "#eff6ff" : "#ffffff")};
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CustomerName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }
  `
      : `
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const QuoteSummary = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
    font-weight: 600;
    color: #1f2937;
    font-size: 16px;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
`;

const CUSTOMER_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "municipal", label: "Municipal" },
  { value: "agricultural", label: "Agricultural" },
  { value: "educational", label: "Educational" },
  { value: "research", label: "Research" },
];

const SaveQuoteModal = ({
  isOpen,
  onClose,
  quoteItems,
  products,
  onQuoteSaved,
}) => {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [step, setStep] = useState(1); // 1: customer, 2: site, 3: review
  const [customerTab, setCustomerTab] = useState("new"); // "new" or "existing"
  const [siteTab, setSiteTab] = useState("new");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Existing data
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [existingSites, setExistingSites] = useState([]);

  // Selected data
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  // New customer form
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "residential",
  });

  // New site form
  const [siteForm, setSiteForm] = useState({
    name: "",
    address: "",
    type: "residential",
    waterBodyName: "",
    notes: "",
  });

  // Quote notes
  const [quoteNotes, setQuoteNotes] = useState("");

  // Calculate totals
  const subtotal = quoteItems.reduce(
    (sum, item) => sum + products[item.productId].price * item.quantity,
    0
  );
  const itemCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  // Load existing customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customers = await CustomerAPI.list({ limit: 50 });
        setExistingCustomers(customers || []);
      } catch (err) {
        console.warn("Failed to load customers:", err);
      }
    };
    if (isOpen) {
      loadCustomers();
    }
  }, [isOpen]);

  // Load sites when customer is selected
  useEffect(() => {
    const loadSites = async () => {
      if (selectedCustomerId) {
        try {
          const sites = await SiteAPI.listByCustomer(selectedCustomerId);
          setExistingSites(sites || []);
        } catch (err) {
          console.warn("Failed to load sites:", err);
        }
      }
    };
    loadSites();
  }, [selectedCustomerId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setCustomerTab("new");
      setSiteTab("new");
      setSelectedCustomerId(null);
      setSelectedSiteId(null);
      setCustomerForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        type: "residential",
      });
      setSiteForm({
        name: "",
        address: "",
        type: "residential",
        waterBodyName: "",
        notes: "",
      });
      setQuoteNotes("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleCustomerFormChange = (field, value) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSiteFormChange = (field, value) => {
    setSiteForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateCustomer = () => {
    if (customerTab === "existing") {
      return !!selectedCustomerId;
    }
    return customerForm.name && customerForm.email;
  };

  const validateSite = () => {
    if (siteTab === "existing") {
      return !!selectedSiteId;
    }
    return siteForm.name && siteForm.address;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!validateCustomer()) {
        setError("Please complete customer information");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateSite()) {
        setError("Please complete site information");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSaveQuote = async () => {
    setLoading(true);
    setError(null);

    try {
      let customerId = selectedCustomerId;
      let siteId = selectedSiteId;

      // Create new customer if needed
      if (customerTab === "new") {
        const customerResult = await CustomerAPI.create({
          ...customerForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        customerId = customerResult?.id;
      }

      // Create new site if needed
      if (siteTab === "new" && customerId) {
        const siteResult = await SiteAPI.create({
          ...siteForm,
          customerId,
          coordinates: { lat: 0, lng: 0 }, // Will be updated later
          deviceIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        siteId = siteResult?.id;
      }

      // Create the quote/order
      const lineItems = quoteItems.map((item) => ({
        sku: products[item.productId].sku,
        quantity: item.quantity,
      }));

      const quote = await orderService.createQuote(
        {
          customerId,
          siteId,
          lineItems,
          notes: quoteNotes,
        },
        user?.uid || "anonymous"
      );

      setSuccess(true);

      // Notify parent
      if (onQuoteSaved) {
        onQuoteSaved(quote);
      }

      // Show success notification
      if (ACTIONS?.logNotification) {
        ACTIONS.logNotification("success", "Quote saved successfully!");
      }

      // Close after delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to save quote:", err);
      setError(err.message || "Failed to save quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {step === 1 && "Save Quote - Customer Information"}
            {step === 2 && "Save Quote - Site Information"}
            {step === 3 && "Save Quote - Review & Confirm"}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && (
            <SuccessMessage>Quote saved successfully!</SuccessMessage>
          )}

          {/* Quote Summary */}
          <QuoteSummary>
            <SummaryRow>
              <span>Items</span>
              <span>{itemCount} units</span>
            </SummaryRow>
            <SummaryRow>
              <span>Quote Total</span>
              <span>${subtotal.toLocaleString()}</span>
            </SummaryRow>
          </QuoteSummary>

          {/* Step 1: Customer */}
          {step === 1 && (
            <Section>
              <SectionTitle>Customer</SectionTitle>
              <TabsContainer>
                <Tab
                  active={customerTab === "new"}
                  onClick={() => setCustomerTab("new")}
                >
                  New Customer
                </Tab>
                <Tab
                  active={customerTab === "existing"}
                  onClick={() => setCustomerTab("existing")}
                >
                  Existing Customer
                </Tab>
              </TabsContainer>

              {customerTab === "new" ? (
                <>
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input
                      type="text"
                      placeholder="Full name or company name"
                      value={customerForm.name}
                      onChange={(e) =>
                        handleCustomerFormChange("name", e.target.value)
                      }
                    />
                  </FormGroup>
                  <Row>
                    <FormGroup>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={customerForm.email}
                        onChange={(e) =>
                          handleCustomerFormChange("email", e.target.value)
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        placeholder="(555) 555-5555"
                        value={customerForm.phone}
                        onChange={(e) =>
                          handleCustomerFormChange("phone", e.target.value)
                        }
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup>
                      <Label>Company</Label>
                      <Input
                        type="text"
                        placeholder="Company name (optional)"
                        value={customerForm.company}
                        onChange={(e) =>
                          handleCustomerFormChange("company", e.target.value)
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Type</Label>
                      <Select
                        value={customerForm.type}
                        onChange={(e) =>
                          handleCustomerFormChange("type", e.target.value)
                        }
                      >
                        {CUSTOMER_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                  </Row>
                </>
              ) : (
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {existingCustomers.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        padding: 20,
                      }}
                    >
                      No existing customers found
                    </div>
                  ) : (
                    existingCustomers.map((customer) => (
                      <CustomerCard
                        key={customer.id}
                        selected={selectedCustomerId === customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                      >
                        <CustomerName>{customer.name}</CustomerName>
                        <CustomerEmail>{customer.email}</CustomerEmail>
                      </CustomerCard>
                    ))
                  )}
                </div>
              )}
            </Section>
          )}

          {/* Step 2: Site */}
          {step === 2 && (
            <Section>
              <SectionTitle>Installation Site</SectionTitle>
              <TabsContainer>
                <Tab
                  active={siteTab === "new"}
                  onClick={() => setSiteTab("new")}
                >
                  New Site
                </Tab>
                <Tab
                  active={siteTab === "existing"}
                  onClick={() => setSiteTab("existing")}
                  disabled={existingSites.length === 0}
                >
                  Existing Site ({existingSites.length})
                </Tab>
              </TabsContainer>

              {siteTab === "new" ? (
                <>
                  <FormGroup>
                    <Label>Site Name *</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Main Pond, North Lake"
                      value={siteForm.name}
                      onChange={(e) =>
                        handleSiteFormChange("name", e.target.value)
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Address *</Label>
                    <Input
                      type="text"
                      placeholder="Full address"
                      value={siteForm.address}
                      onChange={(e) =>
                        handleSiteFormChange("address", e.target.value)
                      }
                    />
                  </FormGroup>
                  <Row>
                    <FormGroup>
                      <Label>Site Type</Label>
                      <Select
                        value={siteForm.type}
                        onChange={(e) =>
                          handleSiteFormChange("type", e.target.value)
                        }
                      >
                        {CUSTOMER_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Water Body Name</Label>
                      <Input
                        type="text"
                        placeholder="Lake/Pond name"
                        value={siteForm.waterBodyName}
                        onChange={(e) =>
                          handleSiteFormChange("waterBodyName", e.target.value)
                        }
                      />
                    </FormGroup>
                  </Row>
                  <FormGroup>
                    <Label>Site Notes</Label>
                    <TextArea
                      placeholder="Access instructions, special considerations..."
                      value={siteForm.notes}
                      onChange={(e) =>
                        handleSiteFormChange("notes", e.target.value)
                      }
                    />
                  </FormGroup>
                </>
              ) : (
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {existingSites.map((site) => (
                    <CustomerCard
                      key={site.id}
                      selected={selectedSiteId === site.id}
                      onClick={() => setSelectedSiteId(site.id)}
                    >
                      <CustomerName>{site.name}</CustomerName>
                      <CustomerEmail>{site.address}</CustomerEmail>
                    </CustomerCard>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              <Section>
                <SectionTitle>Quote Items</SectionTitle>
                {quoteItems.map((item) => {
                  const product = products[item.productId];
                  return (
                    <div
                      key={item.productId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <span>
                        {product.name} x {item.quantity}
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        ${(product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </Section>

              <Section>
                <SectionTitle>Customer</SectionTitle>
                <div style={{ color: "#374151" }}>
                  {customerTab === "new"
                    ? `${customerForm.name} (${customerForm.email})`
                    : existingCustomers.find((c) => c.id === selectedCustomerId)
                        ?.name || "Selected customer"}
                </div>
              </Section>

              <Section>
                <SectionTitle>Site</SectionTitle>
                <div style={{ color: "#374151" }}>
                  {siteTab === "new"
                    ? siteForm.name
                    : existingSites.find((s) => s.id === selectedSiteId)
                        ?.name || "Selected site"}
                </div>
              </Section>

              <Section>
                <SectionTitle>Quote Notes</SectionTitle>
                <TextArea
                  placeholder="Add any notes for this quote..."
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                />
              </Section>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {step > 1 && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSaveQuote}
              disabled={loading || success}
            >
              {loading ? "Saving..." : "Save Quote"}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default SaveQuoteModal;
