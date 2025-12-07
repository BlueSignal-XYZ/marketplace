// Site Form Component - Create/Edit site
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { SiteAPI, CustomerAPI } from "../../scripts/back_door";
import siteService from "../../services/siteService";
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

const SITE_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "municipal", label: "Municipal" },
  { value: "agricultural", label: "Agricultural" },
  { value: "educational", label: "Educational" },
  { value: "research", label: "Research" },
];

const WATER_BODY_TYPES = [
  { value: "", label: "Select type..." },
  { value: "pond", label: "Pond" },
  { value: "lake", label: "Lake" },
  { value: "reservoir", label: "Reservoir" },
  { value: "stream", label: "Stream" },
  { value: "river", label: "River" },
  { value: "marina", label: "Marina" },
  { value: "aquaculture", label: "Aquaculture" },
  { value: "wastewater", label: "Wastewater" },
  { value: "other", label: "Other" },
];

const SiteForm = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [searchParams] = useSearchParams();
  const initialCustomerId = searchParams.get("customer");
  const { ACTIONS } = useAppContext();

  const isEditing = siteId && siteId !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    customerId: initialCustomerId || "",
    name: "",
    address: "",
    type: "residential",
    waterBodyType: "",
    waterBodyName: "",
    accessNotes: "",
    contactName: "",
    contactPhone: "",
    coordinates: { lat: 0, lng: 0 },
  });

  useEffect(() => {
    loadCustomers();
    if (isEditing) {
      loadSite();
    }
  }, [siteId]);

  const loadCustomers = async () => {
    try {
      const data = await CustomerAPI.list({ limit: 100 });
      setCustomers(data || []);
    } catch (err) {
      console.warn("Failed to load customers:", err);
    }
  };

  const loadSite = async () => {
    try {
      const site = await SiteAPI.get(siteId);
      if (site) {
        setForm({
          customerId: site.customerId || "",
          name: site.name || "",
          address: site.address || "",
          type: site.type || "residential",
          waterBodyType: site.waterBodyType || "",
          waterBodyName: site.waterBodyName || "",
          accessNotes: site.accessNotes || "",
          contactName: site.contactName || "",
          contactPhone: site.contactPhone || "",
          coordinates: site.coordinates || { lat: 0, lng: 0 },
        });
      }
    } catch (err) {
      console.error("Failed to load site:", err);
      setError("Failed to load site");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.customerId) {
      setError("Please select a customer");
      return false;
    }
    if (!form.name.trim()) {
      setError("Site name is required");
      return false;
    }
    if (!form.address.trim()) {
      setError("Address is required");
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
        await SiteAPI.update(siteId, {
          ...form,
          updatedAt: new Date().toISOString(),
        });
        ACTIONS?.logNotification?.("success", "Site updated successfully");
      } else {
        await siteService.createSite(form);
        ACTIONS?.logNotification?.("success", "Site created successfully");
      }
      navigate("/sites");
    } catch (err) {
      console.error("Failed to save site:", err);
      setError(err.message || "Failed to save site");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this site?")) {
      return;
    }

    setSaving(true);
    try {
      await siteService.deleteSite(siteId);
      ACTIONS?.logNotification?.("success", "Site deleted successfully");
      navigate("/sites");
    } catch (err) {
      console.error("Failed to delete site:", err);
      setError(err.message || "Failed to delete site");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading site...</LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackLink onClick={() => navigate("/sites")}>← Back to Sites</BackLink>
        <PageTitle>{isEditing ? "Edit Site" : "New Site"}</PageTitle>
      </PageHeader>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Section>
          <SectionTitle>Site Information</SectionTitle>
          <FormGroup>
            <Label>
              Customer <Required>*</Required>
            </Label>
            <Select
              value={form.customerId}
              onChange={(e) => handleChange("customerId", e.target.value)}
            >
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              Site Name <Required>*</Required>
            </Label>
            <Input
              type="text"
              placeholder="e.g., Main Pond, North Lake Installation"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Address <Required>*</Required>
            </Label>
            <Input
              type="text"
              placeholder="Full street address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Site Type</Label>
              <Select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {SITE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Water Body Type</Label>
              <Select
                value={form.waterBodyType}
                onChange={(e) => handleChange("waterBodyType", e.target.value)}
              >
                {WATER_BODY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Water Body Name</Label>
            <Input
              type="text"
              placeholder="e.g., Deep Creek Lake, Mill Pond"
              value={form.waterBodyName}
              onChange={(e) => handleChange("waterBodyName", e.target.value)}
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Site Contact</SectionTitle>
          <Row>
            <FormGroup>
              <Label>Contact Name</Label>
              <Input
                type="text"
                placeholder="On-site contact person"
                value={form.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Contact Phone</Label>
              <Input
                type="tel"
                placeholder="(555) 555-5555"
                value={form.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </FormGroup>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Access Notes</SectionTitle>
          <FormGroup>
            <TextArea
              placeholder="Gate codes, directions, parking instructions, best times to visit..."
              value={form.accessNotes}
              onChange={(e) => handleChange("accessNotes", e.target.value)}
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
          <Button type="button" onClick={() => navigate("/sites")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update Site" : "Create Site"}
          </Button>
        </ButtonGroup>
      </Form>
    </PageContainer>
  );
};

export default SiteForm;
