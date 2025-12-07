// Customer entity for the commercial pipeline
// Represents organizations or individuals purchasing BlueSignal devices

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: CustomerAddress;
  hubspotContactId?: string;
  type: CustomerType;
  notes?: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export type CustomerType =
  | 'residential'
  | 'commercial'
  | 'municipal'
  | 'agricultural'
  | 'educational'
  | 'research';

export interface CustomerAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface CustomerCreatePayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: CustomerAddress;
  type: CustomerType;
  notes?: string;
}

export interface CustomerUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: CustomerAddress;
  type?: CustomerType;
  notes?: string;
  hubspotContactId?: string;
}

export interface CustomerListFilters {
  type?: CustomerType;
  search?: string;
  limit?: number;
  offset?: number;
}
