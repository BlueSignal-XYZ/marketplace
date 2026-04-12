import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import EditableCell from '../components/EditableCell';
import PriorityBadge from '../components/PriorityBadge';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { Product, ProductsPricing } from '../types';

const Btn = styled.button<{ $danger?: boolean }>`
  background: ${({ $danger, theme }) => ($danger ? theme.colors.redDim : theme.colors.accentDim)};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.red : theme.colors.accent)};
  border: none;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const ADD_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  { name: 'sku', label: 'SKU' },
  { name: 'category', label: 'Category' },
  { name: 'cost', label: 'Cost', type: 'number' },
  { name: 'listPrice', label: 'List Price', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['active', 'pre-order', 'discontinued'],
    defaultValue: 'active',
  },
];

function calcMargin(cost: number, listPrice: number): number {
  if (!listPrice || listPrice === 0) return 0;
  return (listPrice - cost) / listPrice;
}

export default function ProductsPanel() {
  const { data, loading } = useFirebaseData<ProductsPricing>('/ops-dashboard/products-pricing');
  const { writeImmediate } = useWriteBack('/ops-dashboard/products-pricing');
  const [showAdd, setShowAdd] = useState(false);

  const products = data?.products ?? [];
  const changes = data?.recentChanges ?? [];

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updated = [...products];
    const numFields: (keyof Product)[] = ['cost', 'listPrice', 'dealerPrice', 'margin'];
    const newVal = numFields.includes(field) ? Number(value) || 0 : value;
    updated[index] = { ...updated[index], [field]: newVal };
    // Auto-recalc margin when cost or listPrice changes
    if (field === 'cost' || field === 'listPrice') {
      updated[index].margin = calcMargin(updated[index].cost, updated[index].listPrice);
    }
    writeImmediate({ products: updated, recentChanges: changes });
  };

  const deleteProduct = (index: number) => {
    if (!confirm(`Delete ${products[index].name}?`)) return;
    writeImmediate({ products: products.filter((_, i) => i !== index), recentChanges: changes });
  };

  const addProduct = (values: Record<string, string>) => {
    const cost = Number(values.cost) || 0;
    const listPrice = Number(values.listPrice) || 0;
    const p: Product = {
      name: values.name,
      sku: values.sku,
      category: values.category,
      description: '',
      cost,
      listPrice,
      dealerPrice: null,
      margin: calcMargin(cost, listPrice),
      status: values.status,
      billing: null,
    };
    writeImmediate({ products: [...products, p], recentChanges: changes });
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="products"
      title="Products & Pricing"
      badge={products.length}
      actions={actions}
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
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea', fontWeight: 600 }}>
                <EditableCell value={p.name} onSave={(v) => updateProduct(i, 'name', v)} />
              </Td>
              <Td>
                <EditableCell value={p.sku} onSave={(v) => updateProduct(i, 'sku', v)} />
              </Td>
              <Td>
                <EditableCell value={p.category} onSave={(v) => updateProduct(i, 'category', v)} />
              </Td>
              <Td>
                $
                <EditableCell
                  value={p.cost}
                  type="number"
                  onSave={(v) => updateProduct(i, 'cost', v)}
                />
              </Td>
              <Td>
                $
                <EditableCell
                  value={p.listPrice}
                  type="number"
                  onSave={(v) => updateProduct(i, 'listPrice', v)}
                />
              </Td>
              <Td style={{ color: '#34d399' }}>{(p.margin * 100).toFixed(1)}%</Td>
              <Td>
                <PriorityBadge value={p.status} />
              </Td>
              <Td>
                <Btn $danger onClick={() => deleteProduct(i)}>
                  Delete
                </Btn>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addProduct} onCancel={() => setShowAdd(false)} />
      )}

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
