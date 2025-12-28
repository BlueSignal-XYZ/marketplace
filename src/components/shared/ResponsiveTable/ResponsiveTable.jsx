import React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;

  /* Fade indicator on mobile to show scrollable content */
  @media (max-width: 768px) {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 40px;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.95)
      );
      pointer-events: none;
      opacity: ${({ $hasScroll }) => ($hasScroll ? 1 : 0)};
      transition: opacity 0.2s;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    min-width: 600px;
  }
`;

const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors?.ui100 || "#f1f5f9"};
  border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || "#e2e8f0"};
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || "#334155"};
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e2e8f0"};
  transition: background 0.15s;

  /* Zebra striping for better readability */
  &:nth-child(even) {
    background: ${({ theme }) => theme.colors?.ui50 || "#f8fafc"};
  }

  &:hover {
    background: ${({ theme }) => theme.colors?.primary50 || "#e6f7f8"};
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
  `}
`;

const TableCell = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors?.ui500 || "#64748b"};
  font-size: 14px;
`;

const ResponsiveTable = ({ headers, data, onRowClick, emptyMessage = "No data available", renderRow }) => {
  const [hasScroll, setHasScroll] = React.useState(false);
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const checkScroll = () => {
      if (wrapperRef.current) {
        const { scrollWidth, clientWidth } = wrapperRef.current;
        setHasScroll(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [data]);

  if (!data || data.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <TableWrapper ref={wrapperRef} $hasScroll={hasScroll}>
      <Table>
        <TableHead>
          <tr>
            {headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              $clickable={!!onRowClick}
            >
              {renderRow ? (
                renderRow(row)
              ) : (
                headers.map((header, cellIndex) => (
                  <TableCell key={cellIndex}>{row[header]}</TableCell>
                ))
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default ResponsiveTable;
