import { Prisma, hunts } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateHuntRequestDTO } from "../dto/hunt/CreateHuntRequestDTO.js";
import { EditHuntRequestDTO } from "../dto/hunt/EditHuntRequestDTO.js";

export class HuntRepository {

  private getDb(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  async create(huntData: CreateHuntRequestDTO, tx?: Prisma.TransactionClient): Promise<hunts> {
    const huntRecord = await this.getDb(tx).hunts.create({
      data: { ...huntData },
    });
    return huntRecord;
  }

  async getAll(): Promise<hunts[]> {
    const hunts = await this.getDb().hunts.findMany();
    return hunts;
  }

  async getByID(id: string, tx?: Prisma.TransactionClient) {
    return this.getDb(tx).hunts.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            id_cultural_center: true,
          },
        },
        cultural_centers: {
          select : {
            id: true,
            name: true
          }
        },
        difficulty: {
          select: {
            id: true,
            name: true,
          },
        },
        steps: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getByIdRaw(id: string, tx?: Prisma.TransactionClient) {
    return this.getDb(tx).hunts.findUnique({
      where: { id },
    });
  }

  async edit(huntData: EditHuntRequestDTO, tx?: Prisma.TransactionClient): Promise<hunts> {
    const huntRecord = await this.getDb(tx).hunts.update({
      where: { id: huntData.id },
      data: { ...huntData },
    });
    return huntRecord;
  }

  async updateIsActive(id: string, isActive: boolean, tx?: Prisma.TransactionClient): Promise<hunts> {
    return this.getDb(tx).hunts.update({
      where: { id },
      data: { isactive: isActive },
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    await this.getDb(tx).hunts.delete({
      where: { id },
    });
  }

  async getByCulturalCenter(culturalcenter_id: string): Promise<hunts[]> {
    const hunts = await this.getDb().hunts.findMany({
      where: { cultural_center_id: culturalcenter_id },
    });
    return hunts;
  }

  async getByCreator(creator_id: string): Promise<hunts[]> {
    const hunts = await this.getDb().hunts.findMany({
      where: { creator_id },
    });
    return hunts;
  }
}
