/**
 * useCommission Hook
 * Manages the device commissioning workflow
 */

import { useState, useCallback, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db, auth } from "../apis/firebase";
import axios from "axios";
import configs from "../../configs";

// Commission workflow steps
const COMMISSION_STEPS = [
  { step: 1, name: "device_scan", label: "Scan Device", required: true },
  { step: 2, name: "site_selection", label: "Select Site", required: true },
  { step: 3, name: "location_capture", label: "Set Location", required: true },
  { step: 4, name: "photo_upload", label: "Upload Photos", required: true },
  { step: 5, name: "connectivity_test", label: "Test Device", required: true },
  { step: 6, name: "sensor_calibration", label: "Calibration", required: false },
  { step: 7, name: "review_confirm", label: "Review & Confirm", required: true },
];

/**
 * Get auth headers for API requests
 */
const getAuthHeaders = async () => {
  try {
    const currentUser = auth?.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }
  return {};
};

/**
 * useCommission Hook
 */
export function useCommission() {
  const [commissionId, setCommissionId] = useState(null);
  const [commission, setCommission] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState("idle"); // idle, in_progress, completed, failed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe to commission updates when commissionId is set
  useEffect(() => {
    if (!commissionId || !db) return;

    const commissionRef = ref(db, `commissions/${commissionId}`);
    const handleUpdate = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCommission(data);
        setCurrentStep(data.workflow?.currentStep || 1);
        setStatus(data.status);
      }
    };

    onValue(commissionRef, handleUpdate, (err) => {
      console.error("Commission subscription error:", err);
    });

    return () => off(commissionRef);
  }, [commissionId]);

  /**
   * Initiate a new commissioning process
   */
  const initiate = useCallback(async (deviceId, siteId = null) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${configs.server_url}/commission/initiate`,
        { deviceId, siteId },
        { headers }
      );

      const data = response.data;
      setCommissionId(data.commissionId);
      setCurrentStep(1);
      setStatus("initiated");

      return data.commissionId;
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Failed to initiate commission";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a commissioning step
   */
  const updateStep = useCallback(
    async (stepName, stepData) => {
      if (!commissionId) {
        throw new Error("No active commission");
      }

      setLoading(true);
      setError(null);

      try {
        const headers = await getAuthHeaders();
        const response = await axios.post(
          `${configs.server_url}/commission/update-step`,
          { commissionId, stepName, stepData },
          { headers }
        );

        return response.data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || "Failed to update step";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [commissionId]
  );

  /**
   * Complete the commissioning process
   */
  const complete = useCallback(async () => {
    if (!commissionId) {
      throw new Error("No active commission");
    }

    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${configs.server_url}/commission/complete`,
        { commissionId },
        { headers }
      );

      setStatus("completed");
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Failed to complete commission";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [commissionId]);

  /**
   * Cancel the commissioning process
   */
  const cancel = useCallback(
    async (reason = "") => {
      if (!commissionId) {
        throw new Error("No active commission");
      }

      setLoading(true);
      setError(null);

      try {
        const headers = await getAuthHeaders();
        await axios.post(
          `${configs.server_url}/commission/cancel`,
          { commissionId, reason },
          { headers }
        );

        setStatus("failed");
        setCommissionId(null);
        setCommission(null);
        setCurrentStep(1);
      } catch (err) {
        const message = err.response?.data?.error || err.message || "Failed to cancel commission";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [commissionId]
  );

  /**
   * Run connectivity and sensor tests
   */
  const runTests = useCallback(
    async (deviceId, tests = null) => {
      if (!commissionId) {
        throw new Error("No active commission");
      }

      setLoading(true);
      setError(null);

      try {
        const headers = await getAuthHeaders();
        const response = await axios.post(
          `${configs.server_url}/commission/run-tests`,
          { commissionId, deviceId, tests },
          { headers }
        );

        return response.data;
      } catch (err) {
        const message = err.response?.data?.error || err.message || "Failed to run tests";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [commissionId]
  );

  /**
   * Get the current step info
   */
  const getCurrentStepInfo = useCallback(() => {
    const step = COMMISSION_STEPS.find((s) => s.step === currentStep);
    return step || null;
  }, [currentStep]);

  /**
   * Get step status from commission data
   */
  const getStepStatus = useCallback(
    (stepName) => {
      if (!commission?.workflow?.steps) return "pending";
      const step = commission.workflow.steps.find((s) => s.name === stepName);
      return step?.status || "pending";
    },
    [commission]
  );

  /**
   * Check if a step is completed
   */
  const isStepCompleted = useCallback(
    (stepName) => {
      return getStepStatus(stepName) === "completed";
    },
    [getStepStatus]
  );

  /**
   * Get all steps with their status
   */
  const getStepsWithStatus = useCallback(() => {
    return COMMISSION_STEPS.map((step) => ({
      ...step,
      status: getStepStatus(step.name),
      isCurrent: step.step === currentStep,
      isCompleted: isStepCompleted(step.name),
    }));
  }, [currentStep, getStepStatus, isStepCompleted]);

  /**
   * Go to next step
   */
  const goToNextStep = useCallback(() => {
    if (currentStep < COMMISSION_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  /**
   * Go to previous step
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setCommissionId(null);
    setCommission(null);
    setCurrentStep(1);
    setStatus("idle");
    setError(null);
  }, []);

  /**
   * Load an existing commission
   */
  const loadCommission = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${configs.server_url}/commission/get`,
        { commissionId: id },
        { headers }
      );

      const data = response.data;
      setCommissionId(id);
      setCommission(data.commission);
      setCurrentStep(data.commission.workflow?.currentStep || 1);
      setStatus(data.commission.status);

      return data.commission;
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Failed to load commission";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    commissionId,
    commission,
    currentStep,
    status,
    loading,
    error,
    steps: COMMISSION_STEPS,

    // Actions
    initiate,
    updateStep,
    complete,
    cancel,
    runTests,
    reset,
    loadCommission,

    // Navigation
    goToNextStep,
    goToPreviousStep,

    // Helpers
    getCurrentStepInfo,
    getStepStatus,
    isStepCompleted,
    getStepsWithStatus,

    // Status checks
    isIdle: status === "idle",
    isInProgress: status === "initiated" || status.startsWith("device_") || status.startsWith("site_") || status.startsWith("location_") || status.startsWith("photo_") || status.startsWith("tests_"),
    isCompleted: status === "completed",
    isFailed: status === "failed",
  };
}

export default useCommission;
