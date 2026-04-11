import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar, { NAV_GROUPS } from './Sidebar';
import Topbar from './Topbar';
import NeedsActionPanel from '../panels/NeedsActionPanel';
import TopAccountsPanel from '../panels/TopAccountsPanel';
import PipelinePanel from '../panels/PipelinePanel';
import ForecastPanel from '../panels/ForecastPanel';
import TodaysAgendaPanel from '../panels/TodaysAgendaPanel';
import DealerCallsPanel from '../panels/DealerCallsPanel';
import DealerHealthPanel from '../panels/DealerHealthPanel';
import SPAAlertsPanel from '../panels/SPAAlertsPanel';
import OpenLoopsPanel from '../panels/OpenLoopsPanel';
import CRMPanel from '../panels/CRMPanel';
import StaleItemsPanel from '../panels/StaleItemsPanel';
import InitiativesPanel from '../panels/InitiativesPanel';
import ProductsPanel from '../panels/ProductsPanel';
import CompetitivePanel from '../panels/CompetitivePanel';
import TerritoryPanel from '../panels/TerritoryPanel';
import EventsPanel from '../panels/EventsPanel';
import TeamCapPanel from '../panels/TeamCapPanel';

const Shell = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const panelTitles: Record<string, string> = Object.fromEntries(
  ALL_ITEMS.map((i) => [i.id, i.label])
);

interface DashboardLayoutProps {
  onSignOut: () => void;
}

export default function DashboardLayout({ onSignOut }: DashboardLayoutProps) {
  const [activePanel, setActivePanel] = useState(ALL_ITEMS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (id: string) => {
    setActivePanel(id);
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll spy: update active panel based on scroll position
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const onScroll = () => {
      const panels = ALL_ITEMS.map((i) => document.getElementById(i.id)).filter(
        Boolean
      ) as HTMLElement[];
      for (let i = panels.length - 1; i >= 0; i--) {
        const rect = panels[i].getBoundingClientRect();
        if (rect.top <= 120) {
          setActivePanel(ALL_ITEMS[i].id);
          break;
        }
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Shell>
      <Sidebar
        activePanel={activePanel}
        onNavigate={handleNavigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Main>
        <Topbar
          title={panelTitles[activePanel] ?? 'Ops Dashboard'}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          onSignOut={onSignOut}
        />
        <Content ref={contentRef}>
          <NeedsActionPanel />
          <TopAccountsPanel />
          <PipelinePanel />
          <ForecastPanel />
          <TodaysAgendaPanel />
          <DealerCallsPanel />
          <DealerHealthPanel />
          <SPAAlertsPanel />
          <OpenLoopsPanel />
          <CRMPanel />
          <StaleItemsPanel />
          <InitiativesPanel />
          <ProductsPanel />
          <CompetitivePanel />
          <TerritoryPanel />
          <EventsPanel />
          <TeamCapPanel />
        </Content>
      </Main>
    </Shell>
  );
}
