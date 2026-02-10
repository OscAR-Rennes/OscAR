import { PoolClient } from "pg";
import { CreateAddressRequestDTO } from "../dto/address/CreateAddressRequestDTO.js";
import { AddressEntity } from "../entity/AdrdressEntity.js";

export class AddressRepository {
    async createWithClient(client: PoolClient, userData: CreateAddressRequestDTO): Promise<AddressEntity> {
        const result = await client.query(
            "INSERT INTO address (zip, city, latitude, longitude, street, street_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userData.zip, userData.city, userData.latitude, userData.longitude, userData.street, userData.street_number]
        );
    return result.rows[0];
  }
}