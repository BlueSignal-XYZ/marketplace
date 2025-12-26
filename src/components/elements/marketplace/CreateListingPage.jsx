// /src/components/elements/marketplace/CreateListingPage.jsx
/**
 * Create Listing Page - Allow sellers to list nutrient credits for sale
 */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { CreditsMarketplaceAPI, GeocodingAPI } from "../../../scripts/back_door";
import { ButtonPrimary, ButtonSecondary } from "../../shared/button/Button";
import { Input } from "../../shared/input/Input";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 0;
    font-size: 15px;
    color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  }
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

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || "#71717a"};
  margin-top: 6px;
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

const PriceInput = styled.div`
  position: relative;

  input {
    padding-left: 32px;
  }

  &::before {
    content: "$";
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors?.ui500 || "#71717a"};
    font-weight: 500;
  }
`;

const PreviewCard = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 20px;
`;

const PreviewTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  margin-bottom: 12px;
`;

const PreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};

  &:last-child {
    border-bottom: none;
  }
`;

const PreviewLabel = styled.span`
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
`;

const PreviewValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const TotalRow = styled(PreviewRow)`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  font-size: 16px;
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

const ImageUploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary500 || "#0284c7"};
    background: ${({ theme }) => theme.colors?.primary50 || "#e0f2ff"};
  }

  input {
    display: none;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    border: none;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: rgba(220, 38, 38, 0.8);
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                              CONSTANTS                                     */
/* -------------------------------------------------------------------------- */

const CREDIT_TYPES = [
  { value: "nitrogen", label: "Nitrogen Credits" },
  { value: "phosphorus", label: "Phosphorus Credits" },
  { value: "carbon", label: "Carbon Credits" },
  { value: "water_quality", label: "Water Quality Credits" },
];

const VERIFICATION_STANDARDS = [
  { value: "verra", label: "Verra VCS" },
  { value: "gold_standard", label: "Gold Standard" },
  { value: "american_carbon", label: "American Carbon Registry" },
  { value: "climate_action", label: "Climate Action Reserve" },
  { value: "internal", label: "Internal Verification" },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    creditType: "nitrogen",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    description: "",
    siteId: "",
    verificationStandard: "",
    vintageYear: new Date().getFullYear().toString(),
    expirationDate: "",
    minimumPurchase: "1",
    images: [],
    metadata: {
      projectName: "",
      methodology: "",
      additionalInfo: "",
    },
  });

  // Load user's sites
  useEffect(() => {
    loadSites();
  }, [user?.uid]);

  const loadSites = async () => {
    try {
      const response = await GeocodingAPI.listSites({ ownerId: user?.uid });
      setSites(response.sites || []);
    } catch (err) {
      console.error("Error loading sites:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = await Promise.all(
      files.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              id: Date.now() + Math.random(),
              url: event.target.result,
              name: file.name,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError("Valid quantity is required");
      return false;
    }

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      setError("Valid price is required");
      return false;
    }

    if (!formData.siteId) {
      setError("Please select a site");
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
      const listingData = {
        sellerId: user?.uid,
        creditType: formData.creditType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        currency: "USD",
        siteId: formData.siteId,
        title: formData.title,
        description: formData.description,
        verificationStandard: formData.verificationStandard,
        vintageYear: parseInt(formData.vintageYear),
        expirationDate: formData.expirationDate || null,
        minimumPurchase: parseFloat(formData.minimumPurchase) || 1,
        metadata: formData.metadata,
        images: formData.images.map((img) => img.url),
      };

      const result = await CreditsMarketplaceAPI.createListing(listingData);

      ACTIONS?.logNotification?.("success", "Listing created successfully!");
      navigate(`/marketplace/listing/${result.listingId}`);
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err.message || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalValue = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.pricePerUnit) || 0);

  return (
    <PageContainer>
      <PageHeader>
        <h1>Create Credit Listing</h1>
        <p>List your nutrient credits for sale on the marketplace</p>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Section>
          <SectionTitle>Listing Details</SectionTitle>

          <FormGroup>
            <Label htmlFor="title">
              Listing Title <Required>*</Required>
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Premium Nitrogen Credits - Deep Creek Project"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="creditType">
              Credit Type <Required>*</Required>
            </Label>
            <Select
              id="creditType"
              value={formData.creditType}
              onChange={(e) => handleChange("creditType", e.target.value)}
            >
              {CREDIT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <Row>
            <FormGroup>
              <Label htmlFor="quantity">
                Quantity <Required>*</Required>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                placeholder="100"
              />
              <HelpText>Number of credits to list</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="unit">Unit</Label>
              <Select
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="tonne">Tonnes</option>
                <option value="lb">Pounds (lb)</option>
              </Select>
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label htmlFor="pricePerUnit">
                Price per Unit <Required>*</Required>
              </Label>
              <PriceInput>
                <Input
                  id="pricePerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleChange("pricePerUnit", e.target.value)}
                  placeholder="25.00"
                />
              </PriceInput>
              <HelpText>USD per {formData.unit}</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="minimumPurchase">Minimum Purchase</Label>
              <Input
                id="minimumPurchase"
                type="number"
                min="1"
                value={formData.minimumPurchase}
                onChange={(e) => handleChange("minimumPurchase", e.target.value)}
                placeholder="1"
              />
              <HelpText>Minimum quantity per order</HelpText>
            </FormGroup>
          </Row>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your credits, the project, and any relevant details..."
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Project Information</SectionTitle>

          <FormGroup>
            <Label htmlFor="siteId">
              Project Site <Required>*</Required>
            </Label>
            <Select
              id="siteId"
              value={formData.siteId}
              onChange={(e) => handleChange("siteId", e.target.value)}
            >
              <option value="">Select a site...</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </Select>
            <HelpText>
              <span
                style={{ color: "#0284c7", cursor: "pointer" }}
                onClick={() => navigate("/cloud/sites/new")}
              >
                + Create new site
              </span>
            </HelpText>
          </FormGroup>

          <Row>
            <FormGroup>
              <Label htmlFor="verificationStandard">Verification Standard</Label>
              <Select
                id="verificationStandard"
                value={formData.verificationStandard}
                onChange={(e) => handleChange("verificationStandard", e.target.value)}
              >
                <option value="">Select standard...</option>
                {VERIFICATION_STANDARDS.map((std) => (
                  <option key={std.value} value={std.value}>
                    {std.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="vintageYear">Vintage Year</Label>
              <Select
                id="vintageYear"
                value={formData.vintageYear}
                onChange={(e) => handleChange("vintageYear", e.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </Select>
            </FormGroup>
          </Row>

          <FormGroup>
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleChange("expirationDate", e.target.value)}
            />
            <HelpText>Leave blank if credits do not expire</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              type="text"
              value={formData.metadata.projectName}
              onChange={(e) => handleMetadataChange("projectName", e.target.value)}
              placeholder="Official project name"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="methodology">Methodology</Label>
            <Input
              id="methodology"
              type="text"
              value={formData.metadata.methodology}
              onChange={(e) => handleMetadataChange("methodology", e.target.value)}
              placeholder="e.g., VM0042 - Improved Agricultural Land Management"
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Images</SectionTitle>

          <ImageUploadArea as="label">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600 }}>Upload Images</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Drag and drop or click to browse
            </div>
          </ImageUploadArea>

          {formData.images.length > 0 && (
            <ImagePreviewGrid>
              {formData.images.map((img) => (
                <ImagePreview key={img.id}>
                  <img src={img.url} alt={img.name} />
                  <button type="button" onClick={() => handleRemoveImage(img.id)}>
                    X
                  </button>
                </ImagePreview>
              ))}
            </ImagePreviewGrid>
          )}
        </Section>

        <Section>
          <SectionTitle>Listing Preview</SectionTitle>

          <PreviewCard>
            <PreviewTitle>{formData.title || "Untitled Listing"}</PreviewTitle>

            <PreviewRow>
              <PreviewLabel>Credit Type</PreviewLabel>
              <PreviewValue>
                {CREDIT_TYPES.find((t) => t.value === formData.creditType)?.label}
              </PreviewValue>
            </PreviewRow>

            <PreviewRow>
              <PreviewLabel>Quantity</PreviewLabel>
              <PreviewValue>
                {formData.quantity || "0"} {formData.unit}
              </PreviewValue>
            </PreviewRow>

            <PreviewRow>
              <PreviewLabel>Price per Unit</PreviewLabel>
              <PreviewValue>
                ${parseFloat(formData.pricePerUnit || 0).toFixed(2)}/{formData.unit}
              </PreviewValue>
            </PreviewRow>

            <TotalRow>
              <PreviewLabel>Total Listing Value</PreviewLabel>
              <PreviewValue style={{ color: "#16a34a" }}>
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </PreviewValue>
            </TotalRow>
          </PreviewCard>
        </Section>

        <ButtonGroup>
          <ButtonSecondary type="button" onClick={() => navigate(-1)}>
            Cancel
          </ButtonSecondary>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Listing"}
          </ButtonPrimary>
        </ButtonGroup>
      </form>
    </PageContainer>
  );
}
