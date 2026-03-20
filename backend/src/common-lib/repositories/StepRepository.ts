import { Prisma, steps } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO.js";
import { EditStepRequestDTO } from "../dto/step/EditStepRequestDTO.js";

export class StepRepository {

  async create(stepData: CreateStepRequestDTO): Promise<steps> {
    const stepRecord = await prisma.steps.create({
      data: { ...stepData },
    });
    return stepRecord;
  }

  async edit(stepData: EditStepRequestDTO): Promise<steps> {
    const { id, ...data } = stepData;
    return prisma.steps.update({
      where: { id },
      data,
    });
  }

  async delete(stepId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await (tx ?? prisma).steps.delete({
      where: { id: stepId },
    });
  }

  async deleteByIndexId(indexId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await (tx ?? prisma).steps.deleteMany({
      where: { index_id: indexId },
    });
  }

  async deleteByHuntId(huntId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await (tx ?? prisma).steps.deleteMany({
      where: { hunt_id: huntId },
    });
  }

  async countByIndexId(indexId: string, tx?: Prisma.TransactionClient): Promise<number> {
    return (tx ?? prisma).steps.count({
      where: { index_id: indexId },
    });
  }

  async getByIdWithHunt(id: string) {
    return prisma.steps.findUnique({
      where: { id },
      include: {
        hunts: true,
      },
    });
  }

  async getStepById(stepId: string): Promise<steps> {
    const stepRecord = await prisma.steps.findUnique({
      where: { id: stepId },
    });
    if (!stepRecord) {
      throw new Error(`Step with ID ${stepId} not found`);
    }
    return stepRecord;
  }

  async getStepsByIndexId(indexId: string): Promise<steps[]> {
    const stepRecords = await prisma.steps.findMany({
      where: { index_id: indexId },
    });
    return stepRecords;
  }

  async getStepsByHuntId(id: string): Promise<steps[]> {
    const stepRecords = await prisma.steps.findMany({
      where: { hunt_id: id },
    });
    return stepRecords;
  }

  async getAll(): Promise<steps[]> {
      const steps = await prisma.steps.findMany();
      return steps;
  }

  async getByHuntCreator(userId: string) {
    return prisma.steps.findMany({
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
    return prisma.steps.findMany({
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
    return prisma.steps.findUnique({
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
