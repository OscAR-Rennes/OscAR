import { prisma } from "../config/prismaClient";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO";
import { StepEntity } from "../entity/StepEntity";

export class StepRepository {

  async create(stepData: CreateStepRequestDTO): Promise<StepEntity> {
    const stepRecord = await prisma.step.create({
      data: {
        title: stepData.title,
        description: stepData.description,
        hunt_id: stepData.hunt_id,
        points: stepData.points,
        latitude: stepData.latitude,
        longitude: stepData.longitude,
        index_id: stepData.index_id,
      },
    });

    return new StepEntity(stepRecord);
  }
}
