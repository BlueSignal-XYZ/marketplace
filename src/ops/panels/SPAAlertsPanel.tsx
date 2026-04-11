import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import type { SpaAlert } from '../types';

export default function SPAAlertsPanel() {
  const { data, loading } = useFirebaseData<SpaAlert[]>('/ops-dashboard/spa-alerts');
  const items = data ?? [];

  return (
    <Panel
      id="spa-alerts"
      title="SPA Alerts"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Severity</Th>
            <Th>Dealer</Th>
            <Th>SPA</Th>
            <Th>Expires</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((a, i) => (
            <Tr key={i}>
              <Td>
                <PriorityBadge value={a.severity} />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>{a.dealer}</Td>
              <Td>{a.spa}</Td>
              <Td>{a.expiresOn}</Td>
              <Td>{a.action}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
