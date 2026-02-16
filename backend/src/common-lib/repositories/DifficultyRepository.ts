import { prisma } from "../config/prismaClient";
import { DifficultyEntity } from "../entity/DifficultyEntity";

export class DifficultyRepository {

  async getAll(): Promise<DifficultyEntity[]> {
    const difficulties = await prisma.difficulty.findMany();
    return difficulties.map(d => new DifficultyEntity(d));
  }
}
