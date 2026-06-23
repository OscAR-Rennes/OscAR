export class AddressEntity {
  id!: string;
  zip?: string | null;
  city?: string | null;
  latitude!: number;
  longitude!: number;
  street?: string | null;
  street_number?: string | null;

  constructor(data: Partial<AddressEntity>) {
    Object.assign(this, data);
  }
}
