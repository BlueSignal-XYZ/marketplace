// /src/components/cloud/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import { useAppContext } from "../../context/AppContext";
import { UserProfileAPI } from "../../scripts/back_door";
import { ButtonPrimary, ButtonSecondary, ButtonDanger } from "../shared/button/Button";
import { Input } from "../shared/input/Input";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 800px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AvatarSection = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors?.primary100 || "#e0f2ff"};
  color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  margin: 0 auto 16px;
`;

const UserName = styled.h3`
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const UserEmail = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $role }) => {
    switch ($role) {
      case "admin": return "#fef3c7";
      case "installer": return "#dbeafe";
      case "seller": return "#d1fae5";
      case "buyer": return "#e0e7ff";
      default: return "#f3f4f6";
    }
  }};
  color: ${({ $role }) => {
    switch ($role) {
      case "admin": return "#92400e";
      case "installer": return "#1d4ed8";
      case "seller": return "#047857";
      case "buyer": return "#4338ca";
      default: return "#6b7280";
    }
  }};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 24px;
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

const Select = styled.select`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  height: ${({ theme }) => theme.formHeightMd || "44px"};
  padding: 0px 12px;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
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
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

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

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#f4f4f5"};

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 8px;
  height: ${({ $height }) => $height || "200px"};

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function ProfilePage() {
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    company: "",
    role: "buyer",
    bio: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user?.uid]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserProfileAPI.getProfile(user.uid);
      if (data) {
        setProfile({
          displayName: data.displayName || user.displayName || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          company: data.company || "",
          role: data.role || "buyer",
          bio: data.bio || "",
          address: data.address || {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
          },
          preferences: data.preferences || {
            emailNotifications: true,
            smsNotifications: false,
          },
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      // Use local user data as fallback
      setProfile((prev) => ({
        ...prev,
        displayName: user?.displayName || "",
        email: user?.email || "",
        role: user?.role || "buyer",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await UserProfileAPI.updateProfile(user.uid, profile);
      setSuccess("Profile updated successfully!");

      // Update local user state if name changed
      if (profile.displayName !== user?.displayName) {
        ACTIONS.updateUser({
          ...user,
          displayName: profile.displayName,
          role: profile.role,
        });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <CloudPageLayout title="Profile" subtitle="Manage your account settings">
        <ProfileContainer>
          <Sidebar>
            <Skeleton $height="200px" />
          </Sidebar>
          <MainContent>
            <Skeleton $height="400px" />
          </MainContent>
        </ProfileContainer>
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout title="Profile" subtitle="Manage your account settings">
      <form onSubmit={handleSubmit}>
        <ProfileContainer>
          <Sidebar>
            <AvatarSection>
              <Avatar>{getInitials(profile.displayName)}</Avatar>
              <UserName>{profile.displayName || "Unnamed User"}</UserName>
              <UserEmail>{profile.email}</UserEmail>
              <RoleBadge $role={profile.role}>{profile.role}</RoleBadge>
            </AvatarSection>

            <Section>
              <SectionTitle>Account Stats</SectionTitle>
              <StatRow>
                <StatLabel>Member Since</StatLabel>
                <StatValue>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Last Login</StatLabel>
                <StatValue>
                  {user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Today"}
                </StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Verified</StatLabel>
                <StatValue>{user?.emailVerified ? "Yes" : "No"}</StatValue>
              </StatRow>
            </Section>
          </Sidebar>

          <MainContent>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <Section>
              <SectionTitle>Personal Information</SectionTitle>

              <FormGroup>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  placeholder="Your full name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="company">Company / Organization</Label>
                <Input
                  id="company"
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Your company name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bio">Bio</Label>
                <TextArea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </FormGroup>
            </Section>

            <Section>
              <SectionTitle>Role & Permissions</SectionTitle>

              <FormGroup>
                <Label htmlFor="role">Account Role</Label>
                <Select
                  id="role"
                  value={profile.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  <option value="buyer">Buyer - Purchase nutrient credits</option>
                  <option value="seller">Seller - List and sell credits</option>
                  <option value="installer">Installer - Deploy and commission devices</option>
                </Select>
              </FormGroup>
            </Section>

            <Section>
              <SectionTitle>Address</SectionTitle>

              <FormGroup>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  type="text"
                  value={profile.address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="123 Main Street"
                />
              </FormGroup>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={profile.address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="City"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    value={profile.address.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    placeholder="State"
                  />
                </FormGroup>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <FormGroup>
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input
                    id="zip"
                    type="text"
                    value={profile.address.zip}
                    onChange={(e) => handleAddressChange("zip", e.target.value)}
                    placeholder="12345"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    value={profile.address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="United States"
                  />
                </FormGroup>
              </div>
            </Section>

            <Section>
              <SectionTitle>Notification Preferences</SectionTitle>

              <FormGroup>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={profile.preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span style={{ fontSize: "14px" }}>Email notifications for alerts and updates</span>
                </label>
              </FormGroup>

              <FormGroup>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={profile.preferences.smsNotifications}
                    onChange={(e) => handlePreferenceChange("smsNotifications", e.target.checked)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span style={{ fontSize: "14px" }}>SMS notifications for critical alerts</span>
                </label>
              </FormGroup>
            </Section>

            <ButtonGroup>
              <ButtonSecondary type="button" onClick={() => navigate(-1)}>
                Cancel
              </ButtonSecondary>
              <ButtonPrimary type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </ButtonPrimary>
            </ButtonGroup>
          </MainContent>
        </ProfileContainer>
      </form>
    </CloudPageLayout>
  );
}
