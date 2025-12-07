// Commission Checklist Component - Interactive checklist for installers
import React, { useState } from "react";
import styled from "styled-components";

const ChecklistContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const ChecklistHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChecklistTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProgressBadge = styled.span`
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  background: ${(props) =>
    props.complete ? "#dcfce7" : props.progress > 0 ? "#fef3c7" : "#f3f4f6"};
  color: ${(props) =>
    props.complete ? "#166534" : props.progress > 0 ? "#92400e" : "#6b7280"};
`;

const CategoryGroup = styled.div`
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryHeader = styled.div`
  padding: 12px 20px;
  background: #f9fafb;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryProgress = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

const Checkbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 2px solid ${(props) => (props.checked ? "#22c55e" : "#d1d5db")};
  background: ${(props) => (props.checked ? "#22c55e" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => (props.checked ? "#16a34a" : "#9ca3af")};
  }

  svg {
    width: 14px;
    height: 14px;
    color: #ffffff;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const ItemText = styled.div`
  font-size: 14px;
  color: ${(props) => (props.checked ? "#9ca3af" : "#1f2937")};
  text-decoration: ${(props) => (props.checked ? "line-through" : "none")};
  line-height: 1.4;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 12px;
  color: #9ca3af;
`;

const NotesToggle = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const NotesInput = styled.textarea`
  width: 100%;
  margin-top: 8px;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  resize: vertical;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CommissionChecklist = ({
  title = "Checklist",
  items = [],
  onItemChange,
  readOnly = false,
}) => {
  const [expandedNotes, setExpandedNotes] = useState({});

  // Group items by category
  const groupedItems = items.reduce((groups, item) => {
    const category = item.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (itemId) => {
    if (readOnly) return;
    const item = items.find((i) => i.id === itemId);
    if (item && onItemChange) {
      onItemChange(itemId, !item.completed, item.notes);
    }
  };

  const handleNotesChange = (itemId, notes) => {
    if (readOnly) return;
    const item = items.find((i) => i.id === itemId);
    if (item && onItemChange) {
      onItemChange(itemId, item.completed, notes);
    }
  };

  const toggleNotes = (itemId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getCategoryProgress = (categoryItems) => {
    const completed = categoryItems.filter((item) => item.completed).length;
    return `${completed}/${categoryItems.length}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <ChecklistContainer>
      <ChecklistHeader>
        <ChecklistTitle>{title}</ChecklistTitle>
        <ProgressBadge complete={progress === 100} progress={progress}>
          {completedCount}/{totalCount} ({progress}%)
        </ProgressBadge>
      </ChecklistHeader>

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <CategoryGroup key={category}>
          <CategoryHeader>
            {category}
            <CategoryProgress>{getCategoryProgress(categoryItems)}</CategoryProgress>
          </CategoryHeader>
          {categoryItems.map((item) => (
            <ChecklistItem key={item.id}>
              <Checkbox
                checked={item.completed}
                onClick={() => handleToggle(item.id)}
              >
                {item.completed && <CheckIcon />}
              </Checkbox>
              <ItemContent>
                <ItemText checked={item.completed}>{item.text}</ItemText>
                <ItemMeta>
                  {item.completedAt && (
                    <span>Completed {formatTimestamp(item.completedAt)}</span>
                  )}
                  {!readOnly && (
                    <NotesToggle onClick={() => toggleNotes(item.id)}>
                      {expandedNotes[item.id] ? "Hide notes" : item.notes ? "Edit notes" : "Add notes"}
                    </NotesToggle>
                  )}
                </ItemMeta>
                {(expandedNotes[item.id] || item.notes) && !readOnly && expandedNotes[item.id] && (
                  <NotesInput
                    placeholder="Add notes..."
                    value={item.notes || ""}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                  />
                )}
                {item.notes && !expandedNotes[item.id] && (
                  <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280", fontStyle: "italic" }}>
                    Note: {item.notes}
                  </div>
                )}
              </ItemContent>
            </ChecklistItem>
          ))}
        </CategoryGroup>
      ))}
    </ChecklistContainer>
  );
};

export default CommissionChecklist;
