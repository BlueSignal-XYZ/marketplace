import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import type { AgendaItem } from '../types';

export default function TodaysAgendaPanel() {
  const { data, loading } = useFirebaseData<AgendaItem[]>('/ops-dashboard/todays-agenda');
  const items = data ?? [];

  return (
    <Panel
      id="todays-agenda"
      title="Today's Agenda"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Time</Th>
            <Th>Activity</Th>
            <Th>Duration</Th>
            <Th>Type</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td style={{ whiteSpace: 'nowrap', color: '#e2e4ea' }}>{item.time}</Td>
              <Td style={{ color: '#e2e4ea' }}>{item.title}</Td>
              <Td>{item.duration}m</Td>
              <Td>{item.type}</Td>
              <Td>{item.notes}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
