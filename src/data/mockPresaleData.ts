// Mock data for pre-sale water credit offerings

export interface PresaleProject {
  id: string;
  name: string;
  producer: string;
  verifier: string;
  creditType: 'nitrogen' | 'phosphorus' | 'stormwater' | 'thermal' | 'mixed';
  location: string;
  lat: number;
  lng: number;
  totalLandArea: number; // acres
  estimatedCredits: number;
  availableSupply: number;
  pricePerCredit: number;
  startDate: string;
  endDate: string;
  status: 'coming-soon' | 'active' | 'closed';
  description: string;
  features: string[];
  minimumPurchase: number;
}

export const mockPresaleProjects: PresaleProject[] = [
  {
    id: 'presale-001',
    name: 'Chesapeake Bay Watershed Initiative',
    producer: 'Bay Restoration Partners',
    verifier: 'NPC Network',
    creditType: 'nitrogen',
    location: 'Maryland, USA',
    lat: 38.9784,
    lng: -76.4922,
    totalLandArea: 3600,
    estimatedCredits: 15000,
    availableSupply: 10000,
    pricePerCredit: 45,
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    status: 'active',
    description: 'Large-scale nitrogen reduction project in the Chesapeake Bay watershed. Cover crops and buffer strips implementation.',
    features: ['Third-party verified', 'Real-time monitoring', 'Annual audit'],
    minimumPurchase: 100,
  },
  {
    id: 'presale-002',
    name: 'Minnesota River Basin Project',
    producer: 'Prairie Stewards LLC',
    verifier: 'WaterVerify Inc',
    creditType: 'phosphorus',
    location: 'Minnesota, USA',
    lat: 44.3148,
    lng: -94.2658,
    totalLandArea: 2400,
    estimatedCredits: 8000,
    availableSupply: 5500,
    pricePerCredit: 52,
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    status: 'coming-soon',
    description: 'Phosphorus reduction through precision agriculture and wetland restoration in the Minnesota River Basin.',
    features: ['Satellite imagery', 'Quarterly reports', 'Carbon co-benefits'],
    minimumPurchase: 50,
  },
  {
    id: 'presale-003',
    name: 'Gulf Coast Stormwater Management',
    producer: 'Coastal Conservation Group',
    verifier: 'EcoAudit Services',
    creditType: 'stormwater',
    location: 'Louisiana, USA',
    lat: 29.9511,
    lng: -90.0715,
    totalLandArea: 1800,
    estimatedCredits: 12000,
    availableSupply: 12000,
    pricePerCredit: 38,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    status: 'closed',
    description: 'Urban stormwater management through green infrastructure and retention systems.',
    features: ['IoT sensors', 'Real-time data', 'City partnership'],
    minimumPurchase: 200,
  },
  {
    id: 'presale-004',
    name: 'Pacific Northwest Thermal Credits',
    producer: 'Salmon Stream Guardians',
    verifier: 'NPC Network',
    creditType: 'thermal',
    location: 'Oregon, USA',
    lat: 44.0582,
    lng: -121.3153,
    totalLandArea: 950,
    estimatedCredits: 5000,
    availableSupply: 4200,
    pricePerCredit: 65,
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    status: 'coming-soon',
    description: 'Stream temperature reduction through riparian restoration and shade enhancement for salmon habitat.',
    features: ['Temperature monitoring', 'Salmon tracking', 'EPA approved'],
    minimumPurchase: 25,
  },
  {
    id: 'presale-005',
    name: 'Great Lakes Mixed Nutrient Program',
    producer: 'Midwest Agricultural Collective',
    verifier: 'WaterVerify Inc',
    creditType: 'mixed',
    location: 'Michigan, USA',
    lat: 43.3266,
    lng: -84.5555,
    totalLandArea: 5200,
    estimatedCredits: 22000,
    availableSupply: 18000,
    pricePerCredit: 48,
    startDate: '2025-01-01',
    endDate: '2025-05-31',
    status: 'active',
    description: 'Comprehensive nutrient management covering nitrogen and phosphorus reduction in the Lake Michigan watershed.',
    features: ['Dual nutrient tracking', 'Farmer network', 'Government subsidy eligible'],
    minimumPurchase: 100,
  },
  {
    id: 'presale-006',
    name: 'Delaware River Conservation',
    producer: 'Keystone Water Trust',
    verifier: 'EcoAudit Services',
    creditType: 'nitrogen',
    location: 'Pennsylvania, USA',
    lat: 40.2732,
    lng: -75.1298,
    totalLandArea: 1600,
    estimatedCredits: 7500,
    availableSupply: 7500,
    pricePerCredit: 55,
    startDate: '2025-04-01',
    endDate: '2025-07-31',
    status: 'coming-soon',
    description: 'Nitrogen reduction in the Delaware River watershed serving Philadelphia metro water supply.',
    features: ['Urban water protection', 'Community engagement', 'Transparency reports'],
    minimumPurchase: 50,
  },
];

// Helper functions
export const getPresalesByStatus = (status: PresaleProject['status']): PresaleProject[] => {
  return mockPresaleProjects.filter(p => p.status === status);
};

export const getPresalesByCreditType = (type: PresaleProject['creditType'] | 'all'): PresaleProject[] => {
  if (type === 'all') return mockPresaleProjects;
  return mockPresaleProjects.filter(p => p.creditType === type);
};

export const getCreditTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    nitrogen: '#3b82f6',
    phosphorus: '#10b981',
    stormwater: '#06b6d4',
    thermal: '#f97316',
    mixed: '#8b5cf6',
  };
  return colors[type] || '#6b7280';
};

export const getStatusColor = (status: PresaleProject['status']): string => {
  const colors: Record<string, string> = {
    'coming-soon': '#f59e0b',
    'active': '#10b981',
    'closed': '#6b7280',
  };
  return colors[status] || '#6b7280';
};

export const formatStatus = (status: PresaleProject['status']): string => {
  const labels: Record<string, string> = {
    'coming-soon': 'Coming Soon',
    'active': 'Active',
    'closed': 'Closed',
  };
  return labels[status] || status;
};
