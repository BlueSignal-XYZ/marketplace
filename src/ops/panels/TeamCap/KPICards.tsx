import styled from 'styled-components';
import { formatNumber, formatPct } from './dilution';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.6rem 0.75rem;
`;

const Label = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  margin-top: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Sub = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 0.15rem;
`;

export interface KPIData {
  authorized: number;
  issued: number;
  reserved: number;
  available: number;
  founderPctCurrent: number;
  founderPctDiluted: number;
}

export default function KPICards({ data }: { data: KPIData }) {
  return (
    <Grid>
      <Card>
        <Label>Authorized</Label>
        <Value>{formatNumber(data.authorized)}</Value>
        <Sub>total shares</Sub>
      </Card>
      <Card>
        <Label>Issued</Label>
        <Value>{formatNumber(data.issued)}</Value>
        <Sub>outstanding</Sub>
      </Card>
      <Card>
        <Label>Reserved</Label>
        <Value>{formatNumber(data.reserved)}</Value>
        <Sub>pool + unallocated</Sub>
      </Card>
      <Card>
        <Label>Available</Label>
        <Value>{formatNumber(data.available)}</Value>
        <Sub>to issue</Sub>
      </Card>
      <Card>
        <Label>Founder %</Label>
        <Value>{formatPct(data.founderPctCurrent)}</Value>
        <Sub>current</Sub>
      </Card>
      <Card>
        <Label>Founder % (FD)</Label>
        <Value>{formatPct(data.founderPctDiluted)}</Value>
        <Sub>fully diluted pro-forma</Sub>
      </Card>
    </Grid>
  );
}
