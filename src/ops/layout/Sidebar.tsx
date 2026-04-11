import { useState } from 'react';
import styled from 'styled-components';

const Aside = styled.aside<{ $open: boolean }>`
  width: ${({ theme }) => theme.layout.sidebarWidth};
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.2s ease;
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const Logo = styled.div`
  padding: 0.75rem 1rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.accent};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GroupHeader = styled.button`
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text3};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text2};
  }
`;

const NavItem = styled.a<{ $active: boolean }>`
  display: block;
  padding: 0.35rem 1rem 0.35rem 1.5rem;
  font-size: 0.8rem;
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.text2)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : 'transparent')};
  border-left: 2px solid ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  cursor: pointer;
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transition},
    color ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
    color: ${({ theme }) => theme.colors.text};
  }
`;

interface NavEntry {
  id: string;
  label: string;
}

interface NavGroup {
  name: string;
  items: NavEntry[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Pipeline',
    items: [
      { id: 'needs-action', label: 'Action Items' },
      { id: 'top-accounts', label: 'Top Accounts' },
      { id: 'pipeline', label: 'Pipeline' },
      { id: 'forecast', label: 'Forecast' },
    ],
  },
  {
    name: 'Schedule',
    items: [
      { id: 'todays-agenda', label: "Today's Agenda" },
      { id: 'dealer-calls', label: 'Dealer Calls' },
    ],
  },
  {
    name: 'Accounts',
    items: [
      { id: 'dealer-health', label: 'Dealer Health' },
      { id: 'spa-alerts', label: 'SPA Alerts' },
      { id: 'open-loops', label: 'Open Loops' },
      { id: 'crm', label: 'CRM' },
      { id: 'stale-items', label: 'Stale Items' },
    ],
  },
  {
    name: 'Strategy',
    items: [
      { id: 'initiatives', label: 'Initiatives' },
      { id: 'products', label: 'Products' },
      { id: 'competitive', label: 'Competitive Intel' },
      { id: 'territory', label: 'Territory Map' },
      { id: 'events', label: 'Events' },
      { id: 'team-cap', label: 'Team & Cap Table' },
    ],
  },
];

interface SidebarProps {
  activePanel: string;
  onNavigate: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ activePanel, onNavigate, open, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (group: string) => setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));

  const handleClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {open && <Overlay onClick={onClose} />}
      <Aside $open={open}>
        <Logo>BlueSignal Ops</Logo>
        {NAV_GROUPS.map((group) => (
          <div key={group.name}>
            <GroupHeader onClick={() => toggle(group.name)}>
              {group.name}
              <span>{collapsed[group.name] ? '+' : '-'}</span>
            </GroupHeader>
            {!collapsed[group.name] &&
              group.items.map((item) => (
                <NavItem
                  key={item.id}
                  $active={activePanel === item.id}
                  onClick={() => handleClick(item.id)}
                >
                  {item.label}
                </NavItem>
              ))}
          </div>
        ))}
      </Aside>
    </>
  );
}

export { NAV_GROUPS };
