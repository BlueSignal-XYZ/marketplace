/**
 * Virginia Project Service
 *
 * Manages credit-generating projects for the Virginia nutrient credit program.
 * Projects are sites that generate nutrient reductions and can produce credits.
 */

import { SiteAPI, DeviceAPI } from '../../scripts/back_door';
import {
  VIRGINIA_BASINS,
  getBasinByCode,
  getBasinByCoordinates,
  generateComplianceYear,
} from '../../data/virginiaBasins';

/**
 * Generate a unique project ID
 */
const generateProjectId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `VA-PROJ-${timestamp}-${random}`.toUpperCase();
};

/**
 * Create a new Virginia project
 *
 * @param {Object} projectData - Project data
 * @param {string} organizationId - Organization/user creating the project
 * @returns {Object} - Created project
 */
export const createProject = async (projectData, organizationId) => {
  const now = new Date().toISOString();

  // Validate basin
  const basin = getBasinByCode(projectData.basinCode);
  if (!basin) {
    throw new Error(`Invalid basin code: ${projectData.basinCode}`);
  }

  // Auto-detect basin from coordinates if not provided
  let basinCode = projectData.basinCode;
  if (!basinCode && projectData.latitude && projectData.longitude) {
    const detectedBasin = getBasinByCoordinates(
      projectData.latitude,
      projectData.longitude
    );
    if (detectedBasin) {
      basinCode = detectedBasin.code;
    } else {
      throw new Error('Could not determine basin from coordinates');
    }
  }

  // Validate source and practice types
  const validSourceTypes = ['point_source', 'nonpoint_source'];
  if (!validSourceTypes.includes(projectData.sourceType)) {
    throw new Error(`Invalid source type: ${projectData.sourceType}`);
  }

  const validPracticeTypes = [
    'wastewater_treatment',
    'agricultural_bmp',
    'land_conversion',
    'stream_restoration',
    'cover_crop',
    'nutrient_management',
    'oyster_aquaculture',
    'urban_bmp',
    'septic_upgrade',
    'forest_buffer',
  ];
  if (!validPracticeTypes.includes(projectData.practiceType)) {
    throw new Error(`Invalid practice type: ${projectData.practiceType}`);
  }

  const project = {
    id: generateProjectId(),
    organizationId,
    basinCode,
    name: projectData.name,
    description: projectData.description || '',
    sourceType: projectData.sourceType,
    practiceType: projectData.practiceType,
    // Baseline loads
    baselineNitrogenLoad: Number(projectData.baselineNitrogenLoad) || 0,
    baselinePhosphorusLoad: Number(projectData.baselinePhosphorusLoad) || 0,
    baselineEstablishedAt: projectData.baselineEstablishedAt || now,
    // Location
    acreage: Number(projectData.acreage) || 0,
    latitude: Number(projectData.latitude) || 0,
    longitude: Number(projectData.longitude) || 0,
    address: projectData.address || '',
    county: projectData.county || '',
    // Verification
    verificationTier: projectData.verificationTier || 'self_reported',
    status: 'draft',
    // Linked entities
    deviceIds: [],
    siteId: projectData.siteId || null,
    // Metadata
    createdAt: now,
    updatedAt: now,
    createdBy: organizationId,
  };

  // If linked to existing site, copy device IDs
  if (projectData.siteId) {
    try {
      const site = await SiteAPI.get(projectData.siteId);
      if (site?.deviceIds) {
        project.deviceIds = site.deviceIds;
      }
      // Copy location data from site if not provided
      if (!projectData.latitude && site?.coordinates) {
        project.latitude = site.coordinates.lat;
        project.longitude = site.coordinates.lng;
      }
      if (!projectData.address && site?.address) {
        project.address = site.address;
      }
    } catch (error) {
      console.warn('Could not fetch linked site:', error);
    }
  }

  return project;
};

/**
 * Convert an existing site to a Virginia project
 */
export const createProjectFromSite = async (siteId, projectDetails, organizationId) => {
  const site = await SiteAPI.get(siteId);
  if (!site) {
    throw new Error('Site not found');
  }

  // Detect basin from site coordinates
  let basinCode = projectDetails.basinCode;
  if (!basinCode && site.coordinates) {
    const basin = getBasinByCoordinates(site.coordinates.lat, site.coordinates.lng);
    if (basin) {
      basinCode = basin.code;
    }
  }

  if (!basinCode) {
    throw new Error('Could not determine basin for site');
  }

  // Get devices at site
  const devices = await DeviceAPI.getBySite(siteId);

  return createProject({
    ...projectDetails,
    siteId,
    basinCode,
    name: projectDetails.name || site.name,
    latitude: site.coordinates?.lat,
    longitude: site.coordinates?.lng,
    address: site.address,
    deviceIds: devices?.map(d => d.id) || [],
  }, organizationId);
};

/**
 * Link a device to a project
 */
export const linkDeviceToProject = async (project, deviceId, role = 'primary') => {
  // Verify device exists
  const device = await DeviceAPI.getDeviceDetails(deviceId);
  if (!device) {
    throw new Error('Device not found');
  }

  // Check if already linked
  if (project.deviceIds.includes(deviceId)) {
    return project;
  }

  // Add device to project
  const updatedProject = {
    ...project,
    deviceIds: [...project.deviceIds, deviceId],
    updatedAt: new Date().toISOString(),
  };

  // If this brings sensor data, upgrade verification tier
  if (project.verificationTier === 'self_reported') {
    updatedProject.verificationTier = 'sensor_backed';
  }

  return updatedProject;
};

/**
 * Unlink a device from a project
 */
export const unlinkDeviceFromProject = (project, deviceId) => {
  const updatedProject = {
    ...project,
    deviceIds: project.deviceIds.filter(id => id !== deviceId),
    updatedAt: new Date().toISOString(),
  };

  // Downgrade verification tier if no more devices
  if (updatedProject.deviceIds.length === 0 && project.verificationTier === 'sensor_backed') {
    updatedProject.verificationTier = 'self_reported';
  }

  return updatedProject;
};

/**
 * Update project status
 */
export const updateProjectStatus = (project, newStatus) => {
  const validStatuses = ['draft', 'pending_approval', 'active', 'suspended', 'retired'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  // Validate transitions
  const validTransitions = {
    draft: ['pending_approval'],
    pending_approval: ['active', 'draft'],
    active: ['suspended', 'retired'],
    suspended: ['active', 'retired'],
    retired: [],
  };

  if (!validTransitions[project.status]?.includes(newStatus)) {
    throw new Error(`Cannot transition from ${project.status} to ${newStatus}`);
  }

  return {
    ...project,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Submit project for approval
 */
export const submitForApproval = (project) => {
  // Validate project is ready for submission
  const errors = validateProjectForSubmission(project);
  if (errors.length > 0) {
    throw new Error(`Project not ready: ${errors.join(', ')}`);
  }

  return updateProjectStatus(project, 'pending_approval');
};

/**
 * Validate project has required fields for submission
 */
export const validateProjectForSubmission = (project) => {
  const errors = [];

  if (!project.name) errors.push('Name is required');
  if (!project.basinCode) errors.push('Basin is required');
  if (!project.sourceType) errors.push('Source type is required');
  if (!project.practiceType) errors.push('Practice type is required');
  if (!project.baselineNitrogenLoad && !project.baselinePhosphorusLoad) {
    errors.push('At least one baseline load is required');
  }
  if (!project.latitude || !project.longitude) {
    errors.push('Location coordinates are required');
  }
  if (!project.acreage || project.acreage <= 0) {
    errors.push('Valid acreage is required');
  }

  return errors;
};

/**
 * Get project summary with calculated metrics
 */
export const getProjectSummary = async (project) => {
  const basin = getBasinByCode(project.basinCode);
  const currentYear = new Date().getFullYear();
  const complianceYear = generateComplianceYear(currentYear);

  // Get device count and status
  let onlineDevices = 0;
  let totalDevices = project.deviceIds?.length || 0;

  if (totalDevices > 0) {
    try {
      for (const deviceId of project.deviceIds) {
        const device = await DeviceAPI.getDeviceDetails(deviceId);
        if (device?.installation?.status === 'active') {
          onlineDevices++;
        }
      }
    } catch (error) {
      console.warn('Could not fetch device details:', error);
    }
  }

  return {
    project,
    basin: basin ? {
      code: basin.code,
      name: basin.name,
      nitrogenDeliveryFactor: basin.nitrogenDeliveryFactor,
      phosphorusDeliveryFactor: basin.phosphorusDeliveryFactor,
    } : null,
    devices: {
      total: totalDevices,
      online: onlineDevices,
      offline: totalDevices - onlineDevices,
    },
    complianceYear,
    estimatedCredits: {
      nitrogen: {
        raw: project.baselineNitrogenLoad * 0.3,  // Rough estimate
        delivered: project.baselineNitrogenLoad * 0.3 * (basin?.nitrogenDeliveryFactor || 1),
      },
      phosphorus: {
        raw: project.baselinePhosphorusLoad * 0.3,
        delivered: project.baselinePhosphorusLoad * 0.3 * (basin?.phosphorusDeliveryFactor || 1),
      },
    },
  };
};

/**
 * Search projects by criteria
 */
export const searchProjects = (projects, criteria) => {
  let filtered = [...projects];

  if (criteria.basinCode) {
    filtered = filtered.filter(p => p.basinCode === criteria.basinCode);
  }

  if (criteria.status) {
    filtered = filtered.filter(p => p.status === criteria.status);
  }

  if (criteria.sourceType) {
    filtered = filtered.filter(p => p.sourceType === criteria.sourceType);
  }

  if (criteria.practiceType) {
    filtered = filtered.filter(p => p.practiceType === criteria.practiceType);
  }

  if (criteria.organizationId) {
    filtered = filtered.filter(p => p.organizationId === criteria.organizationId);
  }

  if (criteria.search) {
    const searchLower = criteria.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.address?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

/**
 * Get all basins as options for dropdowns
 */
export const getBasinOptions = () => {
  return Object.values(VIRGINIA_BASINS).map(basin => ({
    value: basin.code,
    label: `${basin.name} (${basin.code})`,
    name: basin.name,
    deliveryFactors: {
      nitrogen: basin.nitrogenDeliveryFactor,
      phosphorus: basin.phosphorusDeliveryFactor,
    },
  }));
};

/**
 * Get practice type options for dropdowns
 */
export const getPracticeTypeOptions = () => {
  return [
    { value: 'wastewater_treatment', label: 'Wastewater Treatment', sourceType: 'point_source' },
    { value: 'agricultural_bmp', label: 'Agricultural BMP', sourceType: 'nonpoint_source' },
    { value: 'land_conversion', label: 'Land Conversion', sourceType: 'nonpoint_source' },
    { value: 'stream_restoration', label: 'Stream Restoration', sourceType: 'nonpoint_source' },
    { value: 'cover_crop', label: 'Cover Crop', sourceType: 'nonpoint_source' },
    { value: 'nutrient_management', label: 'Nutrient Management', sourceType: 'nonpoint_source' },
    { value: 'oyster_aquaculture', label: 'Oyster Aquaculture', sourceType: 'nonpoint_source' },
    { value: 'urban_bmp', label: 'Urban BMP', sourceType: 'nonpoint_source' },
    { value: 'septic_upgrade', label: 'Septic System Upgrade', sourceType: 'nonpoint_source' },
    { value: 'forest_buffer', label: 'Forest Buffer', sourceType: 'nonpoint_source' },
  ];
};

/**
 * Get source type options
 */
export const getSourceTypeOptions = () => {
  return [
    {
      value: 'point_source',
      label: 'Point Source',
      description: 'Direct discharge from pipes or outfalls (1:1 trading ratio)',
    },
    {
      value: 'nonpoint_source',
      label: 'Nonpoint Source',
      description: 'Diffuse runoff from land (2:1 trading ratio)',
    },
  ];
};

// Export service
const projectService = {
  createProject,
  createProjectFromSite,
  linkDeviceToProject,
  unlinkDeviceFromProject,
  updateProjectStatus,
  submitForApproval,
  validateProjectForSubmission,
  getProjectSummary,
  searchProjects,
  getBasinOptions,
  getPracticeTypeOptions,
  getSourceTypeOptions,
  generateProjectId,
};

export default projectService;
