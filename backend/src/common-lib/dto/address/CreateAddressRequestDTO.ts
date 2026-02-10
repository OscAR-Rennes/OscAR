export interface CreateAddressRequestDTO {
  zip?: string;
  city?: string;
  latitude: number;
  longitude: number;
  street?: string;
  street_number?: number;
}