import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import type { ProductsPricing } from '../types';

export default function ProductsPanel() {
  const { data, loading } = useFirebaseData<ProductsPricing>('/ops-dashboard/products-pricing');
  const products = data?.products ?? [];
  const changes = data?.recentChanges ?? [];

  return (
    <Panel
      id="products"
      title="Products & Pricing"
      badge={products.length}
      empty={!loading && products.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>SKU</Th>
            <Th>Category</Th>
            <Th>Cost</Th>
            <Th>List Price</Th>
            <Th>Margin</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea' }}>{p.name}</Td>
              <Td>{p.sku}</Td>
              <Td>{p.category}</Td>
              <Td>${p.cost.toLocaleString()}</Td>
              <Td>${p.listPrice.toLocaleString()}</Td>
              <Td style={{ color: '#34d399' }}>{(p.margin * 100).toFixed(1)}%</Td>
              <Td>
                <PriorityBadge value={p.status} />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {changes.length > 0 && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9498a8' }}>
          <strong>Recent Changes:</strong>
          {changes.map((c, i) => (
            <div key={i} style={{ padding: '0.2rem 0' }}>
              {c.date}: {c.change}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
