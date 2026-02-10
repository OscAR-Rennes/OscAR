export interface AddressEntity {
  id: string;
  zip?: string;
  city?: string;
  latitude: number;
  longitude: number;
  street?: string;
  street_number?: number;
  created_at: Date;
  updated_at: Date;
}