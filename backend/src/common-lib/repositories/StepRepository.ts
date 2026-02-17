import { prisma } from "../config/prismaClient.js";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO.js";
import { StepEntity } from "../entity/StepEntity.js";

export class StepRepository {

  async create(stepData: CreateStepRequestDTO): Promise<StepEntity> {
    const stepRecord = await prisma.steps.create({
      data: { ...stepData },
    });
    return new StepEntity(stepRecord);
  }
}
