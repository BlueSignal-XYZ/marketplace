import styled from "styled-components";

export const Textarea = styled.textarea`
  background: ${({ theme }) => theme.colors.ui50};
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  color: ${({ theme }) => theme.colors.ui700};
  border: 1px solid ${({theme}) => theme.colors.ui300};
  margin: 0px;
  font-weight: 500;
  width: 100%;
  resize: vertical;
  min-height: 250px;
  font-size: 16px;
`
