import { CreateAddressRequestDTO } from "../address/CreateAddressRequestDTO";

export interface CreateCulturalCenterRequestDTO {
    name: string;
    description: string;
    address_id?: string;
    picture_path?: string | null;
    address: CreateAddressRequestDTO;
}