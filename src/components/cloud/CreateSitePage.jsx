// /src/components/cloud/CreateSitePage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import { useAppContext } from "../../context/AppContext";
import { GeocodingAPI } from "../../scripts/back_door";
import { LocationCapture } from "../installer";
import { ButtonPrimary, ButtonSecondary } from "../shared/button/Button";
import { Input } from "../shared/input/Input";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const FormContainer = styled.div`
  max-width: 700px;
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors?.red500 || "#ef4444"};
  margin-left: 2px;
`;

const Select = styled.select`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  height: 44px;
  padding: 0px 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors?.ui800 || "#27272a"};
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors?.primary50 || "#EFFBFB"};
  }
`;

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  padding: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors?.ui800 || "#27272a"};
  width: 100%;
  min-height: 100px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors?.primary50 || "#EFFBFB"};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || "1fr 1fr"};
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const LocationPreview = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const LocationLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors?.ui500 || "#71717a"};
  margin-bottom: 8px;
`;

const LocationValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui800 || "#27272a"};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors?.red50 || "#fef2f2"};
  border: 1px solid ${({ theme }) => theme.colors?.red200 || "#fecaca"};
  color: ${({ theme }) => theme.colors?.red700 || "#b91c1c"};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #86efac;
  color: #065f46;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function CreateSitePage() {
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLocationCapture, setShowLocationCapture] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "monitoring",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
    location: null,
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    metadata: {
      waterBodyType: "",
      accessNotes: "",
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleMetadataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const handleLocationCapture = (loc) => {
    setFormData((prev) => ({
      ...prev,
      location: loc,
    }));
    setShowLocationCapture(false);

    // Auto-fill address if available
    if (loc.address) {
      // Parse address if it's a string
      if (typeof loc.address === "string") {
        handleAddressChange("street", loc.address);
      }
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Site name is required");
      return false;
    }

    if (!formData.address.city.trim()) {
      setError("City is required");
      return false;
    }

    if (!formData.address.state.trim()) {
      setError("State is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Build full address string for geocoding
      const fullAddress = [
        formData.address.street,
        formData.address.city,
        formData.address.state,
        formData.address.zip,
        formData.address.country,
      ]
        .filter(Boolean)
        .join(", ");

      const siteData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        address: fullAddress,
        ownerId: user?.uid,
        contact: formData.contact,
        metadata: formData.metadata,
      };

      // Add coordinates if captured
      if (formData.location) {
        siteData.latitude = formData.location.latitude;
        siteData.longitude = formData.location.longitude;
      }

      const result = await GeocodingAPI.createSite(siteData);

      ACTIONS?.logNotification?.("success", "Site created successfully!");
      navigate(`/cloud/sites/${result.siteId}`);
    } catch (err) {
      console.error("Error creating site:", err);
      setError(err.message || "Failed to create site. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CloudPageLayout
      title="Create New Site"
      subtitle="Add a new monitoring location"
    >
      <FormContainer>
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Section>
            <SectionTitle>Basic Information</SectionTitle>

            <FormGroup>
              <Label htmlFor="name">
                Site Name <Required>*</Required>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Deep Creek Monitoring Station"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="type">Site Type</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="monitoring">Water Quality Monitoring</option>
                <option value="treatment">Treatment Facility</option>
                <option value="agricultural">Agricultural Site</option>
                <option value="industrial">Industrial Site</option>
                <option value="research">Research Station</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of the site..."
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Address</SectionTitle>

            <FormGroup>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="123 Main Street"
              />
            </FormGroup>

            <Row>
              <FormGroup>
                <Label htmlFor="city">
                  City <Required>*</Required>
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="City"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="state">
                  State <Required>*</Required>
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="State"
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  type="text"
                  value={formData.address.zip}
                  onChange={(e) => handleAddressChange("zip", e.target.value)}
                  placeholder="12345"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  placeholder="United States"
                />
              </FormGroup>
            </Row>
          </Section>

          <Section>
            <SectionTitle>GPS Location</SectionTitle>

            {formData.location ? (
              <LocationPreview>
                <LocationLabel>Captured Coordinates</LocationLabel>
                <LocationValue>
                  {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                </LocationValue>
                {formData.location.address && (
                  <>
                    <LocationLabel style={{ marginTop: 12 }}>Address</LocationLabel>
                    <LocationValue>{formData.location.address}</LocationValue>
                  </>
                )}
                <ButtonSecondary
                  type="button"
                  style={{ marginTop: 16 }}
                  onClick={() => setShowLocationCapture(true)}
                >
                  Update Location
                </ButtonSecondary>
              </LocationPreview>
            ) : showLocationCapture ? (
              <LocationCapture
                onLocationCaptured={handleLocationCapture}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 24 }}>
                <p style={{ color: "#6b7280", marginBottom: 16 }}>
                  Capture the exact GPS coordinates for this site.
                </p>
                <ButtonSecondary
                  type="button"
                  onClick={() => setShowLocationCapture(true)}
                >
                  Capture Location
                </ButtonSecondary>
              </div>
            )}
          </Section>

          <Section>
            <SectionTitle>Site Details</SectionTitle>

            <FormGroup>
              <Label htmlFor="waterBodyType">Water Body Type</Label>
              <Select
                id="waterBodyType"
                value={formData.metadata.waterBodyType}
                onChange={(e) => handleMetadataChange("waterBodyType", e.target.value)}
              >
                <option value="">Select type...</option>
                <option value="lake">Lake</option>
                <option value="river">River</option>
                <option value="stream">Stream</option>
                <option value="pond">Pond</option>
                <option value="reservoir">Reservoir</option>
                <option value="estuary">Estuary</option>
                <option value="wetland">Wetland</option>
                <option value="coastal">Coastal/Ocean</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="accessNotes">Access Notes</Label>
              <TextArea
                id="accessNotes"
                value={formData.metadata.accessNotes}
                onChange={(e) => handleMetadataChange("accessNotes", e.target.value)}
                placeholder="Gate codes, parking instructions, key contacts..."
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Site Contact (Optional)</SectionTitle>

            <FormGroup>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                type="text"
                value={formData.contact.name}
                onChange={(e) => handleContactChange("name", e.target.value)}
                placeholder="Site manager name"
              />
            </FormGroup>

            <Row>
              <FormGroup>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  placeholder="contact@example.com"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </FormGroup>
            </Row>
          </Section>

          <ButtonGroup>
            <ButtonSecondary type="button" onClick={() => navigate(-1)}>
              Cancel
            </ButtonSecondary>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Site"}
            </ButtonPrimary>
          </ButtonGroup>
        </form>
      </FormContainer>
    </CloudPageLayout>
  );
}
