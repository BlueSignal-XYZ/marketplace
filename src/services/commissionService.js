/**
 * Commission Service
 *
 * Business logic for the device commissioning workflow:
 * - Pre-deployment checklists
 * - Commissioning checklists
 * - Hardware tests
 * - Photo documentation
 * - Signature capture
 * - Device activation
 */

import { CommissionAPI, DeviceAPI, OrderAPI, SiteAPI } from '../scripts/back_door';
import HubSpotAPI from '../apis/hubspot';
import {
  PRE_DEPLOYMENT_CHECKLISTS,
  COMMISSIONING_CHECKLISTS,
  TEST_POINTS,
  REQUIRED_TOOLS,
  DEPLOYMENT_STEPS,
} from '../components/BlueSignalConfigurator/data/installation';

// Generate unique commission ID
const generateCommissionId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `COM-${timestamp}-${random}`.toUpperCase();
};

// Standard commission tests
const COMMISSION_TESTS = [
  { id: 'power_os', name: 'Power & OS Boot', required: true },
  { id: 'ads1115', name: 'ADS1115 ADC Detection', required: true },
  { id: 'ds18b20', name: 'DS18B20 Temperature Sensor', required: false },
  { id: 'ph_ntu', name: 'pH/Turbidity Sensors', required: true },
  { id: 'npk', name: 'NPK Modbus Sensors', required: false },
  { id: 'relay_ch1', name: 'Relay Channel 1', required: true },
  { id: 'relay_ch2', name: 'Relay Channel 2', required: false },
  { id: 'lte_wifi', name: 'Cellular/WiFi Connectivity', required: true },
  { id: 'cloud_ingest', name: 'Cloud Data Upload', required: true },
  { id: 'gps', name: 'GPS Position Lock', required: true },
  { id: 'ultrasonic', name: 'Ultrasonic Transducer', required: false },
  { id: 'solar_mppt', name: 'Solar MPPT Charging', required: false },
  { id: 'battery_voltage', name: 'Battery Voltage Check', required: false },
];

// Get tests applicable to a device type
const getTestsForDeviceType = (deviceType) => {
  const baseTests = ['power_os', 'ads1115', 'ph_ntu', 'relay_ch1', 'lte_wifi', 'cloud_ingest', 'gps'];

  const deviceSpecificTests = {
    'shore-ac': [...baseTests, 'ultrasonic'],
    'shore-solar': [...baseTests, 'ultrasonic', 'solar_mppt', 'battery_voltage'],
    'shore-monitor': [...baseTests, 'solar_mppt', 'battery_voltage'],
    'smart-buoy': [...baseTests, 'ultrasonic', 'solar_mppt', 'battery_voltage', 'ds18b20'],
    'smart-buoy-xl': [...baseTests, 'ultrasonic', 'solar_mppt', 'battery_voltage', 'ds18b20'],
  };

  const applicableTestIds = deviceSpecificTests[deviceType] || baseTests;
  return COMMISSION_TESTS.filter(test => applicableTestIds.includes(test.id));
};

// Determine checklist type from device type
const getChecklistType = (deviceType) => {
  if (deviceType?.includes('buoy')) {
    return 'buoy';
  }
  return 'shore';
};

/**
 * Initialize a new commission workflow for a device
 */
export const initializeCommission = async (deviceId, orderId, installerId) => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    const order = await OrderAPI.get(orderId);
    if (!order) throw new Error('Order not found');

    const checklistType = getChecklistType(device.deviceType);
    const now = new Date().toISOString();
    const commissionId = generateCommissionId();

    // Build pre-deployment checklist from template
    const preDeploymentTemplate = PRE_DEPLOYMENT_CHECKLISTS[checklistType] || [];
    const preDeploymentChecks = preDeploymentTemplate.map(item => ({
      id: item.id,
      text: item.text,
      category: item.category,
      completed: false,
      completedAt: null,
      completedBy: null,
      notes: null,
    }));

    // Build commissioning checklist from template
    const commissioningTemplate = COMMISSIONING_CHECKLISTS[checklistType] || [];
    const commissioningChecks = commissioningTemplate.map(item => ({
      id: item.id,
      text: item.text,
      category: item.category,
      completed: false,
      completedAt: null,
      completedBy: null,
      notes: null,
    }));

    // Initialize test results
    const applicableTests = getTestsForDeviceType(device.deviceType);
    const testResults = applicableTests.map(test => ({
      id: test.id,
      name: test.name,
      status: 'pending',
      duration: 0,
      details: null,
    }));

    const commissionData = {
      id: commissionId,
      deviceId,
      orderId,
      siteId: order.siteId,
      installerId,
      status: 'pending',
      checklistType,
      preDeploymentChecks,
      commissioningChecks,
      testResults,
      photos: [],
      notes: '',
      signature: null,
      result: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await CommissionAPI.create(commissionData);

    // Update device status
    await DeviceAPI.updateLifecycle(deviceId, 'delivered', {
      deliveredAt: now,
    });
    await DeviceAPI.editDevice(deviceId, {
      assignedInstallerId: installerId,
      commissionStatus: 'pending',
      lastCommissionId: commissionId,
    });

    return result;
  } catch (error) {
    console.error('Error initializing commission:', error);
    throw error;
  }
};

/**
 * Start the commission workflow
 */
export const startCommission = async (commissionId, installerId) => {
  try {
    const now = new Date().toISOString();
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    await CommissionAPI.update(commissionId, {
      status: 'in_progress',
      startedAt: now,
      updatedAt: now,
    });

    // Update device status
    await DeviceAPI.updateLifecycle(commission.deviceId, 'installed', {
      installedAt: now,
      installedBy: installerId,
    });
    await DeviceAPI.editDevice(commission.deviceId, {
      commissionStatus: 'in_progress',
    });

    return { success: true };
  } catch (error) {
    console.error('Error starting commission:', error);
    throw error;
  }
};

/**
 * Update pre-deployment checklist item
 */
export const updatePreDeploymentCheck = async (commissionId, checkId, completed, notes, userId) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const now = new Date().toISOString();
    const updatedChecks = commission.preDeploymentChecks.map(check => {
      if (check.id === checkId) {
        return {
          ...check,
          completed,
          completedAt: completed ? now : null,
          completedBy: completed ? userId : null,
          notes: notes || check.notes,
        };
      }
      return check;
    });

    await CommissionAPI.update(commissionId, {
      preDeploymentChecks: updatedChecks,
      updatedAt: now,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating pre-deployment check:', error);
    throw error;
  }
};

/**
 * Update commissioning checklist item
 */
export const updateCommissioningCheck = async (commissionId, checkId, completed, notes, userId) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const now = new Date().toISOString();
    const updatedChecks = commission.commissioningChecks.map(check => {
      if (check.id === checkId) {
        return {
          ...check,
          completed,
          completedAt: completed ? now : null,
          completedBy: completed ? userId : null,
          notes: notes || check.notes,
        };
      }
      return check;
    });

    await CommissionAPI.update(commissionId, {
      commissioningChecks: updatedChecks,
      updatedAt: now,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating commissioning check:', error);
    throw error;
  }
};

/**
 * Run hardware tests
 */
export const runTests = async (commissionId, specificTests = null) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const testsToRun = specificTests || commission.testResults.map(t => t.id);

    // Mark tests as running
    const runningTests = commission.testResults.map(test => {
      if (testsToRun.includes(test.id)) {
        return { ...test, status: 'running' };
      }
      return test;
    });

    await CommissionAPI.update(commissionId, {
      testResults: runningTests,
      status: 'awaiting_tests',
      updatedAt: new Date().toISOString(),
    });

    // Call backend to run actual hardware tests
    const testResults = await CommissionAPI.runTests(
      commissionId,
      commission.deviceId,
      testsToRun
    );

    return testResults;
  } catch (error) {
    console.error('Error running commission tests:', error);
    throw error;
  }
};

/**
 * Update test result (called by backend after test completion)
 */
export const updateTestResult = async (commissionId, testId, result) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const updatedTests = commission.testResults.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: result.status,
          duration: result.duration,
          details: result.details,
          expectedValue: result.expectedValue,
          actualValue: result.actualValue,
        };
      }
      return test;
    });

    await CommissionAPI.update(commissionId, {
      testResults: updatedTests,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating test result:', error);
    throw error;
  }
};

/**
 * Upload photo documentation
 */
export const uploadPhoto = async (commissionId, photoData, userId) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const photoId = `PHO-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newPhoto = {
      id: photoId,
      url: photoData.url,
      caption: photoData.caption || '',
      category: photoData.category || 'other',
      uploadedAt: now,
      uploadedBy: userId,
      coordinates: photoData.coordinates || null,
    };

    const updatedPhotos = [...(commission.photos || []), newPhoto];

    await CommissionAPI.update(commissionId, {
      photos: updatedPhotos,
      updatedAt: now,
    });

    return { success: true, photoId };
  } catch (error) {
    console.error('Error uploading commission photo:', error);
    throw error;
  }
};

/**
 * Submit installer signature
 */
export const submitSignature = async (commissionId, signatureData) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const signature = {
      name: signatureData.name,
      timestamp: new Date().toISOString(),
      dataUrl: signatureData.dataUrl,
      deviceId: commission.deviceId,
    };

    await CommissionAPI.update(commissionId, {
      signature,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting signature:', error);
    throw error;
  }
};

/**
 * Complete the commission workflow
 */
export const completeCommission = async (commissionId) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    const now = new Date().toISOString();

    // Calculate overall result
    const failedTests = commission.testResults.filter(t => t.status === 'failed');
    const allTestsPassed = failedTests.length === 0;
    const allPreDeploymentComplete = commission.preDeploymentChecks.every(c => c.completed);
    const allCommissioningComplete = commission.commissioningChecks.every(c => c.completed);

    const passed = allTestsPassed && allPreDeploymentComplete && allCommissioningComplete;
    const status = passed ? 'passed' : 'failed';

    // Build result summary
    const result = {
      commissionId,
      deviceId: commission.deviceId,
      startedAt: commission.startedAt,
      completedAt: now,
      status,
      tests: commission.testResults,
      overallScore: Math.round(
        (commission.testResults.filter(t => t.status === 'passed').length /
          commission.testResults.length) *
          100
      ),
    };

    // Update commission
    await CommissionAPI.update(commissionId, {
      status,
      completedAt: now,
      result,
      updatedAt: now,
    });

    // Update device
    if (passed) {
      await DeviceAPI.updateLifecycle(commission.deviceId, 'commissioned', {
        commissionedAt: now,
        commissionedBy: commission.installerId,
      });
      await DeviceAPI.editDevice(commission.deviceId, {
        commissionStatus: 'passed',
        lastCommissionResult: result,
      });
    } else {
      await DeviceAPI.editDevice(commission.deviceId, {
        commissionStatus: 'failed',
        lastCommissionResult: result,
      });
    }

    // Sync to HubSpot
    try {
      const device = await DeviceAPI.getDeviceDetails(commission.deviceId);
      const order = await OrderAPI.get(commission.orderId);
      if (device && order?.hubspotDealId) {
        await HubSpotAPI.sync.syncDevice(device, order.hubspotDealId);
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return { success: true, passed, result };
  } catch (error) {
    console.error('Error completing commission:', error);
    throw error;
  }
};

/**
 * Activate device after successful commission
 */
export const activateDevice = async (deviceId, customerId) => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.commissionStatus !== 'passed') {
      throw new Error('Device must pass commissioning before activation');
    }

    const now = new Date().toISOString();

    await DeviceAPI.updateLifecycle(deviceId, 'active', {
      activatedAt: now,
    });

    await DeviceAPI.editDevice(deviceId, {
      customerId,
      status: 'online',
    });

    // Sync to HubSpot
    try {
      const updatedDevice = await DeviceAPI.getDeviceDetails(deviceId);
      if (updatedDevice.orderId) {
        const order = await OrderAPI.get(updatedDevice.orderId);
        if (order?.hubspotDealId) {
          await HubSpotAPI.sync.syncDevice(updatedDevice, order.hubspotDealId);
        }
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error activating device:', error);
    throw error;
  }
};

/**
 * Get commission with full context
 */
export const getCommissionWithContext = async (commissionId) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) return null;

    const [device, order, site] = await Promise.all([
      DeviceAPI.getDeviceDetails(commission.deviceId),
      OrderAPI.get(commission.orderId),
      SiteAPI.get(commission.siteId),
    ]);

    return {
      ...commission,
      device,
      order,
      site,
      requiredTools: REQUIRED_TOOLS[commission.checklistType] || [],
      deploymentSteps: DEPLOYMENT_STEPS[commission.checklistType] || [],
      testPoints: TEST_POINTS,
    };
  } catch (error) {
    console.error('Error fetching commission with context:', error);
    throw error;
  }
};

/**
 * Get installer's pending commissions
 */
export const getInstallerJobs = async (installerId) => {
  try {
    const commissions = await CommissionAPI.getByInstaller(installerId);

    // Enrich with device and site info
    const enrichedCommissions = await Promise.all(
      (commissions || []).map(async (commission) => {
        const [device, site] = await Promise.all([
          DeviceAPI.getDeviceDetails(commission.deviceId),
          SiteAPI.get(commission.siteId),
        ]);
        return { ...commission, device, site };
      })
    );

    return enrichedCommissions;
  } catch (error) {
    console.error('Error fetching installer jobs:', error);
    throw error;
  }
};

/**
 * Cancel a commission
 */
export const cancelCommission = async (commissionId, reason) => {
  try {
    const commission = await CommissionAPI.get(commissionId);
    if (!commission) throw new Error('Commission not found');

    await CommissionAPI.cancel(commissionId, reason);

    // Reset device status
    await DeviceAPI.editDevice(commission.deviceId, {
      commissionStatus: 'pending',
      assignedInstallerId: null,
      lastCommissionId: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling commission:', error);
    throw error;
  }
};

// Export service
const commissionService = {
  initializeCommission,
  startCommission,
  updatePreDeploymentCheck,
  updateCommissioningCheck,
  runTests,
  updateTestResult,
  uploadPhoto,
  submitSignature,
  completeCommission,
  activateDevice,
  getCommissionWithContext,
  getInstallerJobs,
  cancelCommission,
  // Utilities
  getTestsForDeviceType,
  getChecklistType,
  COMMISSION_TESTS,
};

export default commissionService;
