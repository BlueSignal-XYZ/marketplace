import { describe, it, expect } from 'vitest';
import {
  getDefaultDashboardRoute,
  hasRouteAccess,
  getRoleDisplayName,
} from './roleRouting';

describe('roleRouting', () => {
  describe('getDefaultDashboardRoute', () => {
    it('should return "/" for null user', () => {
      expect(getDefaultDashboardRoute(null)).toBe('/');
      expect(getDefaultDashboardRoute(undefined)).toBe('/');
    });

    // ── Marketplace mode ──────────────────────────────────
    it('should route buyer to /dashboard/buyer in marketplace mode', () => {
      expect(getDefaultDashboardRoute({ role: 'buyer' }, 'marketplace')).toBe('/dashboard/buyer');
    });

    it('should route seller to /dashboard/seller in marketplace mode', () => {
      expect(getDefaultDashboardRoute({ role: 'seller' }, 'marketplace')).toBe('/dashboard/seller');
    });

    it('should route farmer to /dashboard/seller in marketplace mode', () => {
      expect(getDefaultDashboardRoute({ role: 'farmer' }, 'marketplace')).toBe('/dashboard/seller');
    });

    it('should route installer to /dashboard/installer in marketplace mode', () => {
      expect(getDefaultDashboardRoute({ role: 'installer' }, 'marketplace')).toBe('/dashboard/installer');
    });

    it('should route admin to /marketplace in marketplace mode', () => {
      expect(getDefaultDashboardRoute({ role: 'admin' }, 'marketplace')).toBe('/marketplace');
    });

    it('should route operator to /marketplace in marketplace mode', () => {
      expect(getDefaultDashboardRoute({ role: 'operator' }, 'marketplace')).toBe('/marketplace');
    });

    it('should route user with no role to /marketplace (safe fallback)', () => {
      expect(getDefaultDashboardRoute({ uid: 'some-uid' }, 'marketplace')).toBe('/marketplace');
    });

    it('should route user with unknown role to /marketplace', () => {
      expect(getDefaultDashboardRoute({ role: 'unknown_role' }, 'marketplace')).toBe('/marketplace');
    });

    // ── Cloud mode ────────────────────────────────────────
    it('should route any authenticated user to /dashboard/main in cloud mode', () => {
      expect(getDefaultDashboardRoute({ role: 'buyer' }, 'cloud')).toBe('/dashboard/main');
      expect(getDefaultDashboardRoute({ role: 'admin' }, 'cloud')).toBe('/dashboard/main');
      expect(getDefaultDashboardRoute({ role: 'installer' }, 'cloud')).toBe('/dashboard/main');
      expect(getDefaultDashboardRoute({}, 'cloud')).toBe('/dashboard/main');
    });

    // ── Default mode (marketplace) ────────────────────────
    it('should default to marketplace mode when mode is not specified', () => {
      expect(getDefaultDashboardRoute({ role: 'buyer' })).toBe('/dashboard/buyer');
    });
  });

  describe('hasRouteAccess', () => {
    it('should deny access for null user', () => {
      expect(hasRouteAccess(null, '/dashboard/buyer')).toBe(false);
    });

    it('should allow admin access to everything', () => {
      const admin = { role: 'admin' };
      expect(hasRouteAccess(admin, '/dashboard/buyer')).toBe(true);
      expect(hasRouteAccess(admin, '/dashboard/seller')).toBe(true);
      expect(hasRouteAccess(admin, '/dashboard/installer')).toBe(true);
      expect(hasRouteAccess(admin, '/marketplace')).toBe(true);
      expect(hasRouteAccess(admin, '/cloud/anything')).toBe(true);
    });

    it('should allow public routes for any authenticated user', () => {
      const buyer = { role: 'buyer' };
      expect(hasRouteAccess(buyer, '/marketplace')).toBe(true);
      expect(hasRouteAccess(buyer, '/marketplace/listing/123')).toBe(true);
      expect(hasRouteAccess(buyer, '/registry')).toBe(true);
      expect(hasRouteAccess(buyer, '/map')).toBe(true);
      expect(hasRouteAccess(buyer, '/presale')).toBe(true);
      expect(hasRouteAccess(buyer, '/recent-removals')).toBe(true);
    });

    it('should allow cloud routes for all authenticated users', () => {
      const buyer = { role: 'buyer' };
      expect(hasRouteAccess(buyer, '/dashboard/main')).toBe(true);
      expect(hasRouteAccess(buyer, '/cloud/something')).toBe(true);
      expect(hasRouteAccess(buyer, '/features/calculator')).toBe(true);
    });

    it('should allow buyer dashboard only for buyer role', () => {
      expect(hasRouteAccess({ role: 'buyer' }, '/dashboard/buyer')).toBe(true);
      expect(hasRouteAccess({ role: 'seller' }, '/dashboard/buyer')).toBe(false);
    });

    it('should allow seller dashboard for seller and farmer roles', () => {
      expect(hasRouteAccess({ role: 'seller' }, '/dashboard/seller')).toBe(true);
      expect(hasRouteAccess({ role: 'farmer' }, '/dashboard/seller')).toBe(true);
      expect(hasRouteAccess({ role: 'buyer' }, '/dashboard/seller')).toBe(false);
    });

    it('should allow installer dashboard only for installer role', () => {
      expect(hasRouteAccess({ role: 'installer' }, '/dashboard/installer')).toBe(true);
      expect(hasRouteAccess({ role: 'buyer' }, '/dashboard/installer')).toBe(false);
    });

    it('should allow seller-dashboard for seller and farmer', () => {
      expect(hasRouteAccess({ role: 'seller' }, '/marketplace/seller-dashboard')).toBe(true);
      expect(hasRouteAccess({ role: 'farmer' }, '/marketplace/seller-dashboard')).toBe(true);
      // Note: buyer also gets access because /marketplace/* is a public prefix.
      // Actual seller-dashboard content gating is handled by the route component.
      expect(hasRouteAccess({ role: 'buyer' }, '/marketplace/seller-dashboard')).toBe(true);
    });
  });

  describe('getRoleDisplayName', () => {
    it('should return correct display names', () => {
      expect(getRoleDisplayName('buyer')).toBe('Credit Buyer');
      expect(getRoleDisplayName('seller')).toBe('Credit Seller');
      expect(getRoleDisplayName('installer')).toBe('Device Installer');
      expect(getRoleDisplayName('farmer')).toBe('Farm Operator');
      expect(getRoleDisplayName('operator')).toBe('Facility Operator');
      expect(getRoleDisplayName('admin')).toBe('Administrator');
    });

    it('should return "User" for unknown roles', () => {
      expect(getRoleDisplayName('unknown')).toBe('User');
      expect(getRoleDisplayName(null)).toBe('User');
      expect(getRoleDisplayName(undefined)).toBe('User');
    });
  });
});
