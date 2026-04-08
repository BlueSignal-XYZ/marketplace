import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isDemoMode, setDemoMode, clearDemoMode, getDemoHintForScreen } from './demoMode';

describe('demoMode', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset location.search
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', search: '' },
      writable: true,
    });
    // Reset env
    vi.stubEnv('VITE_DEMO_MODE', '');
  });

  describe('isDemoMode', () => {
    it('returns false when no demo mode is set', () => {
      expect(isDemoMode()).toBe(false);
    });

    it('returns true when localStorage has demo mode enabled', () => {
      localStorage.setItem('bluesignal_demo_mode', 'true');
      expect(isDemoMode()).toBe(true);
    });

    it('returns false when localStorage has demo mode disabled', () => {
      localStorage.setItem('bluesignal_demo_mode', 'false');
      expect(isDemoMode()).toBe(false);
    });

    it('returns true when URL has ?demo=1', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost', search: '?demo=1' },
        writable: true,
      });
      expect(isDemoMode()).toBe(true);
    });

    it('returns false when URL has ?demo=0', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost', search: '?demo=0' },
        writable: true,
      });
      expect(isDemoMode()).toBe(false);
    });

    it('returns true when VITE_DEMO_MODE env var is "true"', () => {
      vi.stubEnv('VITE_DEMO_MODE', 'true');
      expect(isDemoMode()).toBe(true);
    });

    it('returns false when VITE_DEMO_MODE env var is "false"', () => {
      vi.stubEnv('VITE_DEMO_MODE', 'false');
      expect(isDemoMode()).toBe(false);
    });

    it('localStorage takes priority (short-circuits before URL param)', () => {
      localStorage.setItem('bluesignal_demo_mode', 'true');
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost', search: '' },
        writable: true,
      });
      expect(isDemoMode()).toBe(true);
    });
  });

  describe('setDemoMode', () => {
    it('sets demo mode to true in localStorage', () => {
      setDemoMode(true);
      expect(localStorage.getItem('bluesignal_demo_mode')).toBe('true');
    });

    it('sets demo mode to false in localStorage', () => {
      setDemoMode(false);
      expect(localStorage.getItem('bluesignal_demo_mode')).toBe('false');
    });
  });

  describe('clearDemoMode', () => {
    it('removes demo mode from localStorage', () => {
      localStorage.setItem('bluesignal_demo_mode', 'true');
      clearDemoMode();
      expect(localStorage.getItem('bluesignal_demo_mode')).toBeNull();
    });

    it('is safe to call when no demo mode is set', () => {
      clearDemoMode();
      expect(localStorage.getItem('bluesignal_demo_mode')).toBeNull();
    });
  });

  describe('getDemoHintForScreen', () => {
    it('returns hint for cloud-dashboard', () => {
      const hint = getDemoHintForScreen('cloud-dashboard');
      expect(hint).toContain('utilities');
      expect(hint).toContain('installers');
    });

    it('returns hint for wqt-calculator', () => {
      const hint = getDemoHintForScreen('wqt-calculator');
      expect(hint).toContain('farmers');
      expect(hint).toContain('utilities');
    });

    it('returns hint for wqt-registry', () => {
      const hint = getDemoHintForScreen('wqt-registry');
      expect(hint).toContain('regulators');
    });

    it('returns hint for wqt-marketplace', () => {
      const hint = getDemoHintForScreen('wqt-marketplace');
      expect(hint).toContain('buyers');
      expect(hint).toContain('sellers');
    });

    it('returns hint for commissioning', () => {
      const hint = getDemoHintForScreen('commissioning');
      expect(hint).toContain('installers');
    });

    it('returns hint for devices', () => {
      const hint = getDemoHintForScreen('devices');
      expect(hint).toContain('utilities');
    });

    it('returns hint for alerts', () => {
      const hint = getDemoHintForScreen('alerts');
      expect(hint).toContain('operators');
    });

    it('returns null for unknown screen', () => {
      expect(getDemoHintForScreen('nonexistent-screen')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getDemoHintForScreen('')).toBeNull();
    });
  });
});
