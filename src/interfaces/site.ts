// Site entity for the commercial pipeline
// Represents physical deployment locations for BlueSignal devices

export interface Site {
  id: string;
  customerId: string;
  name: string;
  address: string;
  coordinates: SiteCoordinates;
  type: SiteType;
  waterBodyType?: WaterBodyType;
  waterBodyName?: string;
  accessNotes?: string;
  deviceIds: string[];
  contactName?: string;
  contactPhone?: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface SiteCoordinates {
  lat: number;
  lng: number;
}

export type SiteType =
  | 'residential'
  | 'commercial'
  | 'municipal'
  | 'agricultural'
  | 'educational'
  | 'research';

export type WaterBodyType =
  | 'pond'
  | 'lake'
  | 'reservoir'
  | 'stream'
  | 'river'
  | 'marina'
  | 'aquaculture'
  | 'wastewater'
  | 'other';

export interface SiteCreatePayload {
  customerId: string;
  name: string;
  address: string;
  coordinates: SiteCoordinates;
  type: SiteType;
  waterBodyType?: WaterBodyType;
  waterBodyName?: string;
  accessNotes?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface SiteUpdatePayload {
  name?: string;
  address?: string;
  coordinates?: SiteCoordinates;
  type?: SiteType;
  waterBodyType?: WaterBodyType;
  waterBodyName?: string;
  accessNotes?: string;
  contactName?: string;
  contactPhone?: string;
  deviceIds?: string[];
}

export interface SiteListFilters {
  customerId?: string;
  type?: SiteType;
  search?: string;
  limit?: number;
  offset?: number;
}
