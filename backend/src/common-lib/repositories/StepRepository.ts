import { Prisma, steps } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO.js";

export class StepRepository {

  private getDb(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  async create(stepData: CreateStepRequestDTO, tx?: Prisma.TransactionClient): Promise<steps> {
    const stepRecord = await this.getDb(tx).steps.create({
      data: { ...stepData },
    });
    return stepRecord;
  }

  async delete(stepId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await this.getDb(tx).steps.delete({
      where: { id: stepId },
    });
  }

  async deleteByIndexId(indexId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await this.getDb(tx).steps.deleteMany({
      where: { index_id: indexId },
    });
  }

  async deleteByHuntId(huntId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await this.getDb(tx).steps.deleteMany({
      where: { hunt_id: huntId },
    });
  }

  async countByIndexId(indexId: string, tx?: Prisma.TransactionClient): Promise<number> {
    return this.getDb(tx).steps.count({
      where: { index_id: indexId },
    });
  }

  async getByIdWithHunt(id: string, tx?: Prisma.TransactionClient) {
    return this.getDb(tx).steps.findUnique({
      where: { id },
      include: {
        hunts: true,
      },
    });
  }

  async getStepById(stepId: string): Promise<steps> {
    const stepRecord = await this.getDb().steps.findUnique({
      where: { id: stepId },
    });
    if (!stepRecord) {
      throw new Error(`Step with ID ${stepId} not found`);
    }
    return stepRecord;
  }

  async getStepsByIndexId(indexId: string): Promise<steps[]> {
    const stepRecords = await this.getDb().steps.findMany({
      where: { index_id: indexId },
    });
    return stepRecords;
  }

  async getAll(): Promise<steps[]> {
      const steps = await this.getDb().steps.findMany();
      return steps;
  }

  async getByHuntCreator(userId: string) {
    return this.getDb().steps.findMany({
      where: {
        hunts: {
          creator_id: userId
        }
      },
      include: {
        hunts: true,
        index: true
      }
    });
  }

  async getByCulturalCenter(culturalCenterId: string) {
    return this.getDb().steps.findMany({
      where: {
        hunts: {
          cultural_center_id: culturalCenterId
        }
      },
      include: {
        hunts: true,
        index: true
      }
    });
  }

  async getById(id: string) {
    return this.getDb().steps.findUnique({
      where: { id },
      include: {
        hunts: {
          include: {
            cultural_centers: true,
            users: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        index: true
      }
    });
  }

}
