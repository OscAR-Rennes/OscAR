import { Prisma, hunts } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateHuntRequestDTO } from "../dto/hunt/CreateHuntRequestDTO.js";
import { EditHuntRequestDTO } from "../dto/hunt/EditHuntRequestDTO.js";

export class HuntRepository {

  async create(huntData: CreateHuntRequestDTO): Promise<hunts> {
    const huntRecord = await prisma.hunts.create({
      data: { ...huntData },
    });
    return huntRecord;
  }

  async getAll(): Promise<hunts[]> {
    const hunts = await prisma.hunts.findMany({
      include: {
        difficulty: {
          select: {
            name: true
          }
        },
        _count: {
          select: { steps: true }
        }
      }
    });
    return hunts;
  }

  async getByID(id: string) {
    return prisma.hunts.findUnique({
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

  async getByIdRaw(id: string) {
    return prisma.hunts.findUnique({
      where: { id },
    });
  }

  async edit(huntData: EditHuntRequestDTO): Promise<hunts> {
    const huntRecord = await prisma.hunts.update({
      where: { id: huntData.id },
      data: { ...huntData },
    });
    return huntRecord;
  }

  async updateIsActive(id: string, isActive: boolean, tx?: Prisma.TransactionClient): Promise<hunts> {
    return (tx ?? prisma).hunts.update({
      where: { id },
      data: { isactive: isActive },
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    await (tx ?? prisma).hunts.delete({
      where: { id },
    });
  }

  async getByCulturalCenter(culturalcenter_id: string): Promise<hunts[]> {
    const hunts = await prisma.hunts.findMany({
      where: { cultural_center_id: culturalcenter_id },
      include: {
        difficulty: {
          select: {
            name: true
          }
        },
        _count: {
          select: { steps: true }
        }
      }
    });
    return hunts;
  }

  async getByCreator(creator_id: string): Promise<hunts[]> {
    const hunts = await prisma.hunts.findMany({
      where: { creator_id },
      include: {
        difficulty: {
          select: {
            name: true
          }
        },
        _count: {
          select: { steps: true }
        }
      }
    });
    return hunts;
  }

}
