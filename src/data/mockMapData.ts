/**
 * Mock data for Map page
 * Represents projects with geographic locations
 */

export interface BoundaryGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface MapProject {
  id: string;
  name: string;
  lat: number;
  lng: number;
  creditTypes: ('nitrogen' | 'phosphorus' | 'stormwater' | 'thermal')[];
  totalCredits: number;
  status: 'active' | 'pending' | 'completed';
  description: string;
  owner: string;
  acreage?: number;
  boundary?: BoundaryGeometry;
}

/**
 * Generate an approximate boundary polygon from center point and acreage
 */
function generateBoundary(lat: number, lng: number, acreage: number): BoundaryGeometry {
  const sqMeters = acreage * 4047;
  const sideLength = Math.sqrt(sqMeters);
  const latDelta = (sideLength / 111000) / 2;
  const lngDelta = (sideLength / 85000) / 2;

  return {
    type: 'Polygon',
    coordinates: [[
      [lng - lngDelta * 1.1, lat - latDelta * 0.9],
      [lng + lngDelta * 0.95, lat - latDelta * 1.05],
      [lng + lngDelta * 1.05, lat + latDelta * 0.95],
      [lng - lngDelta * 0.9, lat + latDelta * 1.1],
      [lng - lngDelta * 1.1, lat - latDelta * 0.9],
    ]]
  };
}

export const mockMapProjects: MapProject[] = [
  {
    id: 'PROJ-2024-089',
    name: 'Smith Farm Cover Crop Initiative',
    lat: 40.0379,
    lng: -76.3055,
    creditTypes: ['nitrogen'],
    totalCredits: 2500,
    status: 'active',
    description: 'Cover crop implementation reducing nitrogen runoff',
    owner: 'Smith Agricultural Holdings',
    acreage: 320,
    boundary: generateBoundary(40.0379, -76.3055, 320),
  },
  {
    id: 'PROJ-2024-087',
    name: 'Green Valley Wetland Restoration',
    lat: 39.2904,
    lng: -76.6122,
    creditTypes: ['phosphorus', 'nitrogen'],
    totalCredits: 3400,
    status: 'completed',
    description: 'Wetland restoration for nutrient sequestration',
    owner: 'Green Valley Conservation Trust',
    acreage: 85,
    boundary: generateBoundary(39.2904, -76.6122, 85),
  },
  {
    id: 'PROJ-2024-085',
    name: 'Urban Green Infrastructure Project',
    lat: 39.3004,
    lng: -76.6222,
    creditTypes: ['stormwater'],
    totalCredits: 50000,
    status: 'active',
    description: 'Rain gardens and bioswales for stormwater management',
    owner: 'Baltimore Green Infrastructure Initiative',
    acreage: 15,
    boundary: generateBoundary(39.3004, -76.6222, 15),
  },
  {
    id: 'PROJ-2024-083',
    name: 'Johnson Dairy Nutrient Management',
    lat: 39.9626,
    lng: -76.7277,
    creditTypes: ['nitrogen', 'phosphorus'],
    totalCredits: 4000,
    status: 'active',
    description: 'Precision nutrient management on dairy operation',
    owner: 'Johnson Family Dairy',
    acreage: 450,
    boundary: generateBoundary(39.9626, -76.7277, 450),
  },
  {
    id: 'PROJ-2024-081',
    name: 'Riverside Riparian Buffer Enhancement',
    lat: 40.2737,
    lng: -76.8844,
    creditTypes: ['thermal', 'nitrogen'],
    totalCredits: 17500,
    status: 'completed',
    description: 'Riparian buffer providing shade and filtering nutrients',
    owner: 'Susquehanna Riverkeeper',
    acreage: 120,
    boundary: generateBoundary(40.2737, -76.8844, 120),
  },
  {
    id: 'PROJ-2024-079',
    name: 'Miller Farm Conservation Tillage',
    lat: 40.0479,
    lng: -76.3155,
    creditTypes: ['phosphorus'],
    totalCredits: 890,
    status: 'active',
    description: 'No-till farming reducing soil erosion and P loss',
    owner: 'Miller Family Farm LLC',
    acreage: 180,
    boundary: generateBoundary(40.0479, -76.3155, 180),
  },
  {
    id: 'PROJ-2024-076',
    name: 'Precision Agriculture Initiative',
    lat: 39.8709,
    lng: -77.2311,
    creditTypes: ['nitrogen'],
    totalCredits: 4100,
    status: 'completed',
    description: 'Variable rate fertilizer application using precision ag',
    owner: 'Adams County Farm Cooperative',
    acreage: 520,
    boundary: generateBoundary(39.8709, -77.2311, 520),
  },
  {
    id: 'PROJ-2024-074',
    name: 'Commercial Rain Garden Network',
    lat: 39.0458,
    lng: -76.6413,
    creditTypes: ['stormwater'],
    totalCredits: 75000,
    status: 'active',
    description: 'Network of rain gardens across commercial properties',
    owner: 'Anne Arundel Green Business Alliance',
    acreage: 8,
    boundary: generateBoundary(39.0458, -76.6413, 8),
  },
  {
    id: 'PROJ-2024-072',
    name: 'Creek Restoration & Bank Stabilization',
    lat: 39.5593,
    lng: -76.3483,
    creditTypes: ['phosphorus', 'nitrogen'],
    totalCredits: 2100,
    status: 'active',
    description: 'Stream bank restoration reducing sediment and nutrients',
    owner: 'Harford County Soil Conservation District',
    acreage: 65,
    boundary: generateBoundary(39.5593, -76.3483, 65),
  },
  {
    id: 'PROJ-2024-068',
    name: 'Integrated Crop-Livestock System',
    lat: 39.9187,
    lng: -77.7211,
    creditTypes: ['nitrogen', 'phosphorus'],
    totalCredits: 3500,
    status: 'completed',
    description: 'Integrated grazing system with nutrient recycling',
    owner: 'Franklin County Sustainable Farms',
    acreage: 380,
    boundary: generateBoundary(39.9187, -77.7211, 380),
  },
];

export const getProjectsByType = (type?: string): MapProject[] => {
  if (!type || type === 'all') return mockMapProjects;
  return mockMapProjects.filter(project => project.creditTypes.includes(type as any));
};

export const getProjectsByStatus = (status: 'active' | 'pending' | 'completed'): MapProject[] => {
  return mockMapProjects.filter(project => project.status === status);
};

export const getCreditTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    nitrogen: '#3b82f6',
    phosphorus: '#10b981',
    stormwater: '#06b6d4',
    thermal: '#f59e0b',
  };
  return colors[type] || '#6b7280';
};
