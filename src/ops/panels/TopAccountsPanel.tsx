import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import type { TopAccount } from '../types';

export default function TopAccountsPanel() {
  const { data, loading } = useFirebaseData<TopAccount[]>('/ops-dashboard/top-accounts');
  const items = data ?? [];

  return (
    <Panel
      id="top-accounts"
      title="Top Accounts"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Account</Th>
            <Th>Health</Th>
            <Th>Revenue</Th>
            <Th>Last Contact</Th>
            <Th>Next Action</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <Tr key={a.rank}>
              <Td>{a.rank}</Td>
              <Td style={{ color: '#e2e4ea' }}>{a.name}</Td>
              <Td>
                <PriorityBadge value={a.health} />
              </Td>
              <Td>{a.revenue != null ? `$${a.revenue.toLocaleString()}` : '—'}</Td>
              <Td>{a.lastContact || '—'}</Td>
              <Td>{a.nextAction}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Panel>
  );
}
