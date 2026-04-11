import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import type { OpenLoop } from '../types';

export default function OpenLoopsPanel() {
  const { data, loading } = useFirebaseData<OpenLoop[]>('/ops-dashboard/open-loops');
  const items = data ?? [];

  return (
    <Panel
      id="open-loops"
      title="Open Loops"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Priority</Th>
            <Th>Item</Th>
            <Th>Age</Th>
            <Th>Next Step</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td>
                <PriorityBadge value={item.priority} />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>{item.title}</Td>
              <Td>{item.age}d</Td>
              <Td>{item.nextStep}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
