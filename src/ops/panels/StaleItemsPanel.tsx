import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import type { StaleItem } from '../types';

export default function StaleItemsPanel() {
  const { data, loading } = useFirebaseData<StaleItem[]>('/ops-dashboard/stale-items');
  const items = data ?? [];

  return (
    <Panel
      id="stale-items"
      title="Stale Items"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Age</Th>
            <Th>Last Update</Th>
            <Th>Suggested Action</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea' }}>{item.title}</Td>
              <Td>{item.age}d</Td>
              <Td>{item.lastUpdate}</Td>
              <Td>{item.suggestedAction}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
