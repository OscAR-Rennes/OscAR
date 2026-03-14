import { steps } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO.js";

export class StepRepository {

  async create(stepData: CreateStepRequestDTO): Promise<steps> {
    const stepRecord = await prisma.steps.create({
      data: { ...stepData },
    });
    return stepRecord;
  }

  async delete(stepId: string): Promise<void> {
    await prisma.steps.delete({
      where: { id: stepId },
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
