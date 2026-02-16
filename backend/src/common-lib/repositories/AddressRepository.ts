import { PrismaClient } from "@prisma/client";
import { AddressEntity } from "../entity/AdrdressEntity";
import { CreateAddressRequestDTO } from "../dto/address/CreateAddressRequestDTO.js";
import { prisma } from "../config/prismaClient";

export class AddressRepository {

  async create(
    data: CreateAddressRequestDTO,
    prismaClient?: PrismaClient
  ): Promise<AddressEntity> {
    const client = prismaClient || prisma;
    const addressRecord = await client.address.create({
      data,
    });
    return new AddressEntity(addressRecord);
  }
}
