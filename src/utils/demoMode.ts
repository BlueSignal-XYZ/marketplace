/**
 * Demo Mode Utilities
 * Provides functionality to detect and manage demo mode for presentations.
 *
 * Demo mode can be enabled via:
 * 1. localStorage toggle (set from Profile/Settings page)
 * 2. URL parameter (?demo=1)
 * 3. Environment variable (VITE_DEMO_MODE=true)
 */

const DEMO_MODE_KEY = 'bluesignal_demo_mode';

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check localStorage (user preference from Profile page)
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  if (stored === 'true') return true;

  // 2. Check URL parameter
  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') === '1') return true;

  // 3. Check env var
  if (import.meta.env.VITE_DEMO_MODE === 'true') return true;

  return false;
}

export function setDemoMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_MODE_KEY, String(enabled));
}

export function clearDemoMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEMO_MODE_KEY);
}

export function getDemoHintForScreen(screenName: string): string | null {
  const hints: Record<string, string> = {
    'cloud-dashboard':
      'For utilities: highlight basin-wide coverage. For installers: show device health at a glance.',
    'wqt-calculator':
      'For farmers: estimate credits from cover crops. For utilities: model offset purchases.',
    'wqt-registry': 'For regulators: demonstrate transparency and audit trail.',
    'wqt-marketplace': 'For buyers: browse verified credits. For sellers: showcase your projects.',
    commissioning: 'For installers: demonstrate streamlined device setup and validation.',
    devices: 'For utilities: show real-time monitoring across your deployment.',
    alerts: 'For operators: highlight proactive issue detection and resolution.',
  };

  return hints[screenName] || null;
}
