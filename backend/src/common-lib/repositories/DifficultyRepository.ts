import { prisma } from "../config/prismaClient.js";
import { DifficultyEntity } from "../entity/DifficultyEntity.js";

export class DifficultyRepository {

  async getAll(): Promise<DifficultyEntity[]> {
    const difficulties = await prisma.difficulty.findMany();
    return difficulties.map(d => new DifficultyEntity(d));
  }
}
