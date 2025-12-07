// Commission entity for the commercial pipeline
// Represents the commissioning workflow for BlueSignal devices

import { CommissionResult, CommissionTest, CommissionTestId, CommissionTestStatus } from './device';

export interface Commission {
  id: string;
  deviceId: string;
  orderId: string;
  siteId: string;
  installerId: string; // User UID of installer
  status: CommissionWorkflowStatus;

  // Timestamps
  startedAt?: string; // ISO8601
  completedAt?: string; // ISO8601
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601

  // Checklist type determines which checklists apply
  checklistType: CommissionChecklistType;

  // Pre-deployment checklist items
  preDeploymentChecks: CommissionChecklistItem[];

  // Commissioning checklist items
  commissioningChecks: CommissionChecklistItem[];

  // Automated test results
  testResults: CommissionTest[];

  // Documentation
  photos: CommissionPhoto[];
  notes?: string;

  // Installer signature
  signature?: CommissionSignature;

  // Final result
  result?: CommissionResult;
}

export type CommissionWorkflowStatus =
  | 'pending'     // Created but not started
  | 'in_progress' // Installer actively working
  | 'awaiting_tests' // Checklists done, tests pending
  | 'passed'      // All checks and tests passed
  | 'failed'      // One or more failures
  | 'cancelled';  // Workflow cancelled

export type CommissionChecklistType = 'shore' | 'buoy';

export interface CommissionChecklistItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  completedAt?: string; // ISO8601
  completedBy?: string; // User UID
  notes?: string;
}

export interface CommissionPhoto {
  id: string;
  url: string;
  caption?: string;
  category: PhotoCategory;
  uploadedAt: string; // ISO8601
  uploadedBy: string; // User UID
  coordinates?: { lat: number; lng: number };
}

export type PhotoCategory =
  | 'site_overview'
  | 'enclosure'
  | 'sensors'
  | 'mounting'
  | 'wiring'
  | 'gps_screenshot'
  | 'water_access'
  | 'mooring'
  | 'issue'
  | 'other';

export interface CommissionSignature {
  name: string;
  timestamp: string; // ISO8601
  dataUrl: string; // base64 encoded signature image
  deviceId: string;
}

// API payload types
export interface CommissionCreatePayload {
  deviceId: string;
  orderId: string;
  siteId: string;
  installerId: string;
  checklistType: CommissionChecklistType;
}

export interface CommissionUpdatePayload {
  status?: CommissionWorkflowStatus;
  preDeploymentChecks?: CommissionChecklistItem[];
  commissioningChecks?: CommissionChecklistItem[];
  testResults?: CommissionTest[];
  notes?: string;
}

export interface CommissionChecklistSubmitPayload {
  commissionId: string;
  checklistType: 'preDeployment' | 'commissioning';
  items: CommissionChecklistItem[];
}

export interface CommissionTestRunPayload {
  commissionId: string;
  deviceId: string;
  tests?: CommissionTestId[]; // Specific tests to run, or all if empty
}

export interface CommissionPhotoUploadPayload {
  commissionId: string;
  category: PhotoCategory;
  caption?: string;
  coordinates?: { lat: number; lng: number };
  // File handled separately in form data
}

export interface CommissionSignaturePayload {
  commissionId: string;
  name: string;
  dataUrl: string;
}

export interface CommissionCompletePayload {
  commissionId: string;
  result: CommissionResult;
  signature: CommissionSignature;
}

export interface CommissionListFilters {
  deviceId?: string;
  orderId?: string;
  siteId?: string;
  installerId?: string;
  status?: CommissionWorkflowStatus | CommissionWorkflowStatus[];
  checklistType?: CommissionChecklistType;
  dateFrom?: string; // ISO8601
  dateTo?: string; // ISO8601
  limit?: number;
  offset?: number;
}

// Pre-populated checklist templates based on installation.js
export interface CommissionChecklistTemplate {
  type: CommissionChecklistType;
  preDeployment: CommissionChecklistItem[];
  commissioning: CommissionChecklistItem[];
  requiredTools: RequiredTool[];
  deploymentSteps: DeploymentStep[];
}

export interface RequiredTool {
  name: string;
  purpose: string;
  essential: boolean;
}

export interface DeploymentStep {
  step: number;
  title: string;
  description: string;
}

// Test point reference for voltage verification
export interface TestPoint {
  id: string;
  location: string;
  expected: string | { [key: string]: string };
  notes: string;
}
