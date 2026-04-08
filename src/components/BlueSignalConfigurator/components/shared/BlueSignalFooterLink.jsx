// BlueSignal Footer Link - Styled component for auth page footers
/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';

/**
 * Small footer link for auth pages
 */
export const BlueSignalFooterLink = styled.footer`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || '#6b7280'};

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default BlueSignalFooterLink;
