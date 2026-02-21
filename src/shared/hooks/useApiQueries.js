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
  getRevenueGradeStatus,
  enableRevenueGrade,
  disableRevenueGrade,
  getCalibrations,
  logCalibration,
  sendDeviceCommand,
  lookupHUC,
  getWQTLinkStatus,
  linkWQTAccount,
  registerCreditProject,
  getCreditProject,
  getCreditAccruals,
} from '../../services/v2/api';

// ── Query keys ────────────────────────────────────────────

export const queryKeys = {
  marketplace: (params) => ['marketplace', 'listings', params],
  portfolio: (userId) => ['portfolio', userId],
  devices: (userId) => ['devices', userId],
  alerts: (userId) => ['alerts', userId],
  revenueGrade: (deviceId) => ['revenueGrade', deviceId],
  calibrations: (deviceId) => ['calibrations', deviceId],
  wqtLink: () => ['wqtLink'],
  creditProject: (projectId) => ['creditProject', projectId],
  creditAccruals: (projectId) => ['creditAccruals', projectId],
  hucLookup: (lat, lng) => ['hucLookup', lat, lng],
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

// ── Revenue Grade ─────────────────────────────────────────

export function useRevenueGradeQuery(deviceId, options = {}) {
  return useQuery({
    queryKey: queryKeys.revenueGrade(deviceId),
    queryFn: () => getRevenueGradeStatus(deviceId),
    enabled: !!deviceId,
    staleTime: 30_000,
    ...options,
  });
}

export function useEnableRevenueGradeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, params }) => enableRevenueGrade(deviceId, params),
    onSuccess: (_, { deviceId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.revenueGrade(deviceId) });
      qc.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}

export function useDisableRevenueGradeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId) => disableRevenueGrade(deviceId),
    onSuccess: (_, deviceId) => {
      qc.invalidateQueries({ queryKey: queryKeys.revenueGrade(deviceId) });
    },
  });
}

// ── Calibrations ──────────────────────────────────────────

export function useCalibrationsQuery(deviceId, options = {}) {
  return useQuery({
    queryKey: queryKeys.calibrations(deviceId),
    queryFn: () => getCalibrations(deviceId),
    enabled: !!deviceId,
    staleTime: 60_000,
    ...options,
  });
}

export function useLogCalibrationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, calibration }) => logCalibration(deviceId, calibration),
    onSuccess: (_, { deviceId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.calibrations(deviceId) });
      qc.invalidateQueries({ queryKey: queryKeys.revenueGrade(deviceId) });
    },
  });
}

// ── Device Commands ───────────────────────────────────────

export function useSendCommandMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, command }) => sendDeviceCommand(deviceId, command),
    onSuccess: (_, { deviceId }) => {
      qc.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}

// ── HUC Lookup ────────────────────────────────────────────

export function useHUCLookupQuery(lat, lng, options = {}) {
  return useQuery({
    queryKey: queryKeys.hucLookup(lat, lng),
    queryFn: () => lookupHUC(lat, lng),
    enabled: !!lat && !!lng,
    staleTime: Infinity,
    ...options,
  });
}

// ── Account Linking ───────────────────────────────────────

export function useWQTLinkQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.wqtLink(),
    queryFn: () => getWQTLinkStatus(),
    staleTime: 60_000,
    ...options,
  });
}

export function useLinkWQTMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceIds) => linkWQTAccount(deviceIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wqtLink() });
    },
  });
}

// ── Credit Projects ───────────────────────────────────────

export function useCreditProjectQuery(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.creditProject(projectId),
    queryFn: () => getCreditProject(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
    ...options,
  });
}

export function useCreditAccrualsQuery(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.creditAccruals(projectId),
    queryFn: () => getCreditAccruals(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
    ...options,
  });
}

export function useRegisterProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params) => registerCreditProject(params),
    onSuccess: (data) => {
      if (data?.id) {
        qc.invalidateQueries({ queryKey: queryKeys.creditProject(data.id) });
      }
    },
  });
}
