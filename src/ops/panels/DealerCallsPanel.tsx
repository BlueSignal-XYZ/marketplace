import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import type { DealerCalls } from '../types';

export default function DealerCallsPanel() {
  const { data, loading } = useFirebaseData<DealerCalls>('/ops-dashboard/dealer-calls');
  const calls = data?.calls ?? [];

  return (
    <Panel
      id="dealer-calls"
      title="Dealer Calls"
      badge={calls.length}
      empty={!loading && calls.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Day</Th>
            <Th>Time</Th>
            <Th>Dealer</Th>
            <Th>Status</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {calls.map((c, i) => (
            <Tr key={i}>
              <Td>{c.day}</Td>
              <Td>{c.time}</Td>
              <Td style={{ color: '#e2e4ea' }}>{c.dealer}</Td>
              <Td>{c.status}</Td>
              <Td>{c.notes}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
