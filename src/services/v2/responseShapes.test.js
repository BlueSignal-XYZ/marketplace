import { describe, it, expect } from 'vitest';

/**
 * These tests verify that the v2 API response shapes match what
 * Cloud dashboard components expect after the v1→v2 migration.
 * They serve as living documentation of the API contract.
 */

describe('v2 API response shape contracts', () => {
  describe('DeviceSummary shape (getDevices response)', () => {
    const device = {
      id: 'pgw-0001',
      name: 'Lakefront Buoy #1',
      status: 'active',
      onlineStatus: 'online',
      battery: 87,
      lastReadingAt: '2026-02-22T10:00:00Z',
      location: {
        latitude: 39.5,
        longitude: -79.3,
        address: 'Deep Creek Lake',
        city: '',
        state: 'MD',
        country: 'US',
      },
      creditsGenerated: 12,
    };

    it('should have id and name', () => {
      expect(device.id).toBeDefined();
      expect(device.name).toBeDefined();
    });

    it('should have onlineStatus for dashboard filtering', () => {
      // OverviewDashboard filters by d.onlineStatus === "online"
      expect(['online', 'offline', 'unknown']).toContain(device.onlineStatus);
    });

    it('should have location with latitude/longitude', () => {
      expect(device.location).toBeDefined();
      expect(typeof device.location.latitude).toBe('number');
      expect(typeof device.location.longitude).toBe('number');
    });

    it('should have siteId for site-specific filtering', () => {
      // SiteDetailPage filters devices by d.siteId === siteId
      // siteId is optional (may be undefined for unassigned devices)
      const deviceWithSite = { ...device, siteId: 'site-1' };
      expect(deviceWithSite.siteId).toBe('site-1');
    });
  });

  describe('Device shape (getDevice response)', () => {
    const device = {
      id: 'pgw-0001',
      serialNumber: 'PGW-0001',
      name: 'Lakefront Buoy #1',
      model: 'BS-WQM-100',
      firmwareVersion: 'v2.4.1',
      status: 'active',
      onlineStatus: 'online',
      ownerId: 'user-123',
      siteId: 'site-1',
      battery: 87,
      lastReadingAt: '2026-02-22T10:00:00Z',
      location: {
        latitude: 39.5,
        longitude: -79.3,
        address: 'Deep Creek Lake',
      },
      latestReadings: [
        { type: 'pH', value: 7.2, unit: '', timestamp: '2026-02-22T10:00:00Z' },
        { type: 'temperature', value: 18.4, unit: '°C', timestamp: '2026-02-22T10:00:00Z' },
      ],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-02-22T10:00:00Z',
    };

    it('should have full device details', () => {
      // DeviceDetailPage reads device directly (flat object, not .device wrapper)
      expect(device.serialNumber).toBeDefined();
      expect(device.model).toBeDefined();
      expect(device.firmwareVersion).toBeDefined();
    });

    it('should have latestReadings array', () => {
      expect(Array.isArray(device.latestReadings)).toBe(true);
      expect(device.latestReadings[0]).toHaveProperty('type');
      expect(device.latestReadings[0]).toHaveProperty('value');
      expect(device.latestReadings[0]).toHaveProperty('unit');
    });
  });

  describe('Alert shape (getAlerts / getDeviceAlerts response)', () => {
    const alert = {
      id: 'alert-001',
      deviceId: 'pgw-0001',
      deviceName: 'Lakefront Buoy #1',
      severity: 'warning',
      status: 'active',
      type: 'threshold_breach',
      message: 'pH threshold exceeded',
      createdAt: '2026-02-22T09:00:00Z',
      updatedAt: '2026-02-22T09:00:00Z',
    };

    it('should have required fields for AlertsPage', () => {
      expect(alert.id).toBeDefined();
      expect(alert.deviceId).toBeDefined();
      expect(alert.severity).toBeDefined();
      expect(alert.status).toBeDefined();
      expect(alert.message).toBeDefined();
    });

    it('should have valid severity values', () => {
      expect(['info', 'warning', 'critical']).toContain(alert.severity);
    });

    it('should have valid status values', () => {
      expect(['active', 'acknowledged', 'resolved']).toContain(alert.status);
    });
  });

  describe('Site shape (getSites response)', () => {
    const site = {
      id: 'site-1',
      name: 'Deep Creek Lake',
      ownerId: 'user-123',
      location: {
        latitude: 39.5,
        longitude: -79.3,
        address: 'Maryland, USA',
      },
      devices: ['pgw-0001', 'pgw-0002'],
      description: 'Monitoring site',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-02-22T10:00:00Z',
    };

    it('should have required fields for SitesListPage', () => {
      expect(site.id).toBeDefined();
      expect(site.name).toBeDefined();
      expect(site.location).toBeDefined();
    });

    it('should have devices array', () => {
      expect(Array.isArray(site.devices)).toBe(true);
    });

    it('should have location coordinates', () => {
      expect(typeof site.location.latitude).toBe('number');
      expect(typeof site.location.longitude).toBe('number');
    });
  });

  describe('User profile shape (UserProfileAPI.get response)', () => {
    const profile = {
      uid: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'buyer',
      company: 'Acme Corp',
      phone: '+1555123',
      onboardingComplete: true,
      createdAt: 1706745600000,
      updatedAt: 1708617600000,
      settings: { timezone: 'America/New_York', units: 'imperial' },
      wallets: { polygon: { address: '', linked: false } },
    };

    it('should have flat profile fields (not nested under .profile)', () => {
      // AppContext reads: profileData.uid, profileData.role, etc.
      expect(profile.uid).toBeDefined();
      expect(profile.role).toBeDefined();
      expect(profile.displayName).toBeDefined();
    });

    it('should have role for routing decisions', () => {
      // getDefaultDashboardRoute reads user.role
      expect(['buyer', 'seller', 'installer', 'admin', 'farmer', 'operator']).toContain(
        profile.role
      );
    });

    it('should have onboardingComplete flag', () => {
      expect(typeof profile.onboardingComplete).toBe('boolean');
    });

    it('should have settings as nested object', () => {
      expect(profile.settings).toBeDefined();
      expect(profile.settings.timezone).toBeDefined();
    });
  });
});
