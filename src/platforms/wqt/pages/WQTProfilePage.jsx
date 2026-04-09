/**
 * WQTProfilePage — comprehensive account page for WaterQuality.Trading.
 * Tabbed layout: Profile, Wallet, Transactions, Devices, Settings.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Wallet,
  ArrowRightLeft,
  Cpu,
  Settings,
  Copy,
  ExternalLink,
  LogOut,
  Bell,
  Key,
  Check,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { getPortfolio, getDevices } from '../../../services/v2/client';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { Badge } from '../../../design-system/primitives/Badge';
import { Button } from '../../../design-system/primitives/Button';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Table } from '../../../design-system/primitives/Table';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Pagination } from '../../../design-system/primitives/Pagination';
import { isDemoMode, setDemoMode } from '../../../utils/demoMode';
import { UserProfileAPI } from '../../../scripts/back_door';

// ── Constants ────────────────────────────────────────────

const TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={15} /> },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={15} /> },
  { id: 'transactions', label: 'Transactions', icon: <ArrowRightLeft size={15} /> },
  { id: 'devices', label: 'Devices', icon: <Cpu size={15} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={15} /> },
];

const TX_PER_PAGE = 10;

const POLYGONSCAN_BASE = 'https://polygonscan.com/address/';

// ── Helpers ──────────────────────────────────────────────

function truncate(str, startLen = 6, endLen = 4) {
  if (!str) return '';
  if (str.length <= startLen + endLen + 3) return str;
  return `${str.slice(0, startLen)}...${str.slice(-endLen)}`;
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function formatDate(ts) {
  if (!ts) return '--';
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '--';
  }
}

function formatCurrency(val) {
  if (val == null) return '$0.00';
  return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Styled Components ────────────────────────────────────

const Page = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 24px 64px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    padding: 20px 16px 48px;
  }
`;

const BackLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  text-decoration: none;
  margin-bottom: 24px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin: 0 0 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  margin: 0;
`;

const TabContent = styled.div`
  margin-top: 28px;
`;

// ── Profile Tab Styles ───────────────────────────────────

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors?.surface || 'white'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  padding: 28px 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    padding: 20px 16px;
  }
`;

const ProfileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const AvatarCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: ${({ theme }) => theme.radius?.full || 9999}px;
  background: ${({ theme }) => theme.colors?.primaryLight || 'rgba(0,82,204,0.08)'};
  color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.h2`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ProfileEmail = styled.p`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  margin: 0;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FieldGroup = styled.div``;

const FieldLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  margin-bottom: 6px;
`;

const FieldValue = styled.div`
  font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
`;

const CopyBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
    background: ${({ theme }) => theme.colors?.background || '#F8F9FA'};
  }
`;

const ExternalLinkStyled = styled.a`
  color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

// ── Wallet Tab Styles ────────────────────────────────────

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    grid-template-columns: 1fr;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
`;

// ── Devices Tab Styles ───────────────────────────────────

const Section = styled.section`
  background: ${({ theme }) => theme.colors?.surface || 'white'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  padding: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    padding: 16px;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin: 0 0 16px;
`;

const DeviceCount = styled.span`
  font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  display: block;
  margin-bottom: 8px;
`;

const CloudLink = styled.a`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    text-decoration: underline;
  }
`;

// ── Settings Tab Styles ──────────────────────────────────

const SettingsSection = styled.div`
  background: ${({ theme }) => theme.colors?.surface || 'white'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  padding: 24px;
  margin-bottom: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    padding: 16px;
  }
`;

const SettingsSectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  }
`;

const ToggleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToggleLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
`;

const ToggleDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  margin-top: 2px;
`;

const ToggleTrack = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;

  &:checked + span {
    background: ${({ theme }) => theme.colors?.positive || '#10B981'};
  }

  &:checked + span::after {
    transform: translateX(20px);
  }

  &:focus-visible + span {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || '#0052CC'};
    outline-offset: 2px;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  background: #d1d5db;
  border-radius: 12px;
  transition: background 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 2px;
    top: 2px;
    background: white;
    border-radius: 50%;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const DangerZone = styled.div`
  margin-top: 32px;
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
`;

// ── Component ────────────────────────────────────────────

export function WQTProfilePage() {
  useEffect(() => {
    document.title = 'Profile — WaterQuality.Trading';
  }, []);
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);
  const [devices, setDevices] = useState(null);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const [copied, setCopied] = useState(null);

  // Demo mode
  const [demoEnabled, setDemoEnabled] = useState(isDemoMode());

  // Notification prefs (persisted to localStorage + backend)
  const [emailNotif, setEmailNotif] = useState(() => {
    try {
      const v = localStorage.getItem('wqt_pref_emailNotif');
      return v !== null ? JSON.parse(v) : true;
    } catch {
      return true;
    }
  });
  const [marketNotif, setMarketNotif] = useState(() => {
    try {
      const v = localStorage.getItem('wqt_pref_marketNotif');
      return v !== null ? JSON.parse(v) : true;
    } catch {
      return true;
    }
  });
  const [deviceNotif, setDeviceNotif] = useState(() => {
    try {
      const v = localStorage.getItem('wqt_pref_deviceNotif');
      return v !== null ? JSON.parse(v) : false;
    } catch {
      return false;
    }
  });

  // Load notification prefs from backend on mount
  useEffect(() => {
    if (!user?.uid) return;
    UserProfileAPI.get(user.uid)
      .then((data) => {
        const prefs = data?.preferences;
        if (prefs) {
          if (prefs.emailNotifications !== undefined) setEmailNotif(prefs.emailNotifications);
          if (prefs.marketNotifications !== undefined) setMarketNotif(prefs.marketNotifications);
          if (prefs.deviceNotifications !== undefined) setDeviceNotif(prefs.deviceNotifications);
        }
      })
      .catch(() => {
        // Use localStorage defaults on error
      });
  }, [user?.uid]);

  // Persist to localStorage immediately + debounce backend save
  useEffect(() => {
    try {
      localStorage.setItem('wqt_pref_emailNotif', JSON.stringify(emailNotif));
      localStorage.setItem('wqt_pref_marketNotif', JSON.stringify(marketNotif));
      localStorage.setItem('wqt_pref_deviceNotif', JSON.stringify(deviceNotif));
    } catch {
      /* localStorage unavailable */
    }

    // Debounce backend save (1 second)
    if (!user?.uid) return;
    const timer = setTimeout(() => {
      UserProfileAPI.update(user.uid, {
        preferences: {
          emailNotifications: emailNotif,
          marketNotifications: marketNotif,
          deviceNotifications: deviceNotif,
        },
      }).catch(() => {
        // Silent fail — localStorage has the latest values as fallback
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [emailNotif, marketNotif, deviceNotif, user?.uid]);

  // Fetch portfolio
  useEffect(() => {
    if (!user?.uid) return;
    setPortfolioLoading(true);
    setPortfolioError(null);
    getPortfolio(user.uid)
      .then((data) => setPortfolio(data))
      .catch((err) => setPortfolioError(err?.message || 'Failed to load portfolio'))
      .finally(() => setPortfolioLoading(false));
  }, [user?.uid]);

  // Fetch devices
  useEffect(() => {
    if (!user?.uid) return;
    setDevicesLoading(true);
    getDevices(user.uid)
      .then((data) => setDevices(data || []))
      .catch(() => setDevices([]))
      .finally(() => setDevicesLoading(false));
  }, [user?.uid]);

  // Copy to clipboard
  const copyToClipboard = useCallback((text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {});
  }, []);

  // Transaction pagination
  const transactions = portfolio?.transactions || [];
  const totalTxPages = Math.max(1, Math.ceil(transactions.length / TX_PER_PAGE));
  const paginatedTx = useMemo(() => {
    const start = (txPage - 1) * TX_PER_PAGE;
    return transactions.slice(start, start + TX_PER_PAGE);
  }, [transactions, txPage]);

  // Credit balances from holdings
  const qcBalance = useMemo(() => {
    if (!portfolio?.holdings) return 0;
    return portfolio.holdings
      .filter((h) => h.nutrientType === 'nitrogen' && h.status !== 'retired')
      .reduce((sum, h) => sum + (h.quantity || 0), 0);
  }, [portfolio]);

  const kcBalance = useMemo(() => {
    if (!portfolio?.holdings) return 0;
    return portfolio.holdings
      .filter((h) => h.nutrientType === 'phosphorus' && h.status !== 'retired')
      .reduce((sum, h) => sum + (h.quantity || 0), 0);
  }, [portfolio]);

  const pendingCredits = useMemo(() => {
    if (!portfolio?.holdings) return 0;
    return portfolio.holdings
      .filter((h) => h.status === 'pending-review')
      .reduce((sum, h) => sum + (h.quantity || 0), 0);
  }, [portfolio]);

  // Demo toggle
  const handleDemoToggle = () => {
    const next = !demoEnabled;
    setDemoMode(next);
    setDemoEnabled(next);
    window.location.reload();
  };

  // Transaction table columns
  const txColumns = useMemo(
    () => [
      {
        key: 'timestamp',
        header: 'Date',
        sortable: true,
        render: (row) => formatDate(row.timestamp),
      },
      {
        key: 'type',
        header: 'Type',
        render: (row) => (
          <Badge
            variant={
              row.type === 'purchase' ? 'info' : row.type === 'sale' ? 'positive' : 'warning'
            }
            size="sm"
          >
            {row.type}
          </Badge>
        ),
      },
      {
        key: 'nutrientType',
        header: 'Credit Type',
        render: (row) => row.nutrientType || '--',
      },
      {
        key: 'quantity',
        header: 'Quantity',
        align: 'right',
        mono: true,
        render: (row) => `${row.quantity || 0} kg`,
      },
      {
        key: 'price',
        header: 'Price',
        align: 'right',
        mono: true,
        render: (row) => formatCurrency(row.price),
      },
      {
        key: 'txHash',
        header: 'Status',
        render: (row) =>
          row.transactionHash ? (
            <Badge variant="positive" size="sm" dot>
              Confirmed
            </Badge>
          ) : (
            <Badge variant="warning" size="sm" dot>
              Pending
            </Badge>
          ),
      },
    ],
    []
  );

  // ── Render helpers ───────────────────────────────────────

  const renderProfile = () => (
    <ProfileCard>
      <ProfileTop>
        <AvatarCircle>{getInitials(user?.displayName || user?.email)}</AvatarCircle>
        <ProfileInfo>
          <ProfileName>
            {user?.displayName || 'Anonymous User'}
            {user?.role === 'verified' || user?.emailVerified ? (
              <Badge variant="positive" size="sm" icon={<ShieldCheck size={12} />}>
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" size="sm" icon={<ShieldAlert size={12} />}>
                Unverified
              </Badge>
            )}
          </ProfileName>
          <ProfileEmail>{user?.email || 'No email on file'}</ProfileEmail>
        </ProfileInfo>
      </ProfileTop>

      <FieldGrid>
        <FieldGroup>
          <FieldLabel>Account ID</FieldLabel>
          <FieldValue>
            {truncate(user?.uid, 8, 6)}
            {user?.uid && (
              <CopyBtn onClick={() => copyToClipboard(user.uid, 'uid')} title="Copy full ID">
                {copied === 'uid' ? <Check size={14} /> : <Copy size={14} />}
              </CopyBtn>
            )}
          </FieldValue>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Role</FieldLabel>
          <FieldValue style={{ fontFamily: 'inherit' }}>{user?.role || 'Member'}</FieldValue>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Wallet Address</FieldLabel>
          <FieldValue>
            {user?.walletAddress ? (
              <>
                <ExternalLinkStyled
                  href={`${POLYGONSCAN_BASE}${user.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncate(user.walletAddress, 6, 4)}
                  <ExternalLink size={12} />
                </ExternalLinkStyled>
                <CopyBtn
                  onClick={() => copyToClipboard(user.walletAddress, 'wallet')}
                  title="Copy wallet address"
                >
                  {copied === 'wallet' ? <Check size={14} /> : <Copy size={14} />}
                </CopyBtn>
              </>
            ) : (
              <span style={{ fontFamily: 'inherit', color: 'inherit', opacity: 0.5 }}>
                Not connected
              </span>
            )}
          </FieldValue>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Company</FieldLabel>
          <FieldValue style={{ fontFamily: 'inherit' }}>{user?.company || '--'}</FieldValue>
        </FieldGroup>
      </FieldGrid>
    </ProfileCard>
  );

  const renderWallet = () => {
    if (portfolioLoading) {
      return (
        <LoadingWrap>
          <CardGrid>
            <Skeleton height={120} radius={12} />
            <Skeleton height={120} radius={12} />
            <Skeleton height={120} radius={12} />
          </CardGrid>
        </LoadingWrap>
      );
    }

    const hasCredits = qcBalance > 0 || kcBalance > 0 || pendingCredits > 0;

    if (portfolioError || (!hasCredits && !portfolio)) {
      return (
        <EmptyState
          icon={<Wallet size={40} />}
          title="No credits yet"
          description="Purchase water quality credits on the marketplace to see your balances here."
          action={{
            label: 'Browse Marketplace',
            onClick: () => navigate('/marketplace'),
          }}
          compact
        />
      );
    }

    return (
      <>
        <CardGrid>
          <DataCard
            label="AWG Credits"
            value={qcBalance.toLocaleString()}
            unit="kg"
            icon={<Wallet size={14} />}
            compact
          />
          <DataCard
            label="Pending Verification"
            value={pendingCredits.toLocaleString()}
            unit="kg"
            icon={<ArrowRightLeft size={14} />}
            compact
          />
        </CardGrid>

        {portfolio && (
          <CardGrid>
            <DataCard
              label="Total Portfolio Value"
              value={formatCurrency(portfolio.totalValue)}
              compact
            />
          </CardGrid>
        )}

        <QuickActions>
          <Button
            variant="primary"
            size="sm"
            icon={<Wallet size={15} />}
            onClick={() => navigate('/marketplace')}
          >
            Buy Credits
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowRightLeft size={15} />}
            onClick={() => navigate('/marketplace/create-listing')}
          >
            Sell Credits
          </Button>
        </QuickActions>
      </>
    );
  };

  const renderTransactions = () => {
    if (portfolioLoading) {
      return (
        <LoadingWrap>
          <Skeleton height={40} />
          <Skeleton height={280} radius={12} />
        </LoadingWrap>
      );
    }

    if (portfolioError || transactions.length === 0) {
      return (
        <EmptyState
          icon={<ArrowRightLeft size={40} />}
          title="No transactions yet"
          description="When you buy or sell credits on the marketplace, your transaction history will appear here."
          action={{
            label: 'Browse Marketplace',
            onClick: () => navigate('/marketplace'),
          }}
        />
      );
    }

    return (
      <>
        <Table
          columns={txColumns}
          data={paginatedTx}
          rowKey={(row) => row.id || `${row.timestamp}-${row.type}`}
          compact
          emptyMessage="No transactions"
        />
        <Pagination page={txPage} totalPages={totalTxPages} onPageChange={setTxPage} />
      </>
    );
  };

  const renderDevices = () => {
    if (devicesLoading) {
      return (
        <LoadingWrap>
          <Skeleton height={160} radius={12} />
        </LoadingWrap>
      );
    }

    const deviceCount = devices?.length || 0;

    if (deviceCount === 0) {
      return (
        <EmptyState
          icon={<Cpu size={40} />}
          title="No devices linked"
          description="Register a device on BlueSignal Cloud to start generating credits."
          action={{
            label: 'Go to BlueSignal Cloud',
            onClick: () => window.open('https://cloud.bluesignal.xyz', '_blank'),
          }}
        />
      );
    }

    return (
      <Section>
        <SectionTitle>Linked Devices</SectionTitle>
        <DeviceCount>{deviceCount}</DeviceCount>
        <CloudLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener noreferrer">
          Manage your devices on BlueSignal Cloud
          <ExternalLink size={14} />
        </CloudLink>
      </Section>
    );
  };

  const renderSettings = () => (
    <>
      {/* Demo Mode */}
      <SettingsSection>
        <SettingsSectionTitle>Demo Mode</SettingsSectionTitle>
        <ToggleRow>
          <ToggleInfo>
            <ToggleLabel>Enable Demo Mode</ToggleLabel>
            <ToggleDesc>
              {demoEnabled
                ? 'Demo mode is active. All data shown is sample data.'
                : 'Explore the platform with sample data for presentations and testing.'}
            </ToggleDesc>
          </ToggleInfo>
          <ToggleTrack>
            <ToggleInput type="checkbox" checked={demoEnabled} onChange={handleDemoToggle} />
            <ToggleSlider />
          </ToggleTrack>
        </ToggleRow>
      </SettingsSection>

      {/* Notification Preferences */}
      <SettingsSection>
        <SettingsSectionTitle>
          <Bell size={16} />
          Notification Preferences
        </SettingsSectionTitle>
        <ToggleRow>
          <ToggleInfo>
            <ToggleLabel>Email Notifications</ToggleLabel>
            <ToggleDesc>Receive transaction confirmations and account alerts via email</ToggleDesc>
          </ToggleInfo>
          <ToggleTrack>
            <ToggleInput
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
            <ToggleSlider />
          </ToggleTrack>
        </ToggleRow>
        <ToggleRow>
          <ToggleInfo>
            <ToggleLabel>Market Alerts</ToggleLabel>
            <ToggleDesc>Get notified about price changes and new listings</ToggleDesc>
          </ToggleInfo>
          <ToggleTrack>
            <ToggleInput
              type="checkbox"
              checked={marketNotif}
              onChange={() => setMarketNotif(!marketNotif)}
            />
            <ToggleSlider />
          </ToggleTrack>
        </ToggleRow>
        <ToggleRow>
          <ToggleInfo>
            <ToggleLabel>Device Alerts</ToggleLabel>
            <ToggleDesc>Alerts when linked devices go offline or need attention</ToggleDesc>
          </ToggleInfo>
          <ToggleTrack>
            <ToggleInput
              type="checkbox"
              checked={deviceNotif}
              onChange={() => setDeviceNotif(!deviceNotif)}
            />
            <ToggleSlider />
          </ToggleTrack>
        </ToggleRow>
      </SettingsSection>

      {/* API Keys */}
      <SettingsSection>
        <SettingsSectionTitle>
          <Key size={16} />
          API Keys
          <Badge variant="neutral" size="sm">
            Coming Soon
          </Badge>
        </SettingsSectionTitle>
        <ToggleDesc>
          Programmatic access to your portfolio and transaction data will be available in a future
          update.
        </ToggleDesc>
      </SettingsSection>

      {/* Logout */}
      <DangerZone>
        <Button
          variant="destructive"
          icon={<LogOut size={16} />}
          onClick={() => {
            if (ACTIONS?.handleLogOut) {
              ACTIONS.handleLogOut();
            } else if (ACTIONS?.logout) {
              ACTIONS.logout();
            }
          }}
        >
          Log Out
        </Button>
      </DangerZone>
    </>
  );

  // ── Main render ──────────────────────────────────────────

  return (
    <Page>
      <BackLink to="/marketplace">&larr; Back to Marketplace</BackLink>

      <PageHeader>
        <PageTitle>Account</PageTitle>
        <PageSubtitle>Manage your profile, wallet, and settings</PageSubtitle>
      </PageHeader>

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          setTxPage(1);
        }}
      />

      <TabContent>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'devices' && renderDevices()}
        {activeTab === 'settings' && renderSettings()}
      </TabContent>
    </Page>
  );
}

export default WQTProfilePage;
