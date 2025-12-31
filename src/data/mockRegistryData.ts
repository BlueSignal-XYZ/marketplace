/**
 * Mock data for Registry page
 * Represents verified credits in the public registry
 *
 * Updated to include Virginia Chesapeake Bay Watershed credits
 */

export interface RegistryCredit {
  id: string;
  type: 'nitrogen' | 'phosphorus' | 'stormwater' | 'thermal';
  quantity: number;
  unit: string;
  projectName: string;
  projectId: string;
  issueDate: string;
  retirementDate?: string;
  status: 'active' | 'retired';
  verificationId: string;
  location: string;
  verifier: string;
  // Virginia-specific fields (optional for backwards compatibility)
  basinCode?: string;
  basinName?: string;
  complianceYear?: number;
  deliveryFactor?: number;
  sourceType?: 'point_source' | 'nonpoint_source';
}

export const mockRegistryCredits: RegistryCredit[] = [
  // Virginia Chesapeake Bay Watershed Credits
  {
    id: 'VA-JAM-2025-N-000001',
    type: 'nitrogen',
    quantity: 4250,
    unit: 'lbs N',
    projectName: 'Shenandoah Valley Agricultural BMP',
    projectId: 'VA-PROJ-2024-001',
    issueDate: '2025-01-20',
    status: 'active',
    verificationId: 'VA-VER-2025-001',
    location: 'Rockingham County, VA',
    verifier: 'Virginia DEQ',
    basinCode: 'JAM',
    basinName: 'James River',
    complianceYear: 2025,
    deliveryFactor: 0.92,
    sourceType: 'nonpoint_source',
  },
  {
    id: 'VA-JAM-2025-P-000001',
    type: 'phosphorus',
    quantity: 890,
    unit: 'lbs P',
    projectName: 'Shenandoah Valley Agricultural BMP',
    projectId: 'VA-PROJ-2024-001',
    issueDate: '2025-01-20',
    status: 'active',
    verificationId: 'VA-VER-2025-002',
    location: 'Rockingham County, VA',
    verifier: 'Virginia DEQ',
    basinCode: 'JAM',
    basinName: 'James River',
    complianceYear: 2025,
    deliveryFactor: 0.92,
    sourceType: 'nonpoint_source',
  },
  {
    id: 'VA-POT-2025-N-000001',
    type: 'nitrogen',
    quantity: 12500,
    unit: 'lbs N',
    projectName: 'Alexandria Wastewater Treatment Upgrade',
    projectId: 'VA-PROJ-2024-002',
    issueDate: '2025-01-18',
    status: 'active',
    verificationId: 'VA-VER-2025-003',
    location: 'Alexandria, VA',
    verifier: 'Virginia DEQ',
    basinCode: 'POT',
    basinName: 'Potomac River',
    complianceYear: 2025,
    deliveryFactor: 0.58,
    sourceType: 'point_source',
  },
  {
    id: 'VA-POT-2025-P-000001',
    type: 'phosphorus',
    quantity: 3200,
    unit: 'lbs P',
    projectName: 'Alexandria Wastewater Treatment Upgrade',
    projectId: 'VA-PROJ-2024-002',
    issueDate: '2025-01-18',
    status: 'active',
    verificationId: 'VA-VER-2025-004',
    location: 'Alexandria, VA',
    verifier: 'Virginia DEQ',
    basinCode: 'POT',
    basinName: 'Potomac River',
    complianceYear: 2025,
    deliveryFactor: 0.70,
    sourceType: 'point_source',
  },
  {
    id: 'VA-YOR-2025-N-000001',
    type: 'nitrogen',
    quantity: 1850,
    unit: 'lbs N',
    projectName: 'Williamsburg Oyster Aquaculture Project',
    projectId: 'VA-PROJ-2024-003',
    issueDate: '2025-01-12',
    status: 'active',
    verificationId: 'VA-VER-2025-005',
    location: 'York County, VA',
    verifier: 'VIMS',
    basinCode: 'YOR',
    basinName: 'York River',
    complianceYear: 2025,
    deliveryFactor: 0.90,
    sourceType: 'nonpoint_source',
  },
  {
    id: 'VA-RAP-2024-N-000012',
    type: 'nitrogen',
    quantity: 2100,
    unit: 'lbs N',
    projectName: 'Rappahannock Forest Buffer Project',
    projectId: 'VA-PROJ-2023-045',
    issueDate: '2024-12-15',
    retirementDate: '2025-01-10',
    status: 'retired',
    verificationId: 'VA-VER-2024-089',
    location: 'Spotsylvania County, VA',
    verifier: 'Virginia DEQ',
    basinCode: 'RAP',
    basinName: 'Rappahannock River',
    complianceYear: 2024,
    deliveryFactor: 0.78,
    sourceType: 'nonpoint_source',
  },
  {
    id: 'VA-ES-2025-N-000001',
    type: 'nitrogen',
    quantity: 750,
    unit: 'lbs N',
    projectName: 'Eastern Shore Cover Crop Program',
    projectId: 'VA-PROJ-2024-004',
    issueDate: '2025-01-08',
    status: 'active',
    verificationId: 'VA-VER-2025-006',
    location: 'Accomack County, VA',
    verifier: 'Virginia DEQ',
    basinCode: 'ES',
    basinName: 'Eastern Shore',
    complianceYear: 2025,
    deliveryFactor: 1.0,
    sourceType: 'nonpoint_source',
  },
  // Legacy non-Virginia credits
  {
    id: 'WQT-2025-00142',
    type: 'nitrogen',
    quantity: 2500,
    unit: 'lbs N',
    projectName: 'Smith Farm Cover Crop Initiative',
    projectId: 'PROJ-2024-089',
    issueDate: '2025-01-15',
    status: 'active',
    verificationId: 'VER-2025-012',
    location: 'Lancaster County, PA',
    verifier: 'EcoVerify Labs',
  },
  {
    id: 'WQT-2025-00141',
    type: 'phosphorus',
    quantity: 1200,
    unit: 'lbs P',
    projectName: 'Green Valley Wetland Restoration',
    projectId: 'PROJ-2024-087',
    issueDate: '2025-01-10',
    retirementDate: '2025-01-28',
    status: 'retired',
    verificationId: 'VER-2025-010',
    location: 'Chesapeake Bay Watershed, MD',
    verifier: 'WaterQuality Institute',
  },
  {
    id: 'WQT-2025-00140',
    type: 'stormwater',
    quantity: 50000,
    unit: 'gallons',
    projectName: 'Urban Green Infrastructure Project',
    projectId: 'PROJ-2024-085',
    issueDate: '2025-01-05',
    status: 'active',
    verificationId: 'VER-2025-008',
    location: 'Baltimore City, MD',
    verifier: 'Environmental Solutions LLC',
  },
  {
    id: 'WQT-2025-00139',
    type: 'nitrogen',
    quantity: 3200,
    unit: 'lbs N',
    projectName: 'Johnson Dairy Nutrient Management',
    projectId: 'PROJ-2024-083',
    issueDate: '2024-12-20',
    status: 'active',
    verificationId: 'VER-2024-156',
    location: 'York County, PA',
    verifier: 'AgriVerify Partners',
  },
  {
    id: 'WQT-2024-00138',
    type: 'thermal',
    quantity: 15000,
    unit: 'therms',
    projectName: 'Riverside Riparian Buffer Enhancement',
    projectId: 'PROJ-2024-081',
    issueDate: '2024-12-15',
    retirementDate: '2025-01-20',
    status: 'retired',
    verificationId: 'VER-2024-152',
    location: 'Susquehanna River Basin, PA',
    verifier: 'Thermal Credit Certifiers',
  },
  {
    id: 'WQT-2024-00137',
    type: 'phosphorus',
    quantity: 890,
    unit: 'lbs P',
    projectName: 'Miller Farm Conservation Tillage',
    projectId: 'PROJ-2024-079',
    issueDate: '2024-12-10',
    status: 'active',
    verificationId: 'VER-2024-148',
    location: 'Lancaster County, PA',
    verifier: 'EcoVerify Labs',
  },
  {
    id: 'WQT-2024-00136',
    type: 'nitrogen',
    quantity: 4100,
    unit: 'lbs N',
    projectName: 'Precision Agriculture Initiative',
    projectId: 'PROJ-2024-076',
    issueDate: '2024-12-01',
    retirementDate: '2024-12-28',
    status: 'retired',
    verificationId: 'VER-2024-144',
    location: 'Adams County, PA',
    verifier: 'AgriVerify Partners',
  },
  {
    id: 'WQT-2024-00135',
    type: 'stormwater',
    quantity: 75000,
    unit: 'gallons',
    projectName: 'Commercial Rain Garden Network',
    projectId: 'PROJ-2024-074',
    issueDate: '2024-11-25',
    status: 'active',
    verificationId: 'VER-2024-140',
    location: 'Anne Arundel County, MD',
    verifier: 'Stormwater Solutions Inc',
  },
  {
    id: 'WQT-2024-00134',
    type: 'phosphorus',
    quantity: 1580,
    unit: 'lbs P',
    projectName: 'Creek Restoration & Bank Stabilization',
    projectId: 'PROJ-2024-072',
    issueDate: '2024-11-20',
    status: 'active',
    verificationId: 'VER-2024-136',
    location: 'Harford County, MD',
    verifier: 'WaterQuality Institute',
  },
  {
    id: 'WQT-2024-00133',
    type: 'nitrogen',
    quantity: 2800,
    unit: 'lbs N',
    projectName: 'Integrated Crop-Livestock System',
    projectId: 'PROJ-2024-068',
    issueDate: '2024-11-15',
    retirementDate: '2024-12-05',
    status: 'retired',
    verificationId: 'VER-2024-132',
    location: 'Franklin County, PA',
    verifier: 'AgriVerify Partners',
  },
];

export const getCreditsByType = (type?: string): RegistryCredit[] => {
  if (!type || type === 'all') return mockRegistryCredits;
  return mockRegistryCredits.filter(credit => credit.type === type);
};

export const getCreditsByStatus = (status: 'active' | 'retired'): RegistryCredit[] => {
  return mockRegistryCredits.filter(credit => credit.status === status);
};

export const searchCredits = (query: string): RegistryCredit[] => {
  const lowerQuery = query.toLowerCase();
  return mockRegistryCredits.filter(
    credit =>
      credit.id.toLowerCase().includes(lowerQuery) ||
      credit.projectName.toLowerCase().includes(lowerQuery) ||
      credit.location.toLowerCase().includes(lowerQuery)
  );
};

// Virginia-specific filters

export const getCreditsByBasin = (basinCode?: string): RegistryCredit[] => {
  if (!basinCode || basinCode === 'all') return mockRegistryCredits;
  return mockRegistryCredits.filter(credit => credit.basinCode === basinCode);
};

export const getVirginiaCredits = (): RegistryCredit[] => {
  return mockRegistryCredits.filter(credit => credit.basinCode !== undefined);
};

export const getCreditsByComplianceYear = (year?: number): RegistryCredit[] => {
  if (!year) return mockRegistryCredits;
  return mockRegistryCredits.filter(credit => credit.complianceYear === year);
};

export const getCreditsBySourceType = (sourceType?: 'point_source' | 'nonpoint_source'): RegistryCredit[] => {
  if (!sourceType) return mockRegistryCredits;
  return mockRegistryCredits.filter(credit => credit.sourceType === sourceType);
};

// Get unique basins from credits
export const getAvailableBasins = (): { code: string; name: string }[] => {
  const basins = new Map<string, string>();
  mockRegistryCredits.forEach(credit => {
    if (credit.basinCode && credit.basinName) {
      basins.set(credit.basinCode, credit.basinName);
    }
  });
  return Array.from(basins).map(([code, name]) => ({ code, name }));
};

// Get unique compliance years
export const getAvailableComplianceYears = (): number[] => {
  const years = new Set<number>();
  mockRegistryCredits.forEach(credit => {
    if (credit.complianceYear) {
      years.add(credit.complianceYear);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
};

// Combined filter for Virginia credits
export const filterVirginiaCredits = (filters: {
  basinCode?: string;
  complianceYear?: number;
  nutrientType?: string;
  sourceType?: 'point_source' | 'nonpoint_source';
  status?: 'active' | 'retired';
}): RegistryCredit[] => {
  return mockRegistryCredits.filter(credit => {
    if (!credit.basinCode) return false; // Only Virginia credits

    if (filters.basinCode && filters.basinCode !== 'all' && credit.basinCode !== filters.basinCode) {
      return false;
    }
    if (filters.complianceYear && credit.complianceYear !== filters.complianceYear) {
      return false;
    }
    if (filters.nutrientType && filters.nutrientType !== 'all' && credit.type !== filters.nutrientType) {
      return false;
    }
    if (filters.sourceType && credit.sourceType !== filters.sourceType) {
      return false;
    }
    if (filters.status && credit.status !== filters.status) {
      return false;
    }
    return true;
  });
};
