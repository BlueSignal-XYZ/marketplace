import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;

  /* On phones and iPad portrait, let the table scroll horizontally inside its
     panel instead of forcing the whole page to scroll. */
  @media (max-width: 1024px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
  }
`;

export const Th = styled.th`
  text-align: left;
  color: ${({ theme }) => theme.colors.text3};
  font-weight: 500;
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;

  @media (max-width: 1024px) {
    padding: 0.55rem 0.6rem;
    font-size: 0.82rem;
  }
`;

export const Td = styled.td`
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text2};
  vertical-align: top;

  @media (max-width: 1024px) {
    padding: 0.55rem 0.6rem;
    font-size: 0.82rem;
  }
`;

export const Tr = styled.tr`
  transition: background ${({ theme }) => theme.transition};
  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;
