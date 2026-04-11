import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
`;

export const Th = styled.th`
  text-align: left;
  color: ${({ theme }) => theme.colors.text3};
  font-weight: 500;
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text2};
  vertical-align: top;
`;

export const Tr = styled.tr`
  transition: background ${({ theme }) => theme.transition};
  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;
