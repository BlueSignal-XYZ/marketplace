import styled from "styled-components";

export const Select = styled.select`
  background: ${({ theme }) => theme.colors.background};
  height: 40px;
  padding: 0px 8px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0px;
  width: 100%;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  option {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
