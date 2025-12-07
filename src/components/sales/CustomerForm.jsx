// Customer Form Component - Create/Edit customer
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { CustomerAPI } from "../../scripts/back_door";
import customerService from "../../services/customerService";
import { useAppContext } from "../../context/AppContext";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

const Form = styled.form`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
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

const Required = styled.span`
  color: #dc2626;
  margin-left: 2px;
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

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
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
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.cols || "1fr 1fr"};
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
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
      : props.variant === "danger"
      ? `
    background: #ffffff;
    border: 1px solid #dc2626;
    color: #dc2626;

    &:hover:not(:disabled) {
      background: #fef2f2;
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

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const CUSTOMER_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "municipal", label: "Municipal" },
  { value: "agricultural", label: "Agricultural" },
  { value: "educational", label: "Educational" },
  { value: "research", label: "Research" },
];

const CustomerForm = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { ACTIONS } = useAppContext();

  const isEditing = customerId && customerId !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "residential",
    notes: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      const customer = await CustomerAPI.get(customerId);
      if (customer) {
        setForm({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          company: customer.company || "",
          type: customer.type || "residential",
          notes: customer.notes || "",
          address: customer.address || {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "USA",
          },
        });
      }
    } catch (err) {
      console.error("Failed to load customer:", err);
      setError("Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setSaving(true);

    try {
      if (isEditing) {
        await CustomerAPI.update(customerId, {
          ...form,
          updatedAt: new Date().toISOString(),
        });
        ACTIONS?.logNotification?.("success", "Customer updated successfully");
      } else {
        await customerService.createCustomer(form);
        ACTIONS?.logNotification?.("success", "Customer created successfully");
      }
      navigate("/customers");
    } catch (err) {
      console.error("Failed to save customer:", err);
      setError(err.message || "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    setSaving(true);
    try {
      await customerService.deleteCustomer(customerId);
      ACTIONS?.logNotification?.("success", "Customer deleted successfully");
      navigate("/customers");
    } catch (err) {
      console.error("Failed to delete customer:", err);
      setError(err.message || "Failed to delete customer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading customer...</LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackLink onClick={() => navigate("/customers")}>
          ← Back to Customers
        </BackLink>
        <PageTitle>{isEditing ? "Edit Customer" : "New Customer"}</PageTitle>
      </PageHeader>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Section>
          <SectionTitle>Contact Information</SectionTitle>
          <FormGroup>
            <Label>
              Name <Required>*</Required>
            </Label>
            <Input
              type="text"
              placeholder="Full name or company name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>
                Email <Required>*</Required>
              </Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                placeholder="(555) 555-5555"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Company</Label>
              <Input
                type="text"
                placeholder="Company name"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Customer Type</Label>
              <Select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {CUSTOMER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Address</SectionTitle>
          <FormGroup>
            <Label>Street Address</Label>
            <Input
              type="text"
              placeholder="123 Main Street"
              value={form.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
            />
          </FormGroup>
          <Row cols="2fr 1fr 1fr">
            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                placeholder="City"
                value={form.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                placeholder="State"
                value={form.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>ZIP</Label>
              <Input
                type="text"
                placeholder="12345"
                value={form.address.zip}
                onChange={(e) => handleAddressChange("zip", e.target.value)}
              />
            </FormGroup>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Notes</SectionTitle>
          <FormGroup>
            <TextArea
              placeholder="Any additional notes about this customer..."
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </FormGroup>
        </Section>

        <ButtonGroup>
          {isEditing && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button type="button" onClick={() => navigate("/customers")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update Customer" : "Create Customer"}
          </Button>
        </ButtonGroup>
      </Form>
    </PageContainer>
  );
};

export default CustomerForm;
