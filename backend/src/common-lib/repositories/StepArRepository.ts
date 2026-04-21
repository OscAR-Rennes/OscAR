import { Prisma, step_ar, steps } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO.js";
import { EditStepRequestDTO } from "../dto/step/EditStepRequestDTO.js";

export class StepArRepository {

  async create(stepArData: any): Promise<step_ar> {
    const stepRecord = await prisma.step_ar.create({
      data: { ...stepArData },
    });
    return stepRecord;
  }

  async findFirst(stepId: string): Promise<step_ar | null> {
    return prisma.step_ar.findFirst({
      where: { step_id: stepId },
    });
  }

}
