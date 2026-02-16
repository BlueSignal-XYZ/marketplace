/**
 * React Query hooks for v2 API endpoints.
 * Centralizes query keys and cache invalidation logic.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  searchListings,
  getPortfolio,
  getDevices,
  getAlerts,
  purchaseCredits,
  submitCredits,
  commissionDevice,
} from '../../services/v2/client';

// ── Query keys ────────────────────────────────────────────

export const queryKeys = {
  marketplace: (params) => ['marketplace', 'listings', params],
  portfolio: (userId) => ['portfolio', userId],
  devices: (userId) => ['devices', userId],
  alerts: (userId) => ['alerts', userId],
};

// ── Queries ───────────────────────────────────────────────

export function useMarketplaceQuery(params, options = {}) {
  return useQuery({
    queryKey: queryKeys.marketplace(params),
    queryFn: () => searchListings(params),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    ...options,
  });
}

export function usePortfolioQuery(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.portfolio(userId),
    queryFn: () => getPortfolio(userId),
    enabled: !!userId,
    staleTime: 30_000,
    ...options,
  });
}

export function useDevicesQuery(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.devices(userId),
    queryFn: () => getDevices(userId),
    enabled: !!userId,
    staleTime: 30_000,
    refetchInterval: 60_000,
    ...options,
  });
}

export function useAlertsQuery(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.alerts(userId),
    queryFn: () => getAlerts(userId),
    enabled: !!userId,
    staleTime: 30_000,
    refetchInterval: 60_000,
    ...options,
  });
}

// ── Mutations ─────────────────────────────────────────────

export function usePurchaseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: purchaseCredits,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });
}

export function useSubmitCreditsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitCredits,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}

export function useCommissionDeviceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: commissionDevice,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devices'] });
      qc.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
