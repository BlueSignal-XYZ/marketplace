// Interactive Checklist Card Component
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressTrack = styled.div`
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ percent }) =>
    percent === 100 ? '#4ade80' : percent > 50 ? '#60a5fa' : '#f59e0b'};
  width: ${({ percent }) => percent}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 11px;
  color: ${({ percent }) => (percent === 100 ? '#4ade80' : '#94a3b8')};
  font-weight: 600;
  min-width: 40px;
`;

const ChecklistItems = styled.div`
  padding: 12px 20px;
`;

const CategoryGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 8px;
  padding-left: 28px;
`;

const ChecklistItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'default')};
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ interactive }) => (interactive ? 'rgba(255, 255, 255, 0.02)' : 'transparent')};
  }
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid ${({ checked }) => (checked ? '#4ade80' : 'rgba(255, 255, 255, 0.2)')};
  background: ${({ checked }) => (checked ? 'rgba(74, 222, 128, 0.2)' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  margin-top: 2px;

  &::after {
    content: '${({ checked }) => (checked ? '✓' : '')}';
    color: #4ade80;
    font-size: 12px;
    font-weight: bold;
  }
`;

const StaticCheck = styled.span`
  color: ${({ type }) =>
    type === 'required' ? '#60a5fa' : type === 'optional' ? '#94a3b8' : '#e2e8f0'};
  font-size: 14px;
  flex-shrink: 0;
  width: 18px;
  text-align: center;
`;

const ItemText = styled.span`
  font-size: 13px;
  color: ${({ checked }) => (checked ? '#94a3b8' : '#e2e8f0')};
  text-decoration: ${({ checked }) => (checked ? 'line-through' : 'none')};
  line-height: 1.4;
  flex: 1;
`;

const ResetButton = styled.button`
  font-size: 11px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }
`;

const ChecklistCard = ({
  title,
  icon,
  items = [],
  interactive = false,
  groupByCategory = true,
  showProgress = true,
  storageKey = null,
}) => {
  // Initialize checked state from localStorage if storageKey provided
  const getInitialChecked = () => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`checklist-${storageKey}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return {};
        }
      }
    }
    return {};
  };

  const [checkedItems, setCheckedItems] = useState(getInitialChecked);

  // Persist to localStorage
  useEffect(() => {
    if (storageKey && interactive) {
      localStorage.setItem(`checklist-${storageKey}`, JSON.stringify(checkedItems));
    }
  }, [checkedItems, storageKey, interactive]);

  const toggleItem = (id) => {
    if (!interactive) return;
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Group items by category
  const groupedItems = groupByCategory
    ? items.reduce((acc, item) => {
        const cat = item.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {})
    : { All: items };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
        {interactive && showProgress && (
          <ProgressBar>
            <ProgressTrack>
              <ProgressFill percent={progressPercent} />
            </ProgressTrack>
            <ProgressText percent={progressPercent}>
              {checkedCount}/{totalCount}
            </ProgressText>
            {checkedCount > 0 && <ResetButton onClick={resetChecklist}>Reset</ResetButton>}
          </ProgressBar>
        )}
      </CardHeader>
      <ChecklistItems>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <CategoryGroup key={category}>
            {groupByCategory && Object.keys(groupedItems).length > 1 && (
              <CategoryLabel>{category}</CategoryLabel>
            )}
            {categoryItems.map((item) => (
              <ChecklistItem
                key={item.id}
                interactive={interactive}
                onClick={() => toggleItem(item.id)}
              >
                {interactive ? (
                  <Checkbox checked={checkedItems[item.id]} />
                ) : (
                  <StaticCheck type={item.essential ? 'required' : 'optional'}>
                    {item.essential ? '●' : '○'}
                  </StaticCheck>
                )}
                <ItemText checked={interactive && checkedItems[item.id]}>
                  {item.text || item.name}
                  {item.purpose && (
                    <span style={{ color: '#64748b', marginLeft: 8, fontSize: 12 }}>
                      — {item.purpose}
                    </span>
                  )}
                </ItemText>
              </ChecklistItem>
            ))}
          </CategoryGroup>
        ))}
      </ChecklistItems>
    </CardWrapper>
  );
};

export default ChecklistCard;
