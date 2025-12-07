// Enhanced BOM Tab with Summary/Full Toggle and Supplier Links
import React, { useState } from "react";
import styled from "styled-components";
import { SectionTitle, Table, Th, Td, TotalRow, MarginBadge } from "../../styles";
import { ENHANCED_BOM, calculateBOMTotals } from "../../data";
import { BlueSignalCTA } from "../shared";

const ToggleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const ToggleButtons = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 3px;
`;

const ToggleButton = styled.button`
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ active }) => active ? '#3b82f6' : 'transparent'};
  border: none;
  border-radius: 4px;
  color: ${({ active }) => active ? '#ffffff' : '#94a3b8'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const ExportButton = styled.button`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 6px;
  color: #4ade80;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(74, 222, 128, 0.2);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
`;

const SummaryLabel = styled.div`
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ variant }) =>
    variant === 'cost' ? '#f87171' :
    variant === 'price' ? '#4ade80' :
    variant === 'margin' ? '#60a5fa' :
    '#e2e8f0'
  };
`;

const SummarySubtext = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
`;

const CategorySummary = styled.div`
  margin-bottom: 20px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CategoryName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
`;

const CategoryCost = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
`;

const CategoryBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
`;

const CategoryFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  width: ${({ percent }) => percent}%;
  transition: width 0.3s ease;
`;

const FullBomSection = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionName = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
  margin: 0;
`;

const ItemCount = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const SupplierLink = styled.a`
  color: #60a5fa;
  text-decoration: none;
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
  }
`;

const CriticalBadge = styled.span`
  font-size: 9px;
  padding: 2px 6px;
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 8px;
`;

const LeadTimeBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: ${({ days }) =>
    days > 10 ? 'rgba(239, 68, 68, 0.2)' :
    days > 5 ? 'rgba(251, 191, 36, 0.2)' :
    'rgba(74, 222, 128, 0.2)'
  };
  color: ${({ days }) =>
    days > 10 ? '#f87171' :
    days > 5 ? '#fbbf24' :
    '#4ade80'
  };
  border-radius: 4px;
  font-weight: 600;
`;

const EnhancedBomTab = ({ product }) => {
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'full'
  const enhancedBom = ENHANCED_BOM[product.id];

  // Calculate totals from original BOM for backwards compatibility
  const originalTotal = product.bom.reduce((sum, item) => sum + item.cost, 0);
  const margin = ((product.price - originalTotal) / product.price * 100).toFixed(1);
  const marginGood = parseFloat(margin) >= 30;

  // Calculate category totals
  const categoryTotals = {};
  if (enhancedBom) {
    enhancedBom.sections.forEach(section => {
      categoryTotals[section.category] = section.items.reduce(
        (sum, item) => sum + (item.unit * item.qty), 0
      );
    });
  } else {
    product.bom.forEach(item => {
      if (!categoryTotals[item.category]) categoryTotals[item.category] = 0;
      categoryTotals[item.category] += item.cost;
    });
  }

  const maxCategoryCost = Math.max(...Object.values(categoryTotals));

  // Calculate enhanced BOM stats
  const enhancedStats = enhancedBom ? calculateBOMTotals(product.id) : null;

  // Export CSV function
  const exportCSV = () => {
    const headers = enhancedBom
      ? ['Category', 'Item', 'Part Number', 'Qty', 'Unit Cost', 'Total', 'Supplier', 'Lead Days', 'Critical']
      : ['Category', 'Item', 'Qty', 'Cost'];

    let rows = [];

    if (enhancedBom) {
      enhancedBom.sections.forEach(section => {
        section.items.forEach(item => {
          rows.push([
            section.category,
            item.name,
            item.part || '',
            item.qty,
            item.unit.toFixed(2),
            (item.unit * item.qty).toFixed(2),
            item.supplier || '',
            item.leadDays || '',
            item.critical ? 'Yes' : ''
          ]);
        });
      });
    } else {
      product.bom.forEach(item => {
        rows.push([item.category, item.item, item.qty, item.cost]);
      });
    }

    rows.push([]);
    rows.push(['', '', '', '', 'TOTAL', originalTotal.toFixed(2)]);
    rows.push(['', '', '', '', 'PRICE', product.price]);
    rows.push(['', '', '', '', 'MARGIN', `${margin}%`]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.name.replace(/\s+/g, '-')}-BOM.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionTitle>
        Bill of Materials
        <MarginBadge good={marginGood}>{margin}% margin</MarginBadge>
      </SectionTitle>

      <ToggleBar>
        <ToggleButtons>
          <ToggleButton
            active={viewMode === 'summary'}
            onClick={() => setViewMode('summary')}
          >
            Summary
          </ToggleButton>
          <ToggleButton
            active={viewMode === 'full'}
            onClick={() => setViewMode('full')}
          >
            Full Details
          </ToggleButton>
        </ToggleButtons>
        <ExportButton onClick={exportCSV}>
          <span>📥</span> Export CSV
        </ExportButton>
      </ToggleBar>

      {/* Summary Cards */}
      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>BOM Cost</SummaryLabel>
          <SummaryValue variant="cost">${originalTotal.toLocaleString()}</SummaryValue>
          {enhancedStats && (
            <SummarySubtext>{enhancedStats.criticalCount} critical parts</SummarySubtext>
          )}
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Retail Price</SummaryLabel>
          <SummaryValue variant="price">${product.price.toLocaleString()}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Gross Margin</SummaryLabel>
          <SummaryValue variant="margin">{margin}%</SummaryValue>
          <SummarySubtext>${(product.price - originalTotal).toLocaleString()} profit</SummarySubtext>
        </SummaryCard>
        {enhancedStats && (
          <SummaryCard>
            <SummaryLabel>Max Lead Time</SummaryLabel>
            <SummaryValue>{enhancedStats.maxLeadDays} days</SummaryValue>
            <SummarySubtext>Longest supplier lead</SummarySubtext>
          </SummaryCard>
        )}
      </SummaryGrid>

      {viewMode === 'summary' ? (
        /* Category Summary View */
        <CategorySummary>
          {Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([category, cost]) => (
              <div key={category}>
                <CategoryHeader>
                  <CategoryName>{category}</CategoryName>
                  <CategoryCost>${cost.toFixed(0)}</CategoryCost>
                </CategoryHeader>
                <CategoryBar>
                  <CategoryFill percent={(cost / maxCategoryCost) * 100} />
                </CategoryBar>
              </div>
            ))}
        </CategorySummary>
      ) : (
        /* Full BOM View */
        <div>
          {enhancedBom ? (
            // Enhanced BOM with supplier links
            enhancedBom.sections.map(section => (
              <FullBomSection key={section.category}>
                <SectionHeader>
                  <SectionName>{section.category}</SectionName>
                  <ItemCount>{section.items.length} items</ItemCount>
                </SectionHeader>
                <Table>
                  <thead>
                    <tr>
                      <Th style={{ width: '40%' }}>Item</Th>
                      <Th>Qty</Th>
                      <Th>Unit</Th>
                      <Th>Total</Th>
                      <Th>Supplier</Th>
                      <Th>Lead</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, i) => (
                      <tr key={i}>
                        <Td style={{ textAlign: 'left' }}>
                          {item.name}
                          {item.critical && <CriticalBadge>Critical</CriticalBadge>}
                          {item.part && (
                            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                              {item.part}
                            </div>
                          )}
                        </Td>
                        <Td>{item.qty}</Td>
                        <Td>${item.unit.toFixed(2)}</Td>
                        <Td>${(item.unit * item.qty).toFixed(2)}</Td>
                        <Td>
                          {item.url ? (
                            <SupplierLink href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.supplier}
                            </SupplierLink>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: 11 }}>{item.supplier}</span>
                          )}
                        </Td>
                        <Td>
                          {item.leadDays && (
                            <LeadTimeBadge days={item.leadDays}>{item.leadDays}d</LeadTimeBadge>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </FullBomSection>
            ))
          ) : (
            // Fallback to original BOM format
            Object.entries(categoryTotals).map(([category]) => (
              <FullBomSection key={category}>
                <SectionHeader>
                  <SectionName>{category}</SectionName>
                </SectionHeader>
                <Table>
                  <thead>
                    <tr>
                      <Th>Item</Th>
                      <Th>Qty</Th>
                      <Th>Cost</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.bom
                      .filter(item => item.category === category)
                      .map((item, i) => (
                        <tr key={i}>
                          <Td style={{ textAlign: 'left' }}>{item.item}</Td>
                          <Td>{item.qty}</Td>
                          <Td>${item.cost.toLocaleString()}</Td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </FullBomSection>
            ))
          )}

          {/* Total Row */}
          <Table style={{ marginTop: 16 }}>
            <tbody>
              <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                <Td><strong>BOM Total</strong></Td>
                <Td></Td>
                <Td></Td>
                <Td><strong>${originalTotal.toLocaleString()}</strong></Td>
                <Td></Td>
                <Td></Td>
              </tr>
              <TotalRow>
                <Td><strong>Retail Price</strong></Td>
                <Td></Td>
                <Td></Td>
                <Td><strong>${product.price.toLocaleString()}</strong></Td>
                <Td></Td>
                <Td></Td>
              </TotalRow>
            </tbody>
          </Table>
        </div>
      )}

      {/* BlueSignal CTA */}
      <BlueSignalCTA productSlug={product.id} variant="banner" />
    </div>
  );
};

export default EnhancedBomTab;
