import styled from 'styled-components';

export const Badge = styled.button`
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  font-size: 14px;
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background: ${({ theme }) => theme.colors.ui50};
  color: ${({ theme }) => theme.colors.ui800};
  text-transform: capitalize;
`;
