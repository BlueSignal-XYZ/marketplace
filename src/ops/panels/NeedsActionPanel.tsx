import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import type { ActionItem } from '../types';

export default function NeedsActionPanel() {
  const { data, loading } = useFirebaseData<ActionItem[]>('/ops-dashboard/needs-action-today');
  const items = data ?? [];

  return (
    <Panel
      id="needs-action"
      title="Needs Action Today"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Priority</Th>
            <Th>Item</Th>
            <Th>Account</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td>
                <PriorityBadge value={item.priority} />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>{item.title}</Td>
              <Td>{item.account}</Td>
              <Td>{item.notes}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
