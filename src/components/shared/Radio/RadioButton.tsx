import React from "react";
import styled from "styled-components";

export const RadioButton = styled.input.attrs({ type: "radio" })`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-bottom: 0px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const StyledRadioButtonWithLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  label {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0px;
  }
`;

export interface RadioWithLabelProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export function RadioWithLabel({ label, onChange, checked }: RadioWithLabelProps) {
  return (
    <StyledRadioButtonWithLabel>
      <RadioButton onChange={onChange} checked={checked} id="radio" />
      <label htmlFor="radio">{label}</label>
    </StyledRadioButtonWithLabel>
  );
}
