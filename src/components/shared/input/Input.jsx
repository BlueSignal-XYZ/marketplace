// /src/components/shared/input/Input.jsx
import styled, { css } from "styled-components";

// Enhanced Input with modern styling
export const Input = styled.input`
  background: ${({ theme, error }) =>
    error
      ? `linear-gradient(180deg, ${theme.colors?.red50 || "#FEF2F2"} 0%, #FFFFFF 100%)`
      : "linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)"};
  height: ${({ theme }) => theme.formHeightMd || "44px"};
  padding: 0px 16px;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
  color: ${({ theme }) => theme.colors?.ui800 || "#1F2937"};
  margin: 0px;
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  border: 1.5px solid
    ${({ theme, error }) =>
      error
        ? theme.colors?.red300 || "#FCA5A5"
        : theme.colors?.ui200 || "#E5E7EB"};
  transition: all 0.2s ease-out;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    inset 0 1px 2px rgba(0, 0, 0, 0.02);

  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme, error }) =>
      error
        ? theme.colors?.red400 || "#F87171"
        : theme.colors?.ui300 || "#D1D5DB"};
    background: ${({ error }) =>
      error
        ? "linear-gradient(180deg, #FEF2F2 0%, #FFFFFF 100%)"
        : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)"};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) =>
      error
        ? theme.colors?.red500 || "#EF4444"
        : theme.colors?.primary400 || "#38BDBE"};
    background: #FFFFFF;
    box-shadow:
      0 0 0 3px
        ${({ error }) =>
          error
            ? "rgba(239, 68, 68, 0.12)"
            : "rgba(56, 189, 190, 0.12)"},
      0 1px 2px rgba(0, 0, 0, 0.02);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    cursor: not-allowed;
    border-color: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    box-shadow: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
    font-weight: 400;
  }

  /* Autofill styling */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset;
    -webkit-text-fill-color: ${({ theme }) => theme.colors?.ui800 || "#1F2937"};
  }
`;

// Input with icon support
export const InputWithIcon = styled.div`
  position: relative;
  width: 100%;

  ${Input} {
    padding-left: ${({ $iconPosition }) =>
      $iconPosition === "left" ? "48px" : "16px"};
    padding-right: ${({ $iconPosition }) =>
      $iconPosition === "right" ? "48px" : "16px"};
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => ($position === "right" ? "right: 16px;" : "left: 16px;")}
  color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Select dropdown with improved styling
export const Select = styled.select`
  appearance: none;
  background: #FFFFFF;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  height: ${({ theme }) => theme.formHeightMd || "44px"};
  padding: 0 40px 0 16px;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
  color: ${({ theme }) => theme.colors?.ui800 || "#1F2937"};
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  border: 1.5px solid ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors?.ui300 || "#D1D5DB"};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
    box-shadow: 0 0 0 3px rgba(56, 189, 190, 0.15);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    cursor: not-allowed;
  }
`;

// Form field wrapper with label
export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  display: flex;
  align-items: center;
  gap: 4px;

  .required {
    color: ${({ theme }) => theme.colors?.red500 || "#EF4444"};
  }
`;

export const FormHint = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
`;

export const FormError = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.red500 || "#EF4444"};
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Checkbox with custom styling
export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors?.ui300 || "#D1D5DB"};
  border-radius: 6px;
  background: #FFFFFF;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease-out;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
  }

  &:checked {
    background: ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
    border-color: ${({ theme }) => theme.colors?.primary500 || "#1D7072"};

    &::after {
      content: "";
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
    border-color: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
    cursor: not-allowed;
  }
`;

// Toggle/Switch
export const Toggle = styled.button`
  width: 48px;
  height: 26px;
  border-radius: 13px;
  border: none;
  padding: 3px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  background: ${({ $checked, theme }) =>
    $checked
      ? theme.colors?.primary500 || "#1D7072"
      : theme.colors?.ui300 || "#D1D5DB"};

  &::after {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateX(${({ $checked }) => ($checked ? "22px" : "0")});
  }

  &:hover:not(:disabled) {
    background: ${({ $checked, theme }) =>
      $checked
        ? theme.colors?.primary600 || "#196061"
        : theme.colors?.ui400 || "#9CA3AF"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Size variants
export const InputSmall = css`
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
  border-radius: 8px;
`;

export const InputLarge = css`
  height: 52px;
  padding: 0 20px;
  font-size: 16px;
  border-radius: 14px;
`;
