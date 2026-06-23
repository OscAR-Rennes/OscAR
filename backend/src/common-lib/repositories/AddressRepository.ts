import { PrismaClient } from "@prisma/client";
import { CreateAddressRequestDTO } from "../dto/address/CreateAddressRequestDTO.js";
import { prisma } from "../config/prismaClient.js";
import { address } from "@prisma/client";

export class AddressRepository {

  async create(
    data: CreateAddressRequestDTO,
    prismaClient?: PrismaClient
  ): Promise<address> {
    const client = prismaClient || prisma;
    const addressRecord = await client.address.create({
      data,
    });
    return addressRecord;
  }
}
